export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { username, password, avatar } = await readBody(event)

    if (typeof username !== 'string' || !username) {
      throw createError({
        statusMessage: 'Invalid first name and last name!',
        statusCode: 400,
      })
    }

    if (typeof password !== 'string') {
      throw createError({
        statusMessage: 'Invalid password!',
        statusCode: 400,
      })
    }

    if (typeof avatar !== 'string') {
      throw createError({
        statusMessage: 'Invalid avatar!',
        statusCode: 400,
      })
    }

    // Hash password
    let hashedPassword: string = ''
    if (password) {
      hashedPassword = await hashPassword(password)
    }
    const [user] = await useDrizzle()
      .update(tables.userTable)
      .set({
        username,
        password: hashedPassword,
        profile_picture_url: avatar,
      })
      .where(eq(tables.userTable.id, session.user.id))
      .returning()

    await setUserSession(event, {
      user: {
        ...session.user,
        username: user.username,
        avatar: user.profile_picture_url,
      },
    })

    return {
      user,
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
