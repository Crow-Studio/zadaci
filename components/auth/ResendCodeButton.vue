<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'

const props = defineProps<{
  email: string
  apiUrl: string
  setIsResendingCode: (payload: boolean) => void
  isResendCode: boolean
}>()

const timeElapsed = ref(30)

let timer: ReturnType<typeof setInterval> | null = null

const isStopTimer = ref(false)

function startTimer() {
  isStopTimer.value = true
  if (timer) {
    isStopTimer.value = false
    return
  }
  timer = setInterval(() => {
    if (timeElapsed.value > 0) {
      timeElapsed.value -= 1
    }
    else {
      clearInterval(timer!)
      timer = null
      isStopTimer.value = false
      timeElapsed.value = 30
    }
  }, 1000)
}

async function onResendCode() {
  try {
    props?.setIsResendingCode(true)

    const res: { message: string } = await $fetch(props?.apiUrl, {
      method: 'POST',
      body: {
        email: props?.email,
      },
    })

    toast.success(res.message, {
      position: 'top-center',
    })
    startTimer()
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
    props?.setIsResendingCode(false)
  }
}
</script>

<template>
  <button
    :disabled="props?.isResendCode || (timeElapsed > 0 && isStopTimer)"
    type="button"
    :class="cn(
      'font-medium cursor-pointer',
      isResendCode || (timeElapsed > 0 && isStopTimer) ? 'text-xs text-muted-foreground' : 'text-sm text-brand hover:text-brand-secondary',
    )"
    @click="onResendCode"
  >
    <span
      v-if="isResendCode"
      class="size-5 animate-spin"
    >
      Resending
    </span>
    <span v-else-if="timeElapsed > 0 && isStopTimer">
      Resending in {{ timeElapsed }}s
    </span>
    <span v-else>Resend</span>
  </button>
</template>
