import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { encryptString } from '~/server/utils/encryption'
import { generateRandomRecoveryCode } from '~/server/utils'
import { sendWorkspaceWelcomeMail } from '~/server/utils/emails/actions/workspace-welcome'

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
        statusMessage: `Workspace not found for invite code: ${inviteCode}`,
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

    // create user
    const recoveryCode = generateRandomRecoveryCode()
    const encryptedRecoveryCode = encryptString(recoveryCode)
    const serializedRecoveryCode = Buffer.from(encryptedRecoveryCode).toString(
      'base64',
    )

    // check if user exists
    const existingUser = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (!existingUser) {
      const [newUser] = await useDrizzle()
        .insert(tables.userTable)
        .values({
          email,
          id: uuidv4(),
          recovery_code: serializedRecoveryCode,
          username: `${faker.person.firstName()} ${faker.person.lastName()}`,
          email_verified: false,
          profile_picture_url: `https://avatar.vercel.sh/${email}`,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()

      // add user to the workspace.
      await useDrizzle()
        .insert(tables.workspaceMembersTable)
        .values({
          id: uuidv4(),
          role: invite.role,
          workspace_id: workspace.id,
          user_id: newUser.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
    }
    else {
      // add user to the workspace.
      await useDrizzle()
        .insert(tables.workspaceMembersTable)
        .values({
          id: uuidv4(),
          role: invite.role,
          workspace_id: workspace.id,
          user_id: existingUser.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
    }

    // delete invite
    await useDrizzle()
      .delete(tables.workspaceInviteRequest)
      .where(
        and(
          eq(tables.workspaceInviteRequest.email, email),
          eq(tables.workspaceInviteRequest.workspace_id, workspace.id),
        ),
      )

    const message = existingUser ? `You’ve been successfully added to ${workspace.name ? `${workspace.name} workspace` : 'a workspace'}.` : `You’ve been successfully added to ${workspace.name ? `${workspace.name} workspace` : 'a workspace'}, and an account has been created for you.`

    await sendWorkspaceWelcomeMail({
      email,
      link: `${process.env.NUXT_PUBLIC_SITE_URL}/invite/${workspace.invite_code}?email=${email}`,
      workspace: workspace.name,
    })

    return {
      message,
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
