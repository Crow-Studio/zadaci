import { exists } from 'drizzle-orm'
import { useDrizzle } from '~/server/utils/drizzle'

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

    // Check if user exists in the workspace
    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: workspace =>
        and(
          eq(workspace.id, workspaceId),
          exists(
            useDrizzle()
              .select()
              .from(tables.workspaceMembersTable)
              .where(
                and(
                  eq(tables.workspaceMembersTable.workspace_id, workspaceId),
                  eq(tables.workspaceMembersTable.user_id, session.user.id),
                ),
              ),
          ),
        ),
      with: {
        members: true,
      },
    })

    return workspace
  }
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusMessage: errorMessage,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
