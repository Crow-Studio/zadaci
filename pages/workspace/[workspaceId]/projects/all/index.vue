<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import ProjectTabs from '~/components/workspace/projects/ProjectTabs.vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

useHead({
  title: currentActiveWorkspace.value
    ? `${currentActiveWorkspace.value?.name} - Projects`
    : 'Projects',
})

defineOgImageComponent('Zadaci', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Projects` : 'Projects',
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
        name: 'Projects',
        path: `/workspace/${currentActiveWorkspace.value?.id}/projects/all`,
        children: [
          {
            name: 'All',
            path: `/workspace/${currentActiveWorkspace.value?.id}/projects/all`,
            children: null,
          },
        ],
      },
    ],
  })
})

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <section>
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
              All Projects
            </h1>
            <p class="text-xs sm:text-sm text-muted-foreground truncate">
              Overview of all projects in <span class="capitalize">{{ currentActiveWorkspace?.name }}</span> Workspace.
            </p>
          </div>
        </div>
        <Button
          class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out hover:-translate-y-1.5 w-full sm:w-auto flex-shrink-0"
          @click="onAddNewProject"
        >
          <Icon
            name="solar:add-folder-outline"
            class="size-5"
          />
          New Project
        </Button>
      </div>
      <div class="grid md:grid-cols-4 xl:grid-cols-8 gap-10">
        <ProjectTabs />
        <!-- <ProjectStats /> -->
      </div>
    </div>
  </section>
</template>
