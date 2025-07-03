export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'WorkspaceID is required!',
      })
    }

    if (!projectId || typeof projectId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'ProjectID is required!',
      })
    }

    // check if workspace exists
    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.id, workspaceId),
    })

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid workspace!',
      })
    }

    // fetch project
    const [project] = await useDrizzle()
      .select({
        id: tables.projectTable.id,
        title: tables.projectTable.title,
        description: tables.projectTable.description,
        status: tables.projectTable.status,
        priority: tables.projectTable.priority,
        due_date: tables.projectTable.due_date,
        created_at: tables.projectTable.created_at,
        updated_at: tables.projectTable.updated_at,
        workspace_id: tables.projectTable.workspace_id,
      })
      .from(tables.projectTable)
      .where(and(
        eq(tables.projectTable.id, projectId),
        eq(tables.projectTable.workspace_id, workspaceId),
      ))

    if (!project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    // fetch members
    const members = await useDrizzle()
      .select({
        member_id: tables.workspaceMembersTable.id,
        email: tables.userTable.email,
        username: tables.userTable.username,
        avatar: tables.userTable.profile_picture_url,
      })
      .from(tables.projectMembers)
      .innerJoin(tables.workspaceMembersTable, eq(tables.projectMembers.member_id, tables.workspaceMembersTable.id))
      .innerJoin(tables.userTable, eq(tables.workspaceMembersTable.user_id, tables.userTable.id))
      .where(eq(tables.projectMembers.project_id, projectId))

    return {
      ...project,
      members,
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
