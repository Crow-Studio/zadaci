import { Resend } from 'resend'

export const resend = new Resend(process.env.NUXT_RESEND_API_KEY)
