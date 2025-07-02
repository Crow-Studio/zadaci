<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import TasksColumn from './TasksColumn.vue'
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

const { data, status } = await useAsyncData(`board_view_project_tasks_${props?.project.id}`, () =>
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

async function handleDrop(columnKey: Status, task: Task, index?: number) {
  taskHandleDrop(columnKey, task, tasks, props?.project.id, index)
}
</script>

<template>
  <div>
    <div
      v-if="status ==='pending' || status === 'idle'"
      class="text-muted-foreground grid place-content-center"
    >
      <Loader2 class="animate-spin" />
    </div>
    <div
      v-else
      class="flex overflow-x-scroll gap-5 my-2 scrollbar-hide"
    >
      <TasksColumn
        v-for="column in taskColumns"
        :key="column.name"
        :column="column"
        :data="tasks[column.name.toUpperCase()] ?? []"
        :on-drop="(project, index) => handleDrop(column.name.toUpperCase() as Status, project, index)"
        :project="props.project"
      />
    </div>
  </div>
</template>
