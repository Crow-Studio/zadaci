<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import MyTasksWrapper from '~/components/workspace/my-tasks/tabs/MyTasksWrapper.vue'

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
  if (!workspace.value) {
    workspaceStore?.onSetActiveWorkspace(null)
    navigateTo('/workspace/onboarding')
  }
  else {
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
  }
})
</script>

<template>
  <section>
    <div
      v-if="status ==='idle' || status === 'pending'"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-sm">
        <Loader2 class="animate-spin size-5" />
        <p>Loading...</p>
      </div>
    </div>
    <div
      v-else
      class="space-y-4"
    >
      <div class="flex items-center gap-x-3">
        <Avatar class="w-12 h-12 sm:w-14 sm:h-14 rounded-md flex-shrink-0">
          <AvatarImage
            :src="currentActiveWorkspace?.imageUrl!"
            :alt="currentActiveWorkspace?.name!"
          />
          <AvatarFallback class="rounded-md">
            CN
          </AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1">
          <h1 class="text-lg sm:text-xl font-semibold truncate">
            My Tasks
          </h1>
          <p class="text-xs sm:text-sm text-muted-foreground truncate">
            Overview of all your tasks in <span class="capitalize">{{ currentActiveWorkspace?.name }}</span> Workspace.
          </p>
        </div>
      </div>
      <MyTasksWrapper :workspace-id="currentActiveWorkspace?.id!" />
    </div>
  </section>
</template>
