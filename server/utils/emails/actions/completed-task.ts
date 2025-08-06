import { render } from '@vue-email/render'
import CompletedTaskMail from '../templates/CompletedTaskMail.vue'
import { resend } from '~/server/libs/resend'

interface TaskCompletionMailProps {
  email: string
  user: string
  task: string
  project: string
  workspace: string
  completedBy: string
  link: string
}

export async function sendTaskCompletionMail({ email, workspace, user, task, project, completedBy, link }: TaskCompletionMailProps) {
  try {
    const html = await render(CompletedTaskMail, {
      workspace,
      user,
      task,
      project,
      completedBy,
      link,
    }, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `✅ Your task has been marked as completed!`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
