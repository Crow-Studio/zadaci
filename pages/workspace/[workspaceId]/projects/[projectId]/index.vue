<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const route = useRoute()
const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const { data: project, status } = await useAsyncData(
  `project-${route.params.projectId}`,
  () => useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/project/${route.params.projectId}/info`),
)

watchEffect(async () => {
  if (status.value === 'success') {
    if (!project.value) {
      navigateTo('/workspace/projects/all')
      await refreshNuxtData([`sidebar_projects_${currentActiveWorkspace.value?.id}`, `board_view_projects_${currentActiveWorkspace.value?.id}`, `all_project_stat_${currentActiveWorkspace.value?.id}`, `mobile_sidebar_projects_${currentActiveWorkspace.value?.id}`])
    }
    else {
      workspaceStore?.onSetWorkspaceBreadcrumb({
        name: `${currentActiveWorkspace.value?.name}`,
        path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
        children: [
          {
            name: `Projects`,
            path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
            children: [
              {
                name: `${project.value?.title}`,
                path: `/workspace/projects/${project.value?.id}`,
                children: null,
              },
            ],
          },
        ],
      })
    }
  }
})

useHead({
  titleTemplate: `${currentActiveWorkspace.value?.name} - Project | ${project.value?.title}`,
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Project | ${project.value?.title}` : 'Project',
  description:
    'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
})
</script>

<template>
  <section class="grid gap-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- <ProjectContentEditable
        v-if="project"
        :project="{
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          dueDate: project.dueDate ? new Date(project.dueDate) : null,
        }"
      /> -->
      {{ project }}
      <Button
        class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out hover:-translate-y-1.5 w-full sm:w-auto flex-shrink-0"
      >
        <!-- @click="onAddNewTask" -->
        <Icon
          name="hugeicons:task-add-01"
          class="size-4"
        />
        New Task
      </Button>
    </div>

    <div class="grid md:grid-cols-4 xl:grid-cols-8 gap-10">
      <!-- <TasksTabs
        :project="{
          id: Array.isArray(route.params.projectId) ? route.params.projectId[0]! : route.params.projectId!,
          title: project?.title || '',
          status: project?.status as Status,
          priority: project?.priority as Priority,
          dueDate: project?.dueDate ? new Date(project.dueDate) : null,
        }"
      />
      <TaskStats :project-id="Array.isArray(route.params.projectId) ? route.params.projectId[0]! : route.params.projectId!" /> -->
    </div>
  </section>
</template>
