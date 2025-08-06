export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { name } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof name !== 'string' || !name) {
      throw createError({
        statusMessage: 'Name is required!',
        statusCode: 400,
      })
    }

    if (session.user.username !== name) {
      throw createError({
        statusMessage: 'Invalid name!',
        statusCode: 400,
      })
    }

    // Check if user exists
    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user data!',
      })
    }

    // Find workspaces owned by the user
    const ownedWorkspaces = await useDrizzle().select().from(tables.workspaceTable)
      .where(eq(tables.workspaceTable.user_id, user.id))

    // Delete owned workspaces
    if (ownedWorkspaces.length > 0) {
      await Promise.all(
        ownedWorkspaces.map(workspace =>
          useDrizzle().delete(tables.workspaceTable)
            .where(eq(tables.workspaceTable.id, workspace.id)),
        ),
      )
    }

    // Remove user from team memberships
    await useDrizzle().delete(tables.workspaceMembersTable)
      .where(eq(tables.workspaceMembersTable.user_id, user.id))

    // Finally delete the user account
    await useDrizzle().delete(tables.userTable)
      .where(eq(tables.userTable.id, user.id))

    return {
      message: 'You\'ve successfully deleted your account!',
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Delete user account error: ${errorMessage}!`,
    })
  }
})
