<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
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
const modalStore = useModalStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

useHead({
  title: currentActiveWorkspace.value
    ? `${currentActiveWorkspace.value?.name} - Dashboard`
    : 'Dashboard',
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Dashboard` : 'Dashboard',
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
      name: 'Dashboard',
      path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
      children: null,
    })
  }
})

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <section class="">
    <WorkspaceDashboardLoadingSkeleton v-if="status ==='idle' || status === 'pending'" />
    <div
      v-else
      class="grid grid-cols-1 gap-10 md:grid-cols-4 w-full"
    >
      <div class="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col gap-8 self-start">
        <div class="flex flex-col sm:flex-row md:flex-col lg:flex-row sm:items-center lg:items-center justify-between gap-3">
          <Greetings />
          <Button
            class="bg-brand hover:bg-brand-secondary dark:text-white w-full sm:w-fit md:w-full lg:w-fit"
            @click="onAddNewProject"
          >
            <Plus />
            New project
          </Button>
        </div>
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
