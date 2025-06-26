import { eq } from 'drizzle-orm'
import { getUserSessions } from '~/server/libs/session'
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
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user!',
      })
    }

    // retrieve user sessions
    const sessions = await getUserSessions(user.id)

    return sessions
  }

  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
