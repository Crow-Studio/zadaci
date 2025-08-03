import { render } from '@vue-email/render'
import WorkspaceDecline from '../templates/WorkspaceDecline.vue'
import { resend } from '~/server/libs/resend'

interface TeamInviteEmailProps {
  email: string
  workspace: string
  supportLink: string
}

export async function sendWorkspaceDeclineMail({ email, workspace, supportLink }: TeamInviteEmailProps) {
  try {
    const html = await render(WorkspaceDecline, {
      workspace,
      supportLink,
    }, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `❌ Invite Declined for ${workspace} workspace.`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
