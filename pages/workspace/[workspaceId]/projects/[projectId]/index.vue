<script setup lang="ts">
import ProjectContentEditable from '~/components/workspace/projects/ProjectContentEditable.vue'
import TasksTabs from '~/components/workspace/projects/tasks/TasksTabs.vue'
import TaskStats from '~/components/workspace/projects/tasks/TaskStats.vue'
import type { Priority, Status } from '~/types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const route = useRoute()
const workspaceStore = useWorkspaceStore()

const AVATARS = [
  {
    src: 'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg',
    fallback: 'SK',
    tooltip: 'Skyleen',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
    fallback: 'CN',
    tooltip: 'Shadcn',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg',
    fallback: 'AW',
    tooltip: 'Adam Wathan',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
    fallback: 'GR',
    tooltip: 'Guillermo Rauch',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg',
    fallback: 'JH',
    tooltip: 'Jhey',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
    fallback: 'GR',
    tooltip: 'Guillermo Rauch',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg',
    fallback: 'JH',
    tooltip: 'Jhey',
  },
]

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
      <ProjectContentEditable
        v-if="project"
        :project="{
          ...project,
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
          dueDate: project.due_date ? new Date(project.due_date) : null,
          workspaceId: project.workspace_id,
          members: project.members,
        }"
      />
      <div class="flex items-center gap-x-10">
        <div class="flex items-center space-x-3">
          <div class="flex -space-x-2">
            <Avatar
              v-for="(avatar, index) in AVATARS.slice(0, 5)"
              :key="index"
              class="w-8 h-8 border-2 border-white rounded-full"
            >
              <AvatarImage :src="avatar.src" />
              <AvatarFallback>{{ avatar.fallback }}</AvatarFallback>
            </Avatar>

            <div
              v-if="AVATARS.length > 5"
              class="w-8 h-8 flex items-center justify-center bg-gray-200 text-sm text-gray-700 rounded-full border-2 border-white"
            >
              {{ AVATARS.length - 5 }}+
            </div>
          </div>

          <Button
            class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out hover:scale-105 w-full sm:w-auto flex-shrink-0"
          >
            + Add Member
          </Button>
        </div>

        <Button
          class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out hover:scale-105 w-full sm:w-auto flex-shrink-0"
        >
          <!-- @click="onAddNewTask" -->
          <Icon
            name="hugeicons:task-add-01"
            class="size-4"
          />
          New Task
        </Button>
      </div>
    </div>

    <div
      v-if="project"
      class="grid md:grid-cols-4 xl:grid-cols-8 gap-10"
    >
      <TasksTabs
        :project="{
          id: Array.isArray(route.params.projectId) ? route.params.projectId[0]! : route.params.projectId!,
          title: project.title,
          status: project.status as Status,
          priority: project.priority as Priority,
          dueDate: project.due_date ? new Date(project.due_date) : null,
          workspaceId: project.workspace_id,
        }"
      />
      <TaskStats
        :workspace-id="project.workspace_id"
        :project-id="project.id"
      />
    </div>
  </section>
</template>
