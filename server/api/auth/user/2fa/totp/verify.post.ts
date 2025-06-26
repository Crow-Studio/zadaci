import { encodeHexLowerCase } from '@oslojs/encoding'
import { verifyTOTP } from '@oslojs/otp'
import { sha256 } from '@oslojs/crypto/sha2'
import { getUserTOTPKey } from '~/server/libs/totp'
import { setSessionAs2FAVerified } from '~/server/libs/session'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { code } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof code !== 'string') {
      throw createError({
        statusMessage: 'Invalid or missing fields!',
        statusCode: 400,
      })
    }

    if (code === '' || !code) {
      throw createError({
        statusMessage: 'Code is required!',
        statusCode: 400,
      })
    }

    const totpKey = await getUserTOTPKey(session.user.id)

    if (totpKey === null) {
      throw createError({
        statusMessage: 'Forbidden!',
        statusCode: 403,
      })
    }

    if (!verifyTOTP(totpKey, 30, 6, code)) {
      throw createError({
        statusMessage: 'Invalid code!',
        statusCode: 400,
      })
    }

    // update user session
    if (session?.sessionToken) {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(session.sessionToken)))
      await setSessionAs2FAVerified(sessionId)
    }

    await setUserSession(event, {
      user: {
        ...session.user,
        twoFactorVerified: true,
      },
    })

    return {
      message: 'You\'ve successfully verified your account!',
    }
  }

  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
