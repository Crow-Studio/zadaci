export default defineEventHandler((event) => {
  const {
    private: { polarAccessToken, polarCheckoutSuccessUrl, polarServer },
  } = useRuntimeConfig()

  console.log('=== POLAR DEBUG START ===')

  // 1. Check all environment variables
  console.log('Environment variables:')
  console.log('- POLAR_ACCESS_TOKEN exists:', !!polarAccessToken)
  console.log('- POLAR_ACCESS_TOKEN length:', polarAccessToken?.length || 0)
  console.log('- POLAR_ACCESS_TOKEN prefix:', polarAccessToken?.substring(0, 15) || 'MISSING')
  console.log('- POLAR_SUCCESS_URL:', polarCheckoutSuccessUrl)
  console.log('- POLAR_SERVER:', polarServer)
  console.log('- NODE_ENV:', process.env.NODE_ENV)

  // 2. Check the request data
  const query = getQuery(event)
  console.log('Request query:', query)

  // 3. Test the token directly first
  const token = polarAccessToken
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      message: 'POLAR_ACCESS_TOKEN is not set',
    })
  }
  const checkoutHandler = Checkout({
    accessToken: polarAccessToken,
    successUrl: polarCheckoutSuccessUrl,
    server: polarServer as 'sandbox' | 'production',
  })

  return checkoutHandler(event)
})
