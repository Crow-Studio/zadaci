import { eq } from 'drizzle-orm'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeHexLowerCase,
} from '@oslojs/encoding'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const passkeyId = getRouterParam(event, 'passkeyId')

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (!passkeyId || typeof passkeyId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'passkeyId is required!',
      })
    }

    // Check if passkey exists
    const existingPasskey = await useDrizzle().query.passkeysTable.findFirst({
      where: table => and(
        eq(table.id, passkeyId),
        eq(table.userId, session.user.id),
      ),
    })

    if (!existingPasskey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid passkey data!',
      })
    }

    await useDrizzle().delete(tables.passkeysTable).where(
      and(
        eq(tables.passkeysTable.id, passkeyId),
        eq(tables.passkeysTable.userId, session.user.id),
      ),
    )

    const passkeys = await useDrizzle().query.passkeysTable.findMany({
      where: table => eq(table.userId, session.user.id),
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

    if (passkeys.length <= 0 && user.registered2FA) {
      // check if user has a totp credential
      const totp = await useDrizzle().query.totpCredential.findFirst({
        where: table => eq(table.userId, session.user.id),
      })

      if (!totp) {
        // update user details
        await useDrizzle().update(tables.userTable).set({
          updatedAt: new Date(),
          registered2FA: false,
        }).where(eq(tables.userTable.id, session.user.id))

        // update user session
        if (session?.sessionToken) {
          const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(session.sessionToken)))
          await useDrizzle()
            .update(tables.sessionTable)
            .set({ twoFactorVerified: false })
            .where(eq(tables.sessionTable.id, sessionId))
        }

        await setUserSession(event, {
          user: {
            ...session.user,
            twoFactorVerified: false,
            registered2FA: false,
            registeredPasskey: false,
          },
        })
      }
    }

    return {
      message: 'You\'ve successfully removed the passkey!',
    }
  }

  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
