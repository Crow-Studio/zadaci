export default defineEventHandler(async (event) => {
  const { polarWebhookSecret } = useRuntimeConfig()
  const webhooksHandler = Webhooks({
    webhookSecret: polarWebhookSecret,
    onPayload: async (payload) => {
      switch (payload.type) {
        case 'checkout.created':
          console.log('checkout.created', payload.data)
          // Handle the checkout created event
          // supabase.from('checkouts').insert(payload.data)
          break
        case 'checkout.updated':
          console.log('checkout.updated', payload.data)
          // Handle the checkout updated event
          // supabase.from('checkouts').update(payload.data).match({ id: payload.data.id })
          break
        case 'subscription.created':
          console.log('subscription.created', payload.data)
          // console.log(payload.data);
          // Handle the subscription created event
          break
        case 'subscription.updated':
          console.log('subscription.updated', payload.data)
          // console.log(payload.data);
          // Handle the subscription updated event
          break
        case 'subscription.active':
          // console.log(payload.data);
          // Handle the subscription active event
          break
        case 'subscription.revoked':
          console.log('subscription.revoked', payload.data)
          // console.log(payload.data);
          // Handle the subscription revoked event
          break
        case 'subscription.canceled':
          console.log('subscription.canceled', payload.data)
          // console.log(payload.data);
          // Handle the subscription canceled event
          break
        case 'order.paid':
          console.log('order.paid', payload.data)
          break

          // Most Important and the only webhook ( in 90% cases )
        case 'customer.state_changed':
          console.log('customer.state_changed', payload.data)
          break
        default:
          console.log(`${payload.type}`, payload.data)
          // Handle unknown event
          console.log('Unknown event', payload.type)
          break
      }
    },
  })
  return webhooksHandler(event)
})
