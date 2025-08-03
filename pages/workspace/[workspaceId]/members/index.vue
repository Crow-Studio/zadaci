<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import AllTasksStats from '~/components/workspace/dashboard/AllTasksStats.vue'
import Greetings from '~/components/workspace/dashboard/Greetings.vue'
import OverallStats from '~/components/workspace/dashboard/OverallStats.vue'
import WeeklyTasksProductivity from '~/components/workspace/dashboard/WeeklyTasksProductivity.vue'
import ProjectStats from '~/components/workspace/projects/ProjectStats.vue'

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
    ? `${currentActiveWorkspace.value?.name} - Dashboard`
    : 'Dashboard',
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Members` : 'Members',
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
          name: 'Members',
          path: `/workspace/${currentActiveWorkspace.value?.id}/members`,
          children: null,
        },
      ],
    })
  }
})
</script>

<template>
  <section class="">
    <div
      v-if="status ==='idle' || status === 'pending'"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-base">
        <Loader2 class="animate-spin size-5" />
      </div>
    </div>
    <div
      v-else
      class="grid grid-cols-1 gap-10 md:grid-cols-4 w-full"
    >
      <div class="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col gap-8 self-start">
        <Greetings />
        <div class="grid gap-y-3 lg:gap-y-6">
          <OverallStats :workspace-id="currentActiveWorkspace?.id!" />
          <WeeklyTasksProductivity :workspace-id="currentActiveWorkspace?.id!" />
        </div>
      </div>
      <div class="col-span-1 md:col-span-2 xl:col-span-1 self-start flex flex-col gap-8">
        <ProjectStats />
        <div>
          <AllTasksStats :workspace-id="currentActiveWorkspace?.id!" />
        </div>
      </div>
    </div>
  </section>
</template>
