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

  // check if workspace exists
  const workspace = await useDrizzle().query.workspaceTable.findFirst({
    where: table => and(
      eq(table.id, workspaceId),
      eq(table.user_id, session.user.id),
    ),
  })

  if (!workspace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid workspace!',
    })
  }

  const polar = new Polar({
    accessToken: polarAccessToken,
    server: polarServer as 'sandbox' | 'production',
  })

  // fetch customer
  const polarCustomer = await useDrizzle().query.polarCustomers.findFirst({
    where: table => eq(table.workspaceId, workspace.id),
  })

  if (!polarCustomer) {
    // create new cusomer
    const customer = await polar.customers.create({
      email: session.user.email,
      name: session.user.username,
      metadata: { workspace_id: workspaceId },
    })

    // save new cusomer in the db
    await useDrizzle().insert(tables.polarCustomers).values({
      id: customer.id,
      email: customer.email,
      workspaceId: workspace.id,
      createdAt: customer.createdAt,
      deletedAt: customer.deletedAt,
      name: customer.name,
      organizationId: customer.organizationId,
    })

    const res = await polar.checkouts.create({
      products: [productId],
      successUrl: polarCheckoutSuccessUrl,
      customerId: customer.id,
      metadata: {
        workspace_id: workspace.id,
      },
    })

    return res
  }

  const res = await polar.checkouts.create({
    products: [productId],
    successUrl: polarCheckoutSuccessUrl,
    customerId: polarCustomer?.id,
    metadata: {
      workspace_id: workspace.id,
    },
  })

  return res
})
