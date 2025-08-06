import { render } from '@vue-email/render'
import TaskConfirmationMail from '../templates/TaskConfirmationMail.vue'
import { resend } from '~/server/libs/resend'

interface Props {
  email: string
  user: string
  addedBy: string
  project: string
  workspace: string
  link: string
  task: string
}

export async function sendTaskAssignmentEmail({
  email,
  user,
  addedBy,
  project,
  workspace,
  link,
  task,
}: Props) {
  try {
    const html = await render(TaskConfirmationMail, {
      email,
      user,
      addedBy,
      project,
      workspace,
      link,
      task,
    }, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `You’ve been assigned to the task in the ${workspace} workspace!`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
