import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { createDate, generateUniqueCode, TimeSpan } from '~/server/utils'
import { sendUniqueCodeRequest } from '~/server/utils/emails/actions/unique-code-request'
import { isValidEmail } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      throw createError({
        message: 'Invalid Email',
        statusCode: 400,
      })
    }

    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (!user) {
      throw createError({
        message: `Email ${email} not found!`,
        statusCode: 400,
      })
    }

    const codeExists = await useDrizzle().query.uniqueCodeTable.findFirst({
      where: table => eq(table.email, email),
    })

    if (!codeExists) {
      const code = generateUniqueCode(8)

      await useDrizzle().insert(tables.uniqueCodeTable).values({
        id: uuidv4(),
        email,
        code,
        expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await sendUniqueCodeRequest({
        code,
        email,
      })

      return {
        message: 'Check your email for the unique code!',
      }
    }

    const code = generateUniqueCode(8)

    await useDrizzle().update(tables.uniqueCodeTable).set({
      code,
      expiresAt: createDate(new TimeSpan(10, 'm')),
      updatedAt: new Date(),
    }).where(eq(tables.uniqueCodeTable.email, email))

    await sendUniqueCodeRequest({
      code,
      email,
    })

    return {
      message: 'Check your email for the unique code!',
    }
  }

  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
