import { render } from '@vue-email/render'
import Waitlist from '../templates/Waitlist.vue'
import { resend } from '~/server/libs/resend'

interface Props {
  email: string
}

export async function sendWaitlistMail({ email }: Props) {
  try {
    const html = await render(Waitlist, {}, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `You're on the waitlist!`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
