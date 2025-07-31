<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { toast } from 'vue-sonner'
import { cn, getSessionStatus, getSessionStatusIcon } from '~/lib/utils'
import type { Session } from '~/server/database/schema'
import { Button } from '~/components/ui/button'

const { session: userSession } = useUserSession()
const modalStore = useModalStore()
const isLoading = ref(false)

const props = defineProps<{
  session: Session
  sessions: Session[]
  sessionIndex: number
}>()

const onSessionSignOut = async (payload: { token: string, sessionId: string }): Promise<void> => {
  try {
    isLoading.value = true
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(payload.token)))

    if (sessionId === payload.sessionId) {
      modalStore?.onOpen('signout')
      modalStore?.setIsOpen(true)
      return
    }

    const res = await $fetch('/api/auth/user/sessions/signout', {
      method: 'POST',
      body: {
        sessionId: payload.sessionId,
      },
    })

    toast.success(res.message, {
      position: 'top-center',
    })

    await refreshNuxtData('user_sessions')
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
    isLoading.value = false
  }
}
</script>

<template>
  <div
    :class="cn(
      'flex flex-col md:flex-row md:items-center md:justify-between p-3 sm:gap-1.5 gap-2',
      props.sessions && props.sessionIndex < props.sessions.length - 1 && 'border-b',
    )"
  >
    <div class="flex items-center gap-2">
      <Icon
        name="logos:chrome"
        class="shrink-0"
        size="25"
      />
      <div class="w-full self-start">
        <div class="flex items-center justify-between text-sm font-medium sm:text-base">
          <h2>
            {{ session.os }}
          </h2>
          <p class="flex items-center gap-1 text-sm capitalize text-emerald-600 md:hidden">
            <Icon
              :name="getSessionStatusIcon({ token: userSession?.sessionToken ?? '', session: { ...props.session, expiresAt: new Date(props.session.expires_at) } })"
              class="size-5"
            />
            {{ getSessionStatus({ token: userSession?.sessionToken ?? '', session: { ...props.session, expiresAt: new Date(props.session.expires_at) } }) }}
          </p>
        </div>
        <p class="text-xs text-muted-foreground md:text-sm">
          {{ props.session.location }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-end gap-5 md:grid md:grid-cols-2 md:justify-between">
      <div class="hidden items-center gap-1 text-sm capitalize text-emerald-600 md:flex">
        <Icon
          :name="getSessionStatusIcon({ token: userSession?.sessionToken!, session: { ...props.session, expiresAt: new Date(props.session.expires_at) } })"
          class="size-5"
        />
        {{ getSessionStatus({ token: userSession?.sessionToken!, session: { ...props.session, expiresAt: new Date(props.session.expires_at) } }) }}
      </div>
      <Button
        variant="outline"
        class="w-full border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground sm:h-8 sm:w-fit cursor-pointer"
        @click="onSessionSignOut({ token: userSession?.sessionToken!, sessionId: props.session.id })"
      >
        <Loader2
          v-if="isLoading"
          class="size-4 animate-spin"
        />
        <Icon
          v-else
          name="hugeicons:logout-03"
          class="size-4"
        />
        Signout
      </Button>
    </div>
  </div>
</template>
