export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const { password } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof password !== 'string' || !password) {
      throw createError({
        statusMessage: 'Invalid password!',
        statusCode: 400,
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

    // Hash password
    const hashedPassword = await hashPassword(password)

    await useDrizzle()
      .update(tables.userTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(tables.userTable.id, user.id))

    return {
      message: 'You\'ve successfully setup your password',
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
