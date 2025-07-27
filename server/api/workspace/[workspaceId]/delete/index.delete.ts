import { eq, and, exists, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { name } = await readBody(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (!name || typeof name !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Workspace name is required!' })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'WorkspaceId is required!' })
    }

    const userWorkspace = await useDrizzle().query.workspaceMembersTable.findFirst({
      where: table => and(
        eq(table.workspace_id, workspaceId),
        eq(table.user_id, session.user.id),
      ),
    })

    if (!userWorkspace || userWorkspace.role !== 'OWNER') {
      throw createError({ statusCode: 403, statusMessage: 'Not authorized to delete workspace!' })
    }

    await useDrizzle().delete(tables.workspaceTable).where(eq(tables.workspaceTable.id, workspaceId))

    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: workspace =>
        exists(
          useDrizzle().select()
            .from(tables.workspaceMembersTable)
            .where(and(
              eq(tables.workspaceMembersTable.workspace_id, workspace.id),
              eq(tables.workspaceMembersTable.user_id, session.user.id),
            )),
        ),
      orderBy: workspace => desc(workspace.created_at),
    })

    return {
      workspace: workspace && {
        id: workspace.id,
        name: workspace.name,
        imageUrl: workspace.image_url,
        inviteCode: workspace.invite_code,
        userRole: userWorkspace.role,
        createdAt: workspace.created_at,
        updatedAt: workspace.updated_at,
      },
      message: `You've successfully deleted ${name} workspace!`,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
