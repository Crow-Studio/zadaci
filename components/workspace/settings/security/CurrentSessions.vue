<script setup lang="ts">
import { RefreshCcw, ServerCrash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import SessionItem from './SessionItem.vue'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

const isRefreshing = ref(false)

const { data: rawSessions, status } = await useAsyncData('user_sessions', () => useRequestFetch()(`/api/auth/user/sessions`))

const sessions = computed(() =>
  rawSessions.value?.map(session => ({
    ...session,
    expiresAt: new Date(session.expiresAt),
  })) || [],
)

const onRefresh = async (): Promise<void> => {
  try {
    isRefreshing.value = true
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
    isRefreshing.value = false
  }
}
</script>

<template>
  <div class="grid gap-5 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-medium">
          Current Sessions
        </h1>
        <p class="max-w-xl text-balance text-sm text-muted-foreground">
          Keep up with your available sessions signed in from your account.
        </p>
      </div>
      <Button
        variant="outline"
        class="h-8 gap-1 border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground"
        @click="onRefresh"
      >
        <RefreshCcw
          :class="cn(
            isRefreshing && 'animate-spin',
            'size-5',
          )"
        />
        <span class="hidden md:block">Refresh</span>
      </Button>
    </div>
    <WorkspaceGlobalSkeletonLoading v-if="status ==='pending' || status ==='idle'" />
    <div
      v-else-if="status ==='error'"
      class="rounded-lg border"
    >
      <div class="flex items-center justify-center gap-1.5 p-5 text-destructive dark:text-primary">
        <ServerCrash class="size-5" />
        Failed to load current sessions.
      </div>
    </div>
    <div
      v-else
      class="rounded-lg border"
    >
      <SessionItem
        v-for="(session, index) in sessions"
        :key="session.id"
        :session-index="index"
        :session="session"
        :sessions="sessions || []"
      />
    </div>
  </div>
</template>
