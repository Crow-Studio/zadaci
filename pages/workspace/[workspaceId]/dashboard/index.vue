<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import Greetings from '~/components/workspace/dashboard/Greetings.vue'

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
        <!-- <WeeklyTasksProductivity /> -->
      </div>
      <!-- <div class="col-span-1 md:col-span-2 xl:col-span-1 self-start flex flex-col gap-8">
        <ProjectStats />
        <div>
          <AllTasksStats />
        </div>
      </div> -->
    </div>
  </section>
</template>
