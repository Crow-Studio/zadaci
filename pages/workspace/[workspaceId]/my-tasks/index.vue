<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

useHead({
  title: currentActiveWorkspace.value
    ? `${currentActiveWorkspace.value?.name} - My Tasks`
    : 'My Tasks',
})

defineOgImageComponent('Zadaci', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - My Tasks` : 'My Tasks',
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
  workspaceStore?.onSetWorkspaceBreadcrumb({
    name: `${currentActiveWorkspace.value?.name}`,
    path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
    children: [
      {
        name: 'My Tasks',
        path: `/workspace/${currentActiveWorkspace.value?.id}/my-tasks`,
        children: null,
      },
    ],
  })
})
</script>

<template>
  <section class="">
    <div
      v-if="status ==='idle' || status === 'pending'"
      class="min-h-[55vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-sm">
        <Loader2 class="animate-spin size-5" />
        <p>Loading...</p>
      </div>
    </div>
    <div
      v-else
    >
      {{ currentActiveWorkspace?.name }} - My Tasks
    </div>
  </section>
</template>
