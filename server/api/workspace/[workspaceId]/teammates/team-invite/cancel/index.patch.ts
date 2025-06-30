import { eq } from 'drizzle-orm'
import { tables, useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { workspaceId } = event.context.params as { workspaceId: string }
    const { invites } = await readBody(event) as {
      invites: { email: string, inviteCode: string }[]
    }

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

    if (!Array.isArray(invites) || invites.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one invite is required.',
      })
    }

    const messages: string[] = []

    for (const { email, inviteCode } of invites) {
      if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid email: ${email}`,
        })
      }

      if (!inviteCode || typeof inviteCode !== 'string') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invite code is required.',
        })
      }

      const invite = await useDrizzle().query.workspaceInviteRequest.findFirst({
        where: table => and(
          eq(table.email, email),
          eq(table.workspace_id, workspaceId),
        ),
      })

      if (!invite) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invite not found for ${email}.`,
        })
      }

      if (invite.email !== session.user.email) {
        throw createError({
          statusCode: 403,
          statusMessage: `You are not authorized to decline invite for ${email}.`,
        })
      }

      const workspace = await useDrizzle().query.workspaceTable.findFirst({
        where: table =>
          and(
            eq(table.invite_code, inviteCode),
            eq(table.id, invite.workspace_id),
          ),
      })

      if (!workspace) {
        throw createError({
          statusCode: 400,
          statusMessage: `Workspace not found for invite: ${email}`,
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

      // todo: add notification flow here

      //   await sendEmail({
      //     to: session.user.email,
      //     subject: `❌ Invite Declined for ${workspace?.name || 'Workspace'}`,
      //     html: `
      //       <p>Hi ${session.user.name || 'there'},</p>
      //       <p>You've successfully declined the invite to join <strong>${workspace?.name || 'this workspace'}</strong>.</p>
      //       <p>If this was a mistake, please ask the admin to resend the invite.</p>
      //     `,
      //   })

      messages.push(`You’ve successfully declined the invite to join ${workspace.name ? workspace.name + ' workspace.' : 'a workspace.'}`)
    }

    return {
      message: messages.join(', '),
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
