export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { username, image } = await readBody(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (typeof username !== 'string' || !username) {
      throw createError({
        statusMessage: 'Invalid image!',
        statusCode: 400,
      })
    }

    if (typeof image !== 'string' || !image) {
      throw createError({
        statusMessage: 'Invalid image!',
        statusCode: 400,
      })
    }

    // check if user exists
    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    if (!user) {
      throw createError({
        statusMessage: 'Invalid user data!',
        statusCode: 400,
      })
    }

    // update user details
    const [dbUser] = await useDrizzle().update(tables.userTable).set({
      updatedAt: new Date(),
      username,
      profilePictureUrl: image,
    }).where(eq(tables.userTable.id, session.user.id)).returning()

    // update user session details
    await setUserSession(event, {
      user: {
        ...session.user,
        avatar: dbUser.profilePictureUrl as string,
        username: dbUser.username as string,
      },
    })

    return {
      message: 'You\'ve successfully updated your profile info!',
      user: {
        name: dbUser.username as string,
      },
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
