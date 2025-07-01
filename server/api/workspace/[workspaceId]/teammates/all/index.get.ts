import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'WorkspaceId is required!',
      })
    }

    // Check if workspace exists
    const existingWorkspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.id, workspaceId),
    })

    if (!existingWorkspace) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workspace not found!',
      })
    }

    // return all workspace teammates for the specific workspace
    const teammates = await useDrizzle()
      .select({
        email: tables.userTable.email,
        avatar: tables.userTable.profile_picture_url,
        username: tables.userTable.username,
        id: tables.userTable.id,
      })
      .from(tables.workspaceMembersTable)
      .innerJoin(tables.userTable, eq(tables.userTable.id, tables.workspaceMembersTable.user_id))
      .where(eq(tables.workspaceMembersTable.workspace_id, workspaceId))

    return teammates
  }
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusMessage: errorMessage,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
