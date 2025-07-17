<script setup lang="ts">
import MyTasksColumn from './MyTasksColumn.vue'
import MyTasksBoardsFilter from './MyTasksBoardsFilter.vue'
import { taskColumns, type MyTask, type Status } from '~/types'
import { mapMyTasksByStatus, myTaskHandleDrop } from '~/lib/my-tasks'

const props = defineProps<{
  workspaceId: string
}>()

const tasks = ref<Record<string, MyTask[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

const filteredTasks = ref<Record<string, MyTask[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

const { data } = await useAsyncData(`board_view_my_tasks_${props.workspaceId}`, () =>
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

async function handleDrop(columnKey: Status, task: MyTask, index?: number) {
  myTaskHandleDrop(columnKey, task, tasks, props?.workspaceId, index)
}

function handleTasksFiltered(newFilteredTasks: Record<string, MyTask[]>) {
  filteredTasks.value = newFilteredTasks
}
</script>

<template>
  <div class="space-y-2">
    <MyTasksBoardsFilter
      :tasks="tasks"
      @tasks-filtered="handleTasksFiltered"
    />
    <div
      class="flex overflow-x-scroll gap-5 scrollbar-hide"
    >
      <MyTasksColumn
        v-for="column in taskColumns"
        :key="column.name"
        :column="column"
        :data="filteredTasks[column.name.toUpperCase()] ?? []"
        :on-drop="(task, index) => handleDrop(column.name.toUpperCase() as Status, task, index)"
      />
    </div>
  </div>
</template>
