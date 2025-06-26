import type { H3Event } from 'h3'
import { z } from 'zod'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { setSessionAs2FAVerified } from '~/server/libs/session'

interface ISuccess {
  user: {
    userName: string
  }
  credential: {
    id: string
    publicKey: string
    counter: number
    backedUp: true
    transports: string
  }
}

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(event: H3Event, challenge: string, attemptId: string) {
    await useStorage().setItem(`attempt:${attemptId}`, challenge)
  },
  // @ts-expect-error expect types error
  async getChallenge(event: H3Event, attemptId: string) {
    const challenge = await useStorage().getItem(`attempt:${attemptId}`)
    if (!challenge) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Challenge not found or expired!',
      })
    }
    await useStorage().removeItem(`attempt:${attemptId}`)
    return challenge
  },
  async validateUser(userBody: { userName: string }, event: H3Event) {
    const session = await getUserSession(event)
    if (session.user?.email && session.user.email !== userBody.userName) {
      throw createError({ statusCode: 400, message: 'Email not matching curent session' })
    }

    return z.object({
      userName: z.string().email(),
    }).parse(userBody)
  },
  // @ts-expect-error expect types error
  async onSuccess(event: H3Event, { user, credential }: ISuccess) {
    const session = await requireUserSession(event)

    // update user details to registered2FA
    const [dbUser] = await useDrizzle().update(tables.userTable).set({
      updatedAt: new Date(),
      registered2FA: true,
    }).where(eq(tables.userTable.email, user.userName)).returning()

    await useDrizzle().insert(tables.passkeysTable).values({
      userId: dbUser.id,
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: credential.transports,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // update user session
    if (session?.sessionToken) {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(session.sessionToken)))
      await setSessionAs2FAVerified(sessionId)
    }

    await setUserSession(event, {
      user: {
        ...session.user,
        registeredPasskey: true,
        registered2FA: true,
        twoFactorVerified: true,
      },
    })
  },
  // @ts-expect-error expect types error
  async excludeCredentials(event: H3Event, userName: string) {
    return useDrizzle()
      .select({
        id: tables.passkeysTable.id,
        transports: tables.passkeysTable.transports,
      })
      .from(tables.userTable)
      .innerJoin(tables.passkeysTable, eq(tables.passkeysTable.userId, tables.userTable.id))
      .where(eq(tables.userTable.username, userName.toLowerCase().trim()))
  },
})
