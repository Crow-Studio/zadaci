<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import MyTasksStats from '~/components/workspace/my-tasks/tabs/MyTasksStats.vue'
import MyTasksTabs from '~/components/workspace/my-tasks/tabs/MyTasksTabs.vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const workspaceStore = useWorkspaceStore()
const nuxtApp = useNuxtApp()
const isAppLoading = ref(true)

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
            name: 'My Tasks',
            path: `/workspace/${currentActiveWorkspace.value?.id}/my-tasks`,
            children: null,
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
        <p>Loading...</p>
      </div>
    </div>
    <div
      v-else
      class="grid gap-5"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <Button
          class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out hover:-translate-y-1.5 w-full sm:w-auto flex-shrink-0"
        >
          <Icon
            name="hugeicons:task-add-01"
            class="size-5"
          />
          New Task
        </Button>
      </div>
      <div class="grid md:grid-cols-4 xl:grid-cols-8 gap-10">
        <MyTasksTabs :workspace-id="currentActiveWorkspace?.id!" />
        <MyTasksStats :workspace-id="currentActiveWorkspace?.id!" />
      </div>
    </div>
  </section>
</template>
