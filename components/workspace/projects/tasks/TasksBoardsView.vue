<script setup lang="ts">
import TasksColumn from './TasksColumn.vue'
import TasksBoardFilter from './TasksBoardFilter.vue'
import { mapTasksByStatus, taskHandleDrop } from '~/lib/tasks'
import { taskColumns, type IProject, type Status, type Task } from '~/types'

const props = defineProps<{
  project: IProject
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

// Handle filter changes
function handleTasksFiltered(newFilteredTasks: Record<string, Task[]>) {
  filteredTasks.value = newFilteredTasks
}

async function handleDrop(columnKey: Status, task: Task, index?: number) {
  taskHandleDrop(columnKey, task, tasks, props.project.workspaceId, props?.project.id, index)
}
</script>

<template>
  <div>
    <!-- Add the filter component -->
    <TasksBoardFilter
      :tasks="tasks"
      :project="props.project"
      @tasks-filtered="handleTasksFiltered"
    />

    <div class="flex overflow-x-scroll gap-5 my-2 scrollbar-hide">
      <TasksColumn
        v-for="column in taskColumns"
        :key="column.name"
        :column="column"
        :data="filteredTasks[column.name.toUpperCase()] ?? []"
        :on-drop="(project, index) => handleDrop(column.name.toUpperCase() as Status, project, index)"
        :project="props.project"
      />
    </div>
  </div>
</template>
