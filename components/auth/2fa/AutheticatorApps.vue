<script setup lang="ts">
import { Button } from '~/components/ui/button'

const modalStore = useModalStore()

const onUseAuthenticatorApp = () => {
  modalStore?.onOpen('totpAuthentication')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <Button
    class="w-full bg-brand hover:bg-brand-secondary dark:text-white cursor-pointer"
    @click="onUseAuthenticatorApp"
  >
    <Icon
      name="hugeicons:security-password"
      class="size-5"
    />
    Use Authenticator App
  </Button>
</template>
