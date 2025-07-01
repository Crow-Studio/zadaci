import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    const userId = session.user.id
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid workspaceId!',
      })
    }

    const projects = await useDrizzle()
      .select({
        id: tables.projectTable.id,
        title: tables.projectTable.title,
        description: tables.projectTable.description,
        status: tables.projectTable.status,
        priority: tables.projectTable.priority,
        dueDate: tables.projectTable.due_date,
        workspaceId: tables.projectTable.workspace_id,
        createdAt: tables.projectTable.created_at,
        updatedAt: tables.projectTable.updated_at,
      })
      .from(tables.projectTable)
      .innerJoin(
        tables.projectMembers,
        eq(tables.projectMembers.project_id, tables.projectTable.id),
      )
      .innerJoin(
        tables.workspaceMembersTable,
        eq(tables.workspaceMembersTable.id, tables.projectMembers.member_id),
      )
      .where(
        and(
          eq(tables.workspaceMembersTable.user_id, userId),
          eq(tables.workspaceMembersTable.workspace_id, workspaceId),
        ),
      )

    return projects
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Failed to fetch projects: ${errorMessage}!`,
    })
  }
})
