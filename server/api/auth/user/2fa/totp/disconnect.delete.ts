import { encodeHexLowerCase } from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import { deleteUserTOTPKey } from '~/server/libs/totp'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    await deleteUserTOTPKey(session.user.id)

    const passkeys = await useDrizzle().query.passkeysTable.findMany({
      where: table => eq(table.user_id, session.user.id),
    })

    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user data!',
      })
    }

    if (passkeys.length <= 0 && user.registered_2fa) {
      // update user details
      await useDrizzle().update(tables.userTable).set({
        updated_at: new Date(),
        registered_2fa: false,
      }).where(eq(tables.userTable.id, session.user.id))

      // update user session
      if (session?.sessionToken) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(session.sessionToken)))
        await useDrizzle()
          .update(tables.sessionTable)
          .set({ two_factor_verified: false })
          .where(eq(tables.sessionTable.id, sessionId))
      }

      await setUserSession(event, {
        user: {
          ...session.user,
          twoFactorVerified: false,
          registered2FA: false,
          registeredTOTP: false,
        },
      })
    }
    else {
      await setUserSession(event, {
        user: {
          ...session.user,
          registeredTOTP: false,
        },
      })
    }

    return {
      message: 'You\'ve successfully disconnected your TOTP setup!',
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
