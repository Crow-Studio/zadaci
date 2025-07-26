<script setup lang="ts">
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { MFAPasskey } from '~/types'

const props = defineProps<{
  passkeys: MFAPasskey[]
  passkey: MFAPasskey
  passkeyIndex: number
}>()

const isRemovePasskey = ref(false)
const { fetch: fetchUserSession } = useUserSession()

const onRemovePasskey = async () => {
  try {
    isRemovePasskey.value = true

    const res = await $fetch(`/api/auth/user/webauthn/${props?.passkey.id}/remove`, {
      method: 'DELETE',
    })

    await refreshNuxtData('user_mfa_credentials')
    await fetchUserSession()

    toast.success(res.message, {
      position: 'top-center',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isRemovePasskey.value = false
  }
}
</script>

<template>
  <div
    :class="cn(
      'flex flex-col md:flex-row md:items-center md:justify-between sm:gap-1.5 gap-2',
      props?.passkeyIndex < props.passkeys.length - 1 && 'border-b pb-2',
    )"
  >
    <div class="flex items-center gap-x-2">
      <Icon
        name="mdi:cloud-key-outline"
        class="size-8 shrink-0 md:size-12"
      />
      <div class="self-start">
        <p class="text-sm">
          Passkey {{ props?.passkeyIndex + 1 }}
        </p>
        <p class="text-xs text-muted-foreground">
          Created: {{ formatDistanceToNowStrict(
            props?.passkey.createdAt,
            { addSuffix: true },
          ) }}
        </p>
        <p class="text-xs text-muted-foreground">
          Last used: <span>
            {{ props?.passkey.createdAt === props?.passkey.updatedAt ? 'Not yet used' : formatDistanceToNow(props?.passkey.updatedAt, { addSuffix: true }) }}
          </span>
        </p>
      </div>
    </div>
    <Button
      variant="destructive"
      class="w-full border-0 sm:h-8 sm:w-fit"
      :disabled="isRemovePasskey"
      @click="onRemovePasskey"
    >
      <Loader2
        v-if="isRemovePasskey"
        class="size-4 animate-spin"
      />
      <Icon
        v-else
        name="hugeicons:delete-02"
        class="size-4"
      />
      Remove
    </Button>
  </div>
</template>
