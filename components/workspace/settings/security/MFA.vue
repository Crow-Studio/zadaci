<script setup lang="ts">
import AuthenticatorApps from './AuthenticatorApps.vue'
import Passkeys from './Passkeys.vue'

const { data: mfa, status } = await useAsyncData('user_mfa_credentials', () => useRequestFetch()('/api/auth/user/2fa/credentials'))

console.log(mfa.value)
</script>

<template>
  <div class="grid gap-5 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d]">
    <div>
      <h1 class="text-base font-medium">
        Multi-Factor Authentication (MFA)
      </h1>
      <p class="max-w-full text-balance text-sm text-muted-foreground">
        Protect your account with an additional layer of security by enabling Multi-Factor Authentication (MFA). This feature requires a second form of verification, such as a code sent to your mobile device, in addition to your password. Enabling MFA helps prevent unauthorized access to your account, even if your password is compromised.
      </p>
    </div>

    <AuthenticatorApps :status="status" />
    <Passkeys
      :status="status"
      :passkeys="mfa?.passkeyCredentials!"
    />
  </div>
</template>
