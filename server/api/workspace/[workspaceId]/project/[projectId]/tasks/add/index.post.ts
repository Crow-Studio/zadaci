import { inArray, and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { sendTaskAssignmentEmail } from '~/server/utils/emails/actions/send-task-assignment'
import type { Priority, ProjectMembers, Status } from '~/types'
import { appLink, validPriorities, validStatuses } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')

    const { name, status, dueDate, description, priority, subtasks, assignees }
      = await readBody(event) as {
        description?: string
        dueDate?: string | Date
        name: string
        status: Status
        priority: Priority
        subtasks?: { name: string, is_completed: boolean }[]
        assignees: ProjectMembers[]
      }

    // Validate session and required fields
    if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized!' })
    if (typeof workspaceId !== 'string' || !workspaceId)
      throw createError({ statusCode: 400, statusMessage: 'Invalid workspace ID!' })
    if (typeof projectId !== 'string' || !projectId)
      throw createError({ statusCode: 400, statusMessage: 'Project ID is required!' })
    if (typeof name !== 'string' || !name)
      throw createError({ statusCode: 400, statusMessage: 'Invalid task title!' })
    if (typeof status !== 'string' || !validStatuses.includes(status))
      throw createError({ statusCode: 400, statusMessage: 'Invalid status!' })
    if (typeof priority !== 'string' || !validPriorities.includes(priority))
      throw createError({ statusCode: 400, statusMessage: 'Invalid priority!' })
    if (description !== undefined && typeof description !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Invalid description!' })
    if (dueDate !== undefined && typeof dueDate !== 'string' && !(dueDate instanceof Date))
      throw createError({ statusCode: 400, statusMessage: 'Invalid due date!' })
    if (!assignees || !Array.isArray(assignees) || assignees.length === 0)
      throw createError({ statusCode: 400, statusMessage: 'At least one assigned member is required!' })

    // Validate each assignee
    for (const member of assignees) {
      if (!member || typeof member !== 'object')
        throw createError({ statusCode: 400, statusMessage: 'Invalid assigned member format!' })
      if (typeof member.member_id !== 'string' || !member.member_id)
        throw createError({ statusCode: 400, statusMessage: 'Each assigned member must have a valid ID!' })
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined
    if (parsedDueDate && isNaN(parsedDueDate.getTime()))
      throw createError({ statusCode: 400, statusMessage: 'Invalid due date!' })

    const memberIds = assignees.map(m => m.member_id)

    // Check that assignees belong to the workspace
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

    // Verify that the project exists
    const project = await useDrizzle().query.projectTable.findFirst({
      where: table => and(
        eq(table.id, projectId),
        eq(table.workspace_id, workspaceId),
      ),
    })
    if (!project) throw createError({ statusCode: 400, statusMessage: 'Invalid project!' })

    // Check that assignees belong to the project
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
      // Fetch usernames of invalid members
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

    // Create the task
    const [task] = await useDrizzle().insert(tables.tasksTable).values({
      id: uuidv4(),
      name,
      project_id: project.id,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      priority,
      status,
      due_date: parsedDueDate,
    }).returning()

    // Create subtasks if provided
    if (subtasks && subtasks.length > 0) {
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

    // Create task assignees
    const assigneeValues = assignees.map(member => ({
      id: uuidv4(),
      task_id: task.id,
      member_id: member.member_id,
      assigned_at: new Date(),
    }))

    await useDrizzle().insert(tables.taskAssigneesTable).values(assigneeValues)

    // Fetch user details for each member to send emails
    const users = await useDrizzle().query.workspaceMembersTable.findMany({
      where: inArray(tables.workspaceMembersTable.id, memberIds),
      with: {
        user: true,
      },
    })

    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.id, workspaceId),
    })

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid workspace!',
      })
    }

    for (const user of users) {
      if (!user.user?.email || user.user_id === session.user.id) continue

      await sendTaskAssignmentEmail({
        email: user.user.email,
        user: user.user.username,
        addedBy: session.user.username,
        project: project.title,
        workspace: workspace.name,
        link: `${appLink}/workspace/${workspaceId}/projects/${project.id}`,
        task: task.name,
      })
    }

    return {
      message: 'Task created successfully',
      task,
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Create task error: ${errorMessage}!`,
    })
  }
})
