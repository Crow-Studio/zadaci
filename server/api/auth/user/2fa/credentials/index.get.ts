import { eq } from 'drizzle-orm'
import { useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // check if user exists
    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
      columns: {
        recoveryCode: true,
        id: true,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user!',
      })
    }

    const passkeys = await useDrizzle()
      .select()
      .from(tables.passkeysTable)
      .where(eq(tables.passkeysTable.userId, user.id))

    return {
      passkeyCredentials: passkeys,
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
