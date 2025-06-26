export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { sessionId } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof sessionId !== 'string' || !sessionId) {
      throw createError({
        statusMessage: 'Invalid sessionId!',
        statusCode: 400,
      })
    }

    // check if session exists
    const existingSession = await useDrizzle().query.sessionTable.findFirst({
      where: table => eq(table.id, sessionId),
    })

    if (!existingSession) {
      throw createError({
        statusMessage: 'Invalid session data!',
        statusCode: 400,
      })
    }

    // invalidate session
    await useDrizzle()
      .delete(tables.sessionTable)
      .where(eq(tables.sessionTable.id, sessionId))

    return {
      message: 'You\'ve successfully cleared out the session',
    }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
