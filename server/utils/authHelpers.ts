import type { H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { UAParser } from 'ua-parser-js'
import type { SessionFlags } from '../libs/session'
import { createSession, generateSessionToken } from '../libs/session'
import type { User } from '../database/schema'
import { generateRandomRecoveryCode } from '~/server/utils'
import { encryptString } from '~/server/utils/encryption'

interface AuthenticateOauthUserOptions {
  providerName: 'google' | 'facebook'
  providerUserEmail: string
  providerUsername: string
  providerUserId: string
  providerAvatar: string
}

export async function authenticateOauthUser(options: AuthenticateOauthUserOptions, event: H3Event) {
  // check if user exists in the database
  const existingUser = await useDrizzle().query.userTable.findFirst({
    where: table => eq(table.email, options.providerUserEmail),
  })

  if (existingUser) {
    // check if the user has an existing oauth account
    const existingOauthAccount = await useDrizzle().query.oauthAccountTable.findFirst({
      where: table => and(
        eq(table.provider_user_id, options.providerUserId),
        eq(table.provider, options.providerName),
      ),
    })
    if (!existingOauthAccount) {
      // if the user already exists, create an oauth account with the options
      await createOauthAccount(options, existingUser.id)
    }
    // Create session token and store in database
    const sessionFlags: SessionFlags = {
      twoFactorVerified: false,
    }

    const sessionToken = generateSessionToken()
    const { browser, device, ipAdress, location, os } = await createSessionMetadata(event)
    const session = await createSession(sessionToken, existingUser.id, sessionFlags, browser, device, os, location, ipAdress)

    const passkeys = await useDrizzle().query.passkeysTable.findMany({
      where: table => (eq(table.user_id, existingUser.id)),
    })

    const totp = await useDrizzle().query.totpCredential.findFirst({
      where: table => (eq(table.user_id, existingUser.id)),
    })

    const registeredPasskey = passkeys.length > 0 ? true : false

    // Set user session with token
    await setUserSession(event, {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        emailVerified: existingUser.email_verified,
        avatar: existingUser.profile_picture_url,
        registeredTOTP: totp ? true : false,
        registeredPasskey,
        registered2FA: existingUser.registered_2fa,
        twoFactorVerified: false,
      },
      sessionToken: sessionToken,
    }, {
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000), // Convert milliseconds to seconds
    })
  }
  else {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized email address' })
  }
}

export async function createOauthAccount(options: AuthenticateOauthUserOptions, userId: string) {
  await useDrizzle().insert(tables.oauthAccountTable).values({
    id: uuidv4(),
    provider: options.providerName,
    provider_user_id: options.providerUserId,
    user_id: userId,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export async function createUser(options: AuthenticateOauthUserOptions): Promise<User> {
  const recoveryCode = generateRandomRecoveryCode()
  const encryptedRecoveryCode = encryptString(recoveryCode)
  const serializedRecoveryCode = Buffer.from(encryptedRecoveryCode).toString(
    'base64',
  )

  const [newUser] = await useDrizzle()
    .insert(tables.userTable)
    .values({
      email: options.providerUserEmail,
      id: uuidv4(),
      recovery_code: serializedRecoveryCode,
      username: options.providerUsername,
      email_verified: true,
      profile_picture_url: options.providerAvatar,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning()

  return newUser
}

export async function createSessionMetadata(event: H3Event): Promise<{
  location: string
  browser: string
  device: string
  os: string
  ipAdress: string
}> {
  try {
    const headers = getRequestHeaders(event)
    const localIp = headers['x-forwarded-for'] || event.context.clientAddress || ''
    const userAgent = headers['user-agent'] || ''

    const { browser, device, os } = UAParser(userAgent)

    let location = 'Unknown'

    let ipData: any = null

    if (localIp === '127.0.0.1' || localIp === '::1') {
      location = 'Localhost'
    }
    else {
      const res = await fetch(`http://ip-api.com/json/${localIp}`)
      ipData = await res.json()
      location = `${ipData.city || 'Unknown'}, ${ipData.country || 'Unknown'}`
    }

    return {
      location,
      browser: `${browser.name || 'Unknown Browser'}`,
      device: device.vendor || 'Unknown Device',
      os: `${os.name || 'Unknown OS'}`,
      ipAdress: localIp,
    }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
}
