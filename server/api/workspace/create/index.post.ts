import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const body = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (!body.image) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workspace image is required!',
      })
    }

    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workspace name is required!',
      })
    }

    // generate a random 6 digit code
    const inviteCode = generateUniqueCode(6) // 6 digit code

    const [workspace] = await useDrizzle().insert(tables.workspaceTable).values({
      id: uuidv4(),
      image_url: body.image,
      invite_code: inviteCode,
      name: body.name,
      user_id: session.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning()

    await useDrizzle()
      .insert(tables.workspaceMembersTable)
      .values({
        id: uuidv4(),
        role: 'OWNER',
        workspace_id: workspace.id,
        user_id: session.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()

    return { workspace }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Failed to create workspace: ${errorMessage}!`,
    })
  }
})
