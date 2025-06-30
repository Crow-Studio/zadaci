import { eq } from 'drizzle-orm'
import { useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { image, name } = await readBody(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (!image || typeof image !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workspace image is required!',
      })
    }

    if (!name || typeof name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workspace name is required!',
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

    // Check if user is an owner in the workspace
    const userWorkspace = await useDrizzle().query.workspaceMembersTable.findFirst({
      where: table => and(
        eq(table.workspace_id, workspaceId),
        eq(table.user_id, session.user.id),
      ),
    })

    if (!userWorkspace || userWorkspace.role !== 'OWNER') {
      throw createError({
        statusCode: 403,
        statusMessage: 'User is not authorized to update this workspace!',
      })
    }

    // update workspace details
    const [workspace] = await useDrizzle().update(tables.workspaceTable).set({
      name,
      image_url: image,
      updated_at: new Date(),
    }).where(eq(tables.workspaceTable.id, workspaceId)).returning()

    return {
      workspace,
      message: 'You\'ve successfully updated your workspace!',
    }
  }
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusMessage: errorMessage,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
