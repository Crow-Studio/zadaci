import { validateSessionToken } from '~/server/libs/session'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    // validate session
    if (session?.sessionToken) {
      const isValid = await validateSessionToken(session.sessionToken)
      if (!isValid.session) {
        return {
          isValid: false,
        }
      }
      else {
        return {
          isValid: true,
        }
      }
    }
  }

  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
