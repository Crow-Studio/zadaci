<script setup lang="ts">
import PasskeyAuthentification from './PasskeyAuthentification.vue'
import AutheticatorApps from './AutheticatorApps.vue'
import RecoveryCode from '~/components/lottie/RecoveryCode.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

const modalStore = useModalStore()
const { user } = useUserSession()

const isAuthenticating = ref(false)

const onSetIsAuthenticating = (payload: boolean) => {
  isAuthenticating.value = payload
}

const onSignOut = () => {
  modalStore?.onOpen('signout')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <Card class="w-full max-w-lg">
    <RecoveryCode />
    <CardHeader class="text-center">
      <CardTitle>Two-Factor Authentication</CardTitle>
      <CardDescription>A second step is required to complete signin. Select your preferred method to complete signin.</CardDescription>
    </CardHeader>
    <CardContent class="grid gap-1.5">
      <PasskeyAuthentification
        v-if="user?.registered2FA && user?.registeredPasskey"
        :on-set-is-authenticating="onSetIsAuthenticating"
        :email="user?.email"
        :is-authenticating="isAuthenticating"
      />
      <AutheticatorApps v-if="user?.registered2FA && user?.registeredTOTP" />
      <Button
        variant="link"
        class="w-full cursor-pointer"
        :disabled="isAuthenticating"
        @click="onSignOut"
      >
        Sign me out
      </Button>
    </CardContent>
  </Card>
</template>
