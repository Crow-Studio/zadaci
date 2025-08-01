import { render } from '@vue-email/render'
import WorkspaceInvite from '../templates/WorkspaceInvite.vue'
import { resend } from '~/server/libs/resend'

interface TeamInviteEmailProps {
  email: string
  sender: string
  workspace: string
  link: string
  expiryDate: string
}

export async function sendWorkspaceInvite({ email, link, sender, workspace, expiryDate }: TeamInviteEmailProps) {
  try {
    const html = await render(WorkspaceInvite, {
      link,
      sender,
      workspace,
      expiryDate,
    }, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `You've been invited to work together in ${workspace} workspace.`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
