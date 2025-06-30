<script setup lang="ts">
import { Loader2, ServerCrash } from 'lucide-vue-next'
import OnboardingWrapper from '~/components/workspace/onboarding/OnboardingWrapper.vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'onboarding',
})

useHead({
  titleTemplate: '%s - Onboarding',
})

defineOgImageComponent('UseOdama', {
  title: 'use-odama - Onboarding',
  description:
    'Manage multiple restaurants, build menus, handle online orders, track inventory, and empower your team with use-odama.',
})

const workspaceStore = useWorkspaceStore()
const { data: onboarding, error, status } = await useAsyncData('user_workspaces', () => useRequestFetch()('/api/workspace/onboarding/details'), {
  transform(input) {
    return {
      ...input,
      fetchedAt: new Date(),
    }
  },
  getCachedData(key, nuxtApp) {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    // If data is not fetched yet
    if (!data) {
      // Fetch the first time
      return
    }

    // Check if the data is older than 5 minutes
    const expirationDate = new Date(data.fetchedAt)
    expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 1000) // 5 minutes TTL
    const isExpired = expirationDate.getTime() < Date.now()
    if (isExpired) {
      // Refetch the data
      return
    }

    return data
  },
})

watch(onboarding, (val) => {
  if (val) {
    if (val.username && val.workspace) {
      workspaceStore?.onSetActiveWorkspace(val.workspace)
      navigateTo(`/workspace/${val.workspace.id}/dashboard`)
    }
  }
}, {
  immediate: true,
})
</script>

<template>
  <div>
    <div
      v-if="status === 'idle' || status === 'pending'"
      class="grid min-h-screen place-content-center"
    >
      <div class="flex items-center gap-x-1">
        <Loader2 class="animate-spin size-4" />
        <p class="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
    <div
      v-else-if="status === 'error'"
      class="grid min-h-screen place-content-center"
    >
      <div class="flex flex-col items-center gap-2">
        <ServerCrash class="size-20 text-destructive" />
        <div class="text-center">
          <p class="text-base font-medium text-destructive">
            Internal Server Error.
          </p>
          <p
            v-if="error"
            class="text-sm text-destructive"
          >
            {{ error.message ? error.message : error.statusMessage }}
          </p>
        </div>
      </div>
    </div>
    <OnboardingWrapper
      v-else
      :username="onboarding?.username!"
      :workspace="onboarding?.workspace!"
    />
  </div>
</template>
