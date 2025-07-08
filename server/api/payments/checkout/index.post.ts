import { Polar } from '@polar-sh/sdk'

export default defineEventHandler(async (event) => {
  const {
    private: { polarAccessToken, polarCheckoutSuccessUrl, polarServer },
  } = useRuntimeConfig()

  const session = await requireUserSession(event)

  const { productId, workspaceId } = await readBody<{ productId: string, workspaceId: string }>(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized!',
    })
  }

  if (!workspaceId || typeof workspaceId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing workspaceId!',
    })
  }

  if (!productId || typeof productId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing productId!',
    })
  }

  if (!polarAccessToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      message: 'POLAR_ACCESS_TOKEN is not set',
    })
  }

  const polar = new Polar({
    accessToken: polarAccessToken,
    server: polarServer as 'sandbox' | 'production',
  })

  const customer = await polar.customers.create({
    email: session.user.email,
    name: session.user.username,
    metadata: { workspace_id: workspaceId },
  })

  console.log(customer)

  const res = await polar.checkouts.create({
    products: [productId],
    successUrl: polarCheckoutSuccessUrl,
    customerId: customer.id,
    metadata: {
      workspace_id: workspaceId,
    },
  })

  return res
})
