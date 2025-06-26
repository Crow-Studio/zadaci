export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    const { password, newPassword } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof password !== 'string' || !password) {
      throw createError({
        statusMessage: 'Invalid Password!',
        statusCode: 400,
      })
    }

    if (typeof newPassword !== 'string' || !newPassword) {
      throw createError({
        statusMessage: 'Invalid New Password!',
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

    // verify old password
    const isCorrectPassword = await verifyPassword(user.password!, password)

    if (!isCorrectPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Incorrect Password!',
      })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    await useDrizzle()
      .update(tables.userTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(tables.userTable.id, user.id))

    return {
      message: 'You\'ve successfully reset your password',
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
