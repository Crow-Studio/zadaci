<script setup lang="ts">
import TasksTabs from './tasks/TasksTabs.vue'
import TaskStats from './tasks/TaskStats.vue'
import { mapTasksByStatus } from '~/lib/tasks'
import type { DBProject, Task } from '~/types'

const props = defineProps<{
  workspaceId: string
  projectId: string
  project: DBProject
}>()

const tasks = ref<Record<string, Task[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

// Add filtered tasks state
const filteredTasks = ref<Record<string, Task[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

const { data } = await useAsyncData(`board_view_project_tasks_${props?.project.id}`, () =>
  useRequestFetch()(`/api/workspace/${props.project.workspaceId}/project/${props?.project.id}/tasks/all`),
)

watchEffect(() => {
  if (data.value) {
    mapTasksByStatus(data.value, tasks)
  }
})

watch(data, () => {
  if (data.value) {
    mapTasksByStatus(data.value, tasks)
  }
}, { immediate: true })

function handleTasksFiltered(newFilteredTasks: Record<string, Task[]>) {
  filteredTasks.value = newFilteredTasks
}
</script>

<template>
  <div class="grid md:grid-cols-4 xl:grid-cols-8 gap-10">
    <TasksTabs
      :project="props?.project"
      :tasks="tasks"
      :filtered-tasks="filteredTasks"
      :handle-tasks-filtered="handleTasksFiltered"
    />
    <TaskStats
      :workspace-id="props.workspaceId"
      :project-id="props.projectId"
    />
  </div>
</template>
