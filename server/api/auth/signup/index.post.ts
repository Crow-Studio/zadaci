import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { isWithinExpirationDate, generateRandomRecoveryCode, capitalize } from '~/server/utils'
import type { SessionFlags } from '~/server/libs/session'
import { createSession, generateSessionToken } from '~/server/libs/session'
import { encryptString } from '~/server/utils/encryption'
import { isValidEmail } from '~/server/utils/validations'
import type { User } from '~/types'
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

    const existingUser = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (existingUser) {
      throw createError({
        message: `Email ${email} already exists!`,
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

    if (!isWithinExpirationDate(uniqueCodeRequest.expiresAt)) {
      throw createError({
        statusMessage: 'The unique code has expired!',
        statusCode: 498,
      })
    }

    await useDrizzle().delete(tables.uniqueCodeTable).where(eq(tables.uniqueCodeTable.id, uniqueCodeRequest.id))

    const recoveryCode = generateRandomRecoveryCode()
    const encryptedRecoveryCode = encryptString(recoveryCode)
    const serializedRecoveryCode = Buffer.from(encryptedRecoveryCode).toString(
      'base64',
    )

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const [newUser] = await useDrizzle()
      .insert(tables.userTable)
      .values({
        email,
        id: uuidv4(),
        recoveryCode: serializedRecoveryCode,
        username: `${capitalize(firstName)} ${capitalize(lastName)}`,
        emailVerified: true,
        profilePictureUrl: `https://avatar.vercel.sh/${email}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    const user: User = {
      id: newUser.id,
      username: newUser.username,
      email,
      emailVerified: newUser.emailVerified,
      registeredTOTP: false,
      registeredPasskey: false,
      registered2FA: false,
      avatar: newUser.profilePictureUrl!,
      twoFactorVerified: false,
    }

    const sessionFlags: SessionFlags = {
      twoFactorVerified: false,
    }

    const sessionToken = generateSessionToken()
    const { browser, device, ipAdress, location, os } = await createSessionMetadata(event)
    const session = await createSession(sessionToken, user.id, sessionFlags, browser, device, os, location, ipAdress)

    await setUserSession(event, {
      user,
      sessionToken: sessionToken,
    }, {
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000), // Convert milliseconds to seconds
    })

    return {
      message: 'User account created successfully!',
    }
  }

  catch (error: any) {
    throw createError({
      message: `Failed to signup: ${error.message}`,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
