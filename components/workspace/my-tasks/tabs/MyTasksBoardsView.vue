<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import MyTasksColumn from './MyTasksColumn.vue'
import { taskColumns, type Status, type Task } from '~/types'
import { mapMyTasksByStatus, myTaskHandleDrop } from '~/lib/my-tasks'

const props = defineProps<{
  workspaceId: string
}>()

const tasks = ref<Record<string, Task[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

const { data, status } = await useAsyncData(`board_view_my_tasks_${props.workspaceId}`, () =>
  useRequestFetch()(`/api/workspace/${props.workspaceId}/my-tasks/all`),
)

watchEffect(() => {
  if (data.value) {
    mapMyTasksByStatus(data.value, tasks)
  }
})

watch(data, () => {
  if (data.value) {
    mapMyTasksByStatus(data.value, tasks)
  }
}, { immediate: true })

async function handleDrop(columnKey: Status, task: Task, index?: number) {
  myTaskHandleDrop(columnKey, task, tasks, index)
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
      <MyTasksColumn
        v-for="column in taskColumns"
        :key="column.name"
        :column="column"
        :data="tasks[column.name.toUpperCase()] ?? []"
        :on-drop="(task, index) => handleDrop(column.name.toUpperCase() as Status, task, index)"
      />
    </div>
  </div>
</template>
