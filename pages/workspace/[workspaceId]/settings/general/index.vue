<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const nuxtApp = useNuxtApp()
const workspaceStore = useWorkspaceStore()
const isAppLoading = ref(true)

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

useHead({
  title: currentActiveWorkspace.value
    ? `${currentActiveWorkspace.value?.name} - Settings General`
    : 'Settings General',
})

defineOgImageComponent('Zadaci', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Settings General` : 'Settings General',
  description:
    'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
})

const { data: workspace, status } = await useAsyncData(() => useRequestFetch()(`/api/workspace/${currentActiveWorkspace?.value?.id}/details/user-exists`))

onBeforeMount(() => {
  if (!workspace.value) {
    navigateTo('/workspace/onboarding')
  }
})

onMounted(() => {
  if (nuxtApp._loadingIndicatorDeps) {
    if (!workspace.value) {
      workspaceStore?.onSetActiveWorkspace(null)
      navigateTo('/workspace/onboarding')
    }
    else {
      isAppLoading.value = false
      workspaceStore?.onSetWorkspaceBreadcrumb({
        name: `${currentActiveWorkspace.value?.name}`,
        path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
        children: [
          {
            name: 'Settings',
            path: `/workspace/${currentActiveWorkspace.value?.id}/settings/general`,
            children: [
              {
                name: 'General',
                path: `/workspace/${currentActiveWorkspace.value?.id}/settings/general`,
                children: null,
              },
            ],
          },
        ],
      })
    }
  }
})
</script>

<template>
  <section>
    <div
      v-if="status ==='idle' || status === 'pending' || isAppLoading"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-sm">
        <Loader2 class="animate-spin size-5" />
      </div>
    </div>
    <div v-else>
      Settings
    </div>
  </section>
</template>
