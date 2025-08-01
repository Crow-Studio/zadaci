<script setup lang="ts">
import { encodeBase64 } from '@oslojs/encoding'
import { createTOTPKeyURI } from '@oslojs/otp'
import { renderSVG } from 'uqr'
import { toast } from 'vue-sonner'
import type { AsyncDataRequestStatus } from '#app'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const props = defineProps<{
  status: AsyncDataRequestStatus
}>()

const modalStore = useModalStore()
const { user, fetch: fetchUserSession } = useUserSession()
const isDisconnecting = ref(false)

const totpKey = new Uint8Array(20)
crypto.getRandomValues(totpKey)
const encodedTOTPKey = encodeBase64(totpKey)
const keyURI = createTOTPKeyURI('Zadaci', user.value?.email as string, totpKey, 30, 6)

const qrcode = renderSVG(keyURI)

const onSetupTOTP = () => {
  modalStore?.onOpen('setupAuthenticatorApp')
  modalStore?.setIsOpen(true)
  modalStore?.setModalData({
    qrcode,
    encodedTOTPKey,
  })
}

const onDisconnectTOTP = async () => {
  try {
    isDisconnecting.value = true

    const res = await $fetch('/api/auth/user/2fa/totp/disconnect', {
      method: 'DELETE',
    })

    await refreshNuxtData('user_mfa_credentials')
    await fetchUserSession()

    toast.success(res.message, {
      position: 'top-center',
    })
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
    isDisconnecting.value = false
  }
}
</script>

<template>
  <div class="grid gap-4 rounded-xl border p-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-base font-medium">
          Authenticator apps (TOTP) <Badge class="ml-1 bg-emerald-600 uppercase hover:bg-emerald-500 dark:text-primary">
            Recommended
          </Badge>
        </h2>
        <p class="max-w-full text-balance text-sm text-muted-foreground">
          Get verification codes from authenticator apps such as Google Authenticator, Authy etc.
        </p>
      </div>
      <div
        v-if="props?.status ==='idle' || props?.status ==='pending'"
        class="h-8 w-1/12 animate-pulse rounded-md bg-slate-200"
      />
      <div v-else>
        <div
          v-if="user?.registeredTOTP"
          class="flex items-center gap-3"
        >
          <Button
            :disabled="isDisconnecting"
            class="gap-2 bg-brand hover:bg-brand-secondary dark:text-primary sm:h-8 cursor-pointer"
            @click="onSetupTOTP"
          >
            <Icon
              name="hugeicons:security-password"
              class="size-4"
            />
            Update TOTP
          </Button>
          <Button
            :disabled="isDisconnecting"
            variant="destructive"
            class="gap-2 sm:h-8 cursor-pointer"
            @click="onDisconnectTOTP"
          >
            <Loader2
              v-if="isDisconnecting"
              class="size-5 animate-spin"
            />
            <Icon
              v-else
              name="tdesign:link-unlink"
              class="size-4"
            />
            Disconnect
          </Button>
        </div>
        <Button
          v-else
          variant="outline"
          class="w-full border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground sm:h-8 sm:w-fit cursor-pointer"
          @click="onSetupTOTP"
        >
          <Icon
            name="hugeicons:security-password"
            class="size-4"
          />
          Setup TOTP
        </Button>
      </div>
    </div>
  </div>
</template>
