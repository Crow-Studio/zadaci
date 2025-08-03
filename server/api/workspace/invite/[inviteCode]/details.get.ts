import { useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const inviteCode = getRouterParam(event, 'inviteCode')
    const query = getQuery(event) as { email: string }

    if (!inviteCode || typeof inviteCode !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing workspace inviteCode! We\'re unable to load the workspace invite data',
      })
    }

    if (!query.email || query.email === 'undefined') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing email query! Email is required for an automatic joining of the workspace!',
      })
    }

    if (!isValidEmail(query.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email. We\'re unable to load the workspace invite data!',
      })
    }

    if (inviteCode.length !== 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invite code length. We\'re unable to load the workspace invite data',
      })
    }

    // Check if workspace exists
    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.invite_code, inviteCode),
      with: {
        owner: {
          columns: {
            email: true,
            profile_picture_url: true,
            username: true,
          },
        },
      },
    })

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: 'We couldn\'t be able to find the workspace for the invite! Kindly request a new workspace invite mail.',
      })
    }

    const invite = await useDrizzle().query.workspaceInviteRequest.findFirst({
      where: table => and(
        eq(table.email, query.email),
        eq(table.workspace_id, workspace.id),
      ),
    })

    if (!invite) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid invite! We couldn't be able to find the invite for ${query.email}. Kindly request a new workspace invite mail.`,
      })
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invite for ${query.email} has expired. Kindly request a new workspace invite mail.`,
      })
    }

    return workspace
  }
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusMessage: errorMessage,
      statusCode: error ? error.statusCode : 500,
    })
  }
})
