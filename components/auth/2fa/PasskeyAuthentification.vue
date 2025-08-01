<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  onSetIsAuthenticating: (payload: boolean) => void
  email: string
  isAuthenticating: boolean
}>()

const { authenticate } = useWebAuthn({
  authenticateEndpoint: '/api/auth/user/webauthn/authenticate',
})

const { fetch: fetchUserSession } = useUserSession()

const onUsePasskeys = async () => {
  props?.onSetIsAuthenticating(true)
  await authenticate(props?.email)
    .then(fetchUserSession)
    .then(async () => await navigateTo(`/workspace/onboarding`))
    .catch((error) => {
      const errorMessage = error.response
        ? error.response._data.statusMessage
        : error.message
      toast.error(errorMessage, {
        position: 'top-center',
      })
    })
    .finally(() => {
      props?.onSetIsAuthenticating(false)
    })
}
</script>

<template>
  <Button
    :disabled="props?.isAuthenticating"
    class="w-full bg-brand hover:bg-brand-secondary dark:text-white cursor-pointer"
    @click="onUsePasskeys"
  >
    <Loader2
      v-if="props?.isAuthenticating"
      class="size-5 animate-spin"
    />
    <Icon
      v-else
      name="hugeicons:finger-access"
      class="size-5"
    />
    Use Passkeys
  </Button>
</template>
