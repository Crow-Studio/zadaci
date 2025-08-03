import { sendWorkspaceDeclineMail } from '~/server/utils/emails/actions/workspace-decline'

export default defineEventHandler(async (event) => {
  try {
    const inviteCode = getRouterParam(event, 'inviteCode')
    const { email } = await readBody(event)

    if (!inviteCode || typeof inviteCode !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing workspace inviteCode!',
      })
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      throw createError({
        message: 'Invalid Email',
        statusCode: 400,
      })
    }

    // Check if workspace exists
    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.invite_code, inviteCode),
    })

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: `Workspace not found for invite: ${email}`,
      })
    }

    const invite = await useDrizzle().query.workspaceInviteRequest.findFirst({
      where: table => and(
        eq(table.email, email),
        eq(table.workspace_id, workspace.id),
      ),
    })

    if (!invite) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invite not found for ${email}.`,
      })
    }

    await useDrizzle()
      .delete(tables.workspaceInviteRequest)
      .where(
        and(
          eq(tables.workspaceInviteRequest.email, email),
          eq(tables.workspaceInviteRequest.workspace_id, workspace.id),
        ),
      )

    await sendWorkspaceDeclineMail({
      workspace: workspace.name,
      supportLink: `mailto:thecodingmontana@gmail.com`,
      email,
    })

    return {
      message: `You’ve successfully declined the invite to join ${workspace.name ? workspace.name + ' workspace.' : 'a workspace.'}`,
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ?? 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
