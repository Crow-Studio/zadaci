import { inArray, and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { sendTaskCompletionMail } from '~/server/utils/emails/actions/completed-task copy'
import type { Priority, ProjectMembers, Status } from '~/types'
import { validPriorities, validStatuses } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')
    const taskId = getRouterParam(event, 'taskId')

    const { name, status, dueDate, description, priority, subtasks, assignees } = await readBody(event) as {
      description?: string
      dueDate?: string | Date
      name: string
      status: Status
      priority: Priority
      subtasks?: { name: string, is_completed: boolean }[]
      assignees: ProjectMembers[]
    }

    if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized!' })
    if (typeof workspaceId !== 'string' || !workspaceId) throw createError({ statusCode: 400, statusMessage: 'Invalid workspace ID!' })
    if (!projectId || typeof projectId !== 'string') throw createError({ statusCode: 400, statusMessage: 'ProjectID is required!' })
    if (!taskId || typeof taskId !== 'string') throw createError({ statusCode: 400, statusMessage: 'TaskID is required!' })
    if (typeof name !== 'string' || !name) throw createError({ statusCode: 400, statusMessage: 'Invalid name!' })
    if (typeof status !== 'string' || !validStatuses.includes(status)) throw createError({ statusCode: 400, statusMessage: 'Invalid Status!' })
    if (typeof priority !== 'string' || !validPriorities.includes(priority)) throw createError({ statusCode: 400, statusMessage: 'Invalid Priority!' })
    if (description !== undefined && typeof description !== 'string') throw createError({ statusCode: 400, statusMessage: 'Invalid description!' })
    if (dueDate !== undefined && typeof dueDate !== 'string' && !(dueDate instanceof Date)) throw createError({ statusCode: 400, statusMessage: 'Invalid due date!' })
    if (!assignees || !Array.isArray(assignees) || assignees.length === 0)
      throw createError({ statusCode: 400, statusMessage: 'At least one assigned member is required!' })

    if (
      subtasks !== undefined
      && (!Array.isArray(subtasks) || !subtasks.every(item =>
        typeof item === 'object'
        && item !== null
        && 'name' in item
        && 'is_completed' in item
        && typeof item.name === 'string'
        && typeof item.is_completed === 'boolean'))
    ) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid subtasks!' })
    }

    for (const member of assignees) {
      if (!member || typeof member !== 'object') throw createError({ statusCode: 400, statusMessage: 'Invalid assigned member format!' })
      if (typeof member.member_id !== 'string' || !member.member_id) throw createError({ statusCode: 400, statusMessage: 'Each assigned member must have a valid ID!' })
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined
    if (parsedDueDate && isNaN(parsedDueDate.getTime())) throw createError({ statusCode: 400, statusMessage: 'Invalid due date!' })

    const memberIds = assignees.map(m => m.member_id)

    const validWorkspaceMembers = await useDrizzle().query.workspaceMembersTable.findMany({
      where: and(
        inArray(tables.workspaceMembersTable.id, memberIds),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
      ),
      columns: { id: true },
    })

    const validWorkspaceIds = validWorkspaceMembers.map(m => m.id)
    const invalidWorkspaceMembers = memberIds.filter(id => !validWorkspaceIds.includes(id))
    if (invalidWorkspaceMembers.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid assignees (not in workspace): ${invalidWorkspaceMembers.join(', ')}`,
      })
    }

    const project = await useDrizzle().query.projectTable.findFirst({
      where: and(
        eq(tables.projectTable.id, projectId),
        eq(tables.projectTable.workspace_id, workspaceId),
      ),
      with: {
        workspace: true,
      },
    })

    if (!project) throw createError({ statusCode: 400, statusMessage: 'Invalid Project!' })

    const validProjectMembers = await useDrizzle().query.projectMembers.findMany({
      where: and(
        inArray(tables.projectMembers.member_id, memberIds),
        eq(tables.projectMembers.project_id, project.id),
      ),
      columns: { member_id: true },
    })

    const validProjectIds = validProjectMembers.map(m => m.member_id)
    const invalidProjectMembers = memberIds.filter(id => !validProjectIds.includes(id))

    if (invalidProjectMembers.length) {
      const invalidUsers = await useDrizzle().query.workspaceMembersTable.findMany({
        where: inArray(tables.workspaceMembersTable.id, invalidProjectMembers),
        with: { user: true },
        columns: { id: true },
      })

      const invalidNames = invalidUsers.map(m => m.user.username).join(', ')
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid assigned members (not in project): ${invalidNames}`,
      })
    }

    const existingTask = await useDrizzle().query.tasksTable.findFirst({
      where: and(
        eq(tables.tasksTable.id, taskId),
        eq(tables.tasksTable.project_id, projectId),
      ),
    })

    if (!existingTask) throw createError({ statusCode: 404, statusMessage: 'Task not found!' })

    const [task] = await useDrizzle().update(tables.tasksTable).set({
      name,
      description,
      updated_at: new Date(),
      priority,
      status,
      due_date: parsedDueDate || null,
    }).where(and(
      eq(tables.tasksTable.id, taskId),
      eq(tables.tasksTable.project_id, projectId),
    )).returning()

    // save the task activity if task is either status is changed to 'COMPLETED' or 'IN REVIEW' or 'ABANDONED'
    if (['COMPLETED', 'IN REVIEW', 'ABANDONED'].includes(status)) {
      const member = await useDrizzle().query.workspaceMembersTable.findFirst({
        where: m => and(
          eq(m.workspace_id, workspaceId),
          eq(m.user_id, session.user.id),
        ),
        columns: { id: true },
      })

      if (!member) {
        throw createError({
          statusCode: 403,
          statusMessage: 'You are not a member of this workspace!',
        })
      }

      await useDrizzle().insert(tables.tasksActivityTable).values({
        id: uuidv4(),
        task_id: taskId,
        changed_by: member.id,
        status,
        changed_at: new Date(),
      })
    }

    if (subtasks && subtasks.length > 0) {
      await useDrizzle().delete(tables.subtasksTable).where(eq(tables.subtasksTable.task_id, task.id))

      const subtaskValues = subtasks.map(subtask => ({
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        name: subtask.name,
        task_id: task.id,
        is_completed: subtask.is_completed,
      }))

      await useDrizzle().insert(tables.subtasksTable).values(subtaskValues)
    }
    else {
      await useDrizzle().delete(tables.subtasksTable).where(eq(tables.subtasksTable.task_id, task.id))
    }

    if (assignees && assignees.length > 0) {
      await useDrizzle().delete(tables.taskAssigneesTable).where(eq(tables.taskAssigneesTable.task_id, task.id))

      const assigneeValues = assignees.map(member => ({
        id: uuidv4(),
        task_id: task.id,
        member_id: member.member_id,
        assigned_at: new Date(),
      }))

      await useDrizzle().insert(tables.taskAssigneesTable).values(assigneeValues)

      if (status === 'COMPLETED') {
        for (const member of assignees) {
          await sendTaskCompletionMail({
            workspace: project.workspace.name,
            user: member.username as string,
            project: project.title,
            completedBy: session.user.username,
            link: `${process.env.NUXT_PUBLIC_SITE_URL}/workspace/${project.workspace.id}/projects/${project.id}`,
            email: member.email,
            task: task.name,
          })
        }
      }
    }

    return { message: 'Task updated successfully' }
  }

  catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Update Task error: ${errorMessage}!`,
    })
  }
})
