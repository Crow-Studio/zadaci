<script setup lang="ts">
import MyTasksColumn from './MyTasksColumn.vue'
import MyTasksBoardsFilter from './MyTasksBoardsFilter.vue'
import { taskColumns, type MyTask, type Status } from '~/types'
import { myTaskHandleDrop } from '~/lib/my-tasks'

const props = defineProps<{
  workspaceId: string
  tasks: Record<string, MyTask[]>
}>()

const localTasks = ref<Record<string, MyTask[]>>({ ...props.tasks })

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = { ...newTasks }
  },
  { immediate: true, deep: true },
)

const filteredTasks = ref<Record<string, MyTask[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

async function handleDrop(columnKey: Status, task: MyTask, index?: number) {
  myTaskHandleDrop(columnKey, task, localTasks, props?.workspaceId, index)
}

function handleTasksFiltered(newFilteredTasks: Record<string, MyTask[]>) {
  filteredTasks.value = newFilteredTasks
}
</script>

<template>
  <div
    class="space-y-2"
  >
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
