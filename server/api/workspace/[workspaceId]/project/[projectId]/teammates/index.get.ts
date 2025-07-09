import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Workspace ID is required!' })
    }

    if (!projectId || typeof projectId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Project ID is required!' })
    }

    // Check if the project exists and belongs to the workspace
    const project = await useDrizzle().query.projectTable.findFirst({
      where: table => and(
        eq(table.id, projectId),
        eq(table.workspace_id, workspaceId),
      ),
    })

    if (!project) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid project!' })
    }

    // Fetch all project members (joined with user info)
    const projectMembers = await useDrizzle()
      .select({
        email: tables.userTable.email,
        avatar: tables.userTable.profile_picture_url,
        username: tables.userTable.username,
        member_id: tables.workspaceMembersTable.id,
      })
      .from(tables.projectMembers)
      .innerJoin(
        tables.workspaceMembersTable,
        eq(tables.projectMembers.member_id, tables.workspaceMembersTable.id),
      )
      .innerJoin(
        tables.userTable,
        eq(tables.userTable.id, tables.workspaceMembersTable.user_id),
      )
      .where(eq(tables.projectMembers.project_id, projectId))

    return projectMembers
  }
  catch (error: any) {
    const errorMessage = error?.statusMessage || error.message || 'Unknown error'
    throw createError({
      statusMessage: errorMessage,
      statusCode: error.statusCode || 500,
    })
  }
})
