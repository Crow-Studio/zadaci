export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    const [workspace] = await useDrizzle()
      .select({
        id: tables.workspaceTable.id,
        name: tables.workspaceTable.name,
        imageUrl: tables.workspaceTable.image_url,
        inviteCode: tables.workspaceTable.invite_code,
        userRole: tables.workspaceMembersTable.role,
        createdAt: tables.workspaceTable.created_at,
        updatedAt: tables.workspaceTable.updated_at,
      })
      .from(tables.workspaceTable)
      .innerJoin(
        tables.workspaceMembersTable,
        and(
          eq(tables.workspaceMembersTable.workspace_id, tables.workspaceTable.id),
          eq(tables.workspaceMembersTable.user_id, session.user.id),
        ),
      )

    return {
      username: user ? user.username : '',
      workspace: workspace ? workspace : null,
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
