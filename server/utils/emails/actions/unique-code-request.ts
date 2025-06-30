import { render } from '@vue-email/render'
import UniqueCodeRequest from '../templates/UniqueCodeRequest.vue'
import { resend } from '~/server/libs/resend'

interface Props {
  code: string
  email: string
}

export async function sendUniqueCodeRequest({ code, email }: Props) {
  try {
    const html = await render(UniqueCodeRequest, {
      code,
    }, {
      pretty: true,
    })

    await resend.emails.send({
      from: 'Team Zadaci <noreply@thecodingmontana.com>',
      to: [email],
      subject: `Your unique Zadaci sign up code is ${code}`,
      html,
    })
  }

  catch (error: any) {
    throw new Error(error.message)
  }
}
