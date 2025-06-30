import { and, eq } from 'drizzle-orm'
import type { SessionFlags } from '~/server/libs/session'
import { createSession, generateSessionToken } from '~/server/libs/session'
import { isValidEmail } from '~/server/utils/validations'
import { isWithinExpirationDate } from '~/server/utils'
import { createSessionMetadata } from '~/server/utils/authHelpers'

export default defineEventHandler(async (event) => {
  try {
    const { email, code } = await readBody(event)

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      throw createError({
        message: 'Invalid Email',
        statusCode: 400,
      })
    }

    if (typeof code !== 'string' || code.length !== 8) {
      throw createError({
        statusMessage: 'Invalid unique code!',
        statusCode: 400,
      })
    }

    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (!user) {
      throw createError({
        message: 'Invalid user!',
        statusCode: 400,
      })
    }

    const uniqueCodeRequest = await useDrizzle().query.uniqueCodeTable.findFirst({
      where: table => and(
        eq(table.email, email),
        eq(table.code, code),
      ),
    })

    if (!uniqueCodeRequest) {
      throw createError({
        message: 'Invalid unique code!',
        statusCode: 400,
      })
    }

    if (!isWithinExpirationDate(uniqueCodeRequest.expires_at)) {
      throw createError({
        message: 'The unique code has expired!',
        statusCode: 498,
      })
    }

    await useDrizzle().delete(tables.uniqueCodeTable).where(eq(tables.uniqueCodeTable.id, uniqueCodeRequest.id))

    const sessionFlags: SessionFlags = {
      twoFactorVerified: false,
    }

    const sessionToken = generateSessionToken()
    const { browser, device, ipAdress, location, os } = await createSessionMetadata(event)
    const session = await createSession(sessionToken, user.id, sessionFlags, browser, device, os, location, ipAdress)

    const passkeys = await useDrizzle().query.passkeysTable.findMany({
      where: table => (eq(table.user_id, user.id)),
    })

    const totp = await useDrizzle().query.totpCredential.findFirst({
      where: table => (eq(table.user_id, user.id)),
    })

    const registeredPasskey = passkeys.length > 0 ? true : false

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        emailVerified: user.email_verified,
        avatar: user.profile_picture_url,
        registeredTOTP: totp ? true : false,
        registeredPasskey,
        registered2FA: user.registered_2fa,
        twoFactorVerified: false,
      },
      sessionToken: sessionToken,
    }, {
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000), // Convert milliseconds to seconds
    })

    return {
      message: 'Successfully signed in!',
    }
  }

  catch (error: any) {
    throw createError({
      message: `Failed to signin: ${error.message}`,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
