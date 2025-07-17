<script setup lang="ts">
import TasksColumn from './TasksColumn.vue'
import TasksBoardFilter from './TasksBoardFilter.vue'
import { taskHandleDrop } from '~/lib/tasks'
import { taskColumns, type DBProject, type Status, type Task } from '~/types'

const props = defineProps<{
  project: DBProject
  tasks: Record<string, Task[]>
  filteredTasks: Record<string, Task[]>
  handleTasksFiltered: (newFilteredTasks: Record<string, Task[]>) => void
}>()

const localTasks = ref<Record<string, Task[]>>({ ...props.tasks })

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = { ...newTasks }
  },
  { immediate: true, deep: true },
)

async function handleDrop(columnKey: Status, task: Task, index?: number) {
  taskHandleDrop(columnKey, task, localTasks, props.project.workspaceId, props?.project.id, index)
}
</script>

<template>
  <div>
    <!-- Add the filter component -->
    <TasksBoardFilter
      :tasks="tasks"
      @tasks-filtered="props?.handleTasksFiltered"
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
