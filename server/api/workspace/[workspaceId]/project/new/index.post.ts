import { v4 as uuidv4 } from 'uuid'
import { eq, and, inArray } from 'drizzle-orm'
import { type Teammate, type Priority, type Status, validStatuses, validPriorities } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    const { title, status, dueDate, description, priority, assignees } = await readBody(event) as {
      description: string
      dueDate: Date | undefined
      title: string
      status: Status
      priority: Priority
      assignees: Teammate[]
    }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (typeof workspaceId !== 'string' || !workspaceId) {
      throw createError({
        statusMessage: 'Invalid workspaceId!',
        statusCode: 400,
      })
    }

    if (typeof title !== 'string' || !title) {
      throw createError({
        statusMessage: 'Invalid title!',
        statusCode: 400,
      })
    }

    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      throw createError({
        statusMessage: 'Invalid Status!',
        statusCode: 400,
      })
    }

    if (typeof priority !== 'string' || !validPriorities.includes(priority)) {
      throw createError({
        statusMessage: 'Invalid Priority!',
        statusCode: 400,
      })
    }

    if (description !== undefined && typeof description !== 'string') {
      throw createError({
        statusMessage: 'Invalid description!',
        statusCode: 400,
      })
    }

    if (dueDate !== undefined && typeof dueDate !== 'string') {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    if (assignees !== undefined) {
      if (!Array.isArray(assignees)) {
        throw createError({
          statusMessage: 'Assignees must be an array!',
          statusCode: 400,
        })
      }

      for (const assignee of assignees) {
        if (!assignee || typeof assignee !== 'object') {
          throw createError({
            statusMessage: 'Invalid assignee format!',
            statusCode: 400,
          })
        }

        if (typeof assignee.id !== 'string' || !assignee.id) {
          throw createError({
            statusMessage: 'Each assignee must have a valid id!',
            statusCode: 400,
          })
        }
      }
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined

    if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    await useDrizzle().transaction(async (tx) => {
      // Create the new project
      const [project] = await tx.insert(tables.projectTable).values({
        id: uuidv4(),
        title,
        description,
        due_date: parsedDueDate,
        priority,
        status,
        workspace_id: workspaceId,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning()

      let assigneeIds: string[] = []

      if (assignees && assignees.length > 0) {
        assigneeIds = assignees.map(assignee => assignee.id).filter(Boolean)

        if (assigneeIds.length > 0) {
          // Validate that all assignees exist in the workspace
          const existingMembers = await tx
            .select({ id: tables.userTable.id })
            .from(tables.userTable)
            .innerJoin(
              tables.workspaceMembersTable,
              eq(tables.workspaceMembersTable.user_id, tables.userTable.id),
            )
            .where(
              and(
                inArray(tables.userTable.id, assigneeIds),
                eq(tables.workspaceMembersTable.workspace_id, workspaceId),
              ),
            )

          const existingMemberIds = existingMembers.map(m => m.id)
          const invalidAssignees = assigneeIds.filter(id => !existingMemberIds.includes(id))

          if (invalidAssignees.length > 0) {
            throw createError({
              statusMessage: 'Some assignees are not valid workspace members!',
              statusCode: 400,
            })
          }

          // Get workspace member IDs for the assignees
          const workspaceMemberRecords = await tx
            .select({ id: tables.workspaceMembersTable.id })
            .from(tables.workspaceMembersTable)
            .where(
              and(
                inArray(tables.workspaceMembersTable.user_id, assigneeIds),
                eq(tables.workspaceMembersTable.workspace_id, workspaceId),
              ),
            )

          const projectMembersToInsert = workspaceMemberRecords.map(member => ({
            id: uuidv4(),
            project_id: project.id,
            member_id: member.id,
            created_at: new Date(),
            updated_at: new Date(),
          }))

          if (projectMembersToInsert.length > 0) {
            await tx.insert(tables.projectMembers).values(projectMembersToInsert)
          }
        }
      }

      // todo: Send email notifications to assignees
    })

    return {
      message: 'Project created successfully!',
    }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Workspace new project error: ${errorMessage}!`,
    })
  }
})
