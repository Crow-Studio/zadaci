export default defineEventHandler(async (event) => {
  const { polarWebhookSecret } = useRuntimeConfig()
  const webhooksHandler = Webhooks({
    webhookSecret: polarWebhookSecret,
    onPayload: async (payload) => {
      switch (payload.type) {
        case 'checkout.created':
          console.log(payload.data)
          // Handle the checkout created event
          // supabase.from('checkouts').insert(payload.data)
          break
        case 'checkout.updated':
          console.log(payload.data)
          // Handle the checkout updated event
          // supabase.from('checkouts').update(payload.data).match({ id: payload.data.id })
          break
        case 'subscription.created':
          // console.log(payload.data);
          // Handle the subscription created event
          break
        case 'subscription.updated':
          // console.log(payload.data);
          // Handle the subscription updated event
          break
        case 'subscription.active':
          // console.log(payload.data);
          // Handle the subscription active event
          break
        case 'subscription.revoked':
          // console.log(payload.data);
          // Handle the subscription revoked event
          break
        case 'subscription.canceled':
          // console.log(payload.data);
          // Handle the subscription canceled event
          break
        case 'order.paid':
          console.log(payload.data)
          break

          // Most Important and the only webhook ( in 90% cases )
        case 'customer.state_changed':
          console.log(payload.data)
          break
        default:
          // Handle unknown event
          console.log('Unknown event', payload.type)
          break
      }
    },
  })
  return webhooksHandler(event)
})
