<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Loader2, ServerCrash } from 'lucide-vue-next'
import SkeletonLoading from '../../global/SkeletonLoading.vue'
import PasskeyItem from './PasskeyItem.vue'
import type { AsyncDataRequestStatus } from '#app'
import { Button } from '~/components/ui/button'
import type { MFAPasskey } from '~/types'

const props = defineProps<{
  status: AsyncDataRequestStatus
  passkeys: MFAPasskey[]
}>()

const { user, fetch: fetchUserSession } = useUserSession()

const { register } = useWebAuthn({
  registerEndpoint: '/api/auth/user/webauthn/register',
})

const isSettingUpPasskeys = ref(false)

const onSetupPasskeys = async () => {
  try {
    isSettingUpPasskeys.value = true

    const result = await register({
      userName: user.value?.email as string,
    })

    if (result) {
      await refreshNuxtData('user_mfa_credentials')
      await fetchUserSession()
      toast.success('You\'ve successfully setup passkeys for your account!', {
        position: 'top-center',
      })
    }
  }

  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isSettingUpPasskeys.value = false
  }
}
</script>

<template>
  <div class="grid gap-4 rounded-xl border p-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-base font-medium">
          Passkeys
        </h2>
        <p class="max-w-full text-sm text-muted-foreground sm:max-w-xl sm:text-balance xl:max-w-full">
          Helps you in signin using your fingerprint, face, or device screen lock — no password needed.
        </p>
      </div>
      <Button
        variant="outline"
        class="w-full border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground sm:h-8 sm:w-fit cursor-pointer"
        :disabled="isSettingUpPasskeys"
        @click="onSetupPasskeys"
      >
        <Loader2
          v-if="isSettingUpPasskeys"
          class="size-4 animate-spin"
        />
        <Icon
          v-else
          name="hugeicons:finger-print-add"
          class="size-4"
        />
        {{ props?.passkeys.length > 0 ? 'Add passkeys' : 'Setup passkeys' }}
      </Button>
    </div>
    <SkeletonLoading v-if="status ==='pending' || status ==='idle'" />
    <div
      v-else-if="status ==='error'"
    >
      <div class="flex items-center justify-center gap-1.5 p-5 text-destructive dark:text-primary">
        <ServerCrash class="size-5" />
        Failed to load current sessions.
      </div>
    </div>
    <div
      v-else-if="props?.passkeys.length > 0"
      class="rounded-lg bg-[#f1f1f1] p-3 dark:bg-[#343434]"
    >
      <PasskeyItem
        v-for="(passkey, index) in props?.passkeys"
        :key="passkey.id"
        :passkey-index="index"
        :passkey="passkey"
        :passkeys="props?.passkeys"
      />
    </div>
  </div>
</template>
