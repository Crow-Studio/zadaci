import type { H3Event } from 'h3'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { setSessionAs2FAVerified } from '~/server/libs/session'

export default defineWebAuthnAuthenticateEventHandler({
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
  // @ts-expect-error expect types error
  async allowCredentials(event: H3Event, userName: string) {
    const user = await useDrizzle().query.userTable.findFirst({
      where: eq(tables.userTable.email, userName),
      with: {
        credentials: true,
      },
    })

    return (user?.credentials || []).map(cred => ({
      ...cred,
      transports: Array.isArray(cred.transports) ? cred.transports : [cred.transports],
    }))
  },
  // @ts-expect-error expect types error
  async getCredential(event: H3Event, credentialID: string) {
    const credential = await useDrizzle().query.passkeysTable.findFirst({
      where: table => eq(table.id, credentialID),
      with: {
        user: true,
      },
    })

    if (!credential) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Credential not found',
      })
    }

    return credential
  },
  // @ts-expect-error expect types error
  async onSuccess(event: H3Event, credential: { id: string, authenticationInfo: { credentialID: string } }) {
    const session = await requireUserSession(event)

    // update user session
    if (session?.sessionToken) {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(session.sessionToken)))
      await setSessionAs2FAVerified(sessionId)
    }

    // update the passkey table (updatedAt)
    await useDrizzle().update(tables.passkeysTable).set({
      updatedAt: new Date(),
    }).where(
      and(
        eq(tables.passkeysTable.id, credential.id || credential.authenticationInfo.credentialID),
        eq(tables.passkeysTable.userId, session.user.id),
      ),
    )

    await setUserSession(event, {
      user: {
        ...session.user,
        twoFactorVerified: true,
      },
    })
  },
})
