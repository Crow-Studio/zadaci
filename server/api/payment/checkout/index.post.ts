export default defineEventHandler((event) => {
  const checkoutHandler = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: process.env.POLAR_SUCCESS_URL,
    server: process.env.POLAR_SERVER as 'sandbox' | 'production',
  })

  return checkoutHandler(event)
})
