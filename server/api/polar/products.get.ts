import { Polar } from '@polar-sh/sdk'

export default defineEventHandler(async (event) => {
  try {
    const {
      private: { polarAccessToken, polarServer },
    } = useRuntimeConfig()

    const polar = new Polar({
      accessToken: polarAccessToken,
      server: polarServer as 'sandbox' | 'production',
    })

    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    const products = await polar.products.list({})
    return products.result.items[0].id
  }
  catch (error) {
    console.log(error)
  }
})
