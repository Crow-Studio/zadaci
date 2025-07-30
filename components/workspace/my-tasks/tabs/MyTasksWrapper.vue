<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
// import MyTasksTabs from './MyTasksTabs.vue'
import MyTasksBoardsView from './MyTasksBoardsView.vue'
import type { MyTask } from '~/types'
import { mapMyTasksByStatus } from '~/lib/my-tasks'

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
</script>

<template>
  <div>
    <div
      v-if="status ==='idle' || status === 'pending'"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-sm">
        <Loader2 class="animate-spin size-5" />
        <p>Loading...</p>
      </div>
    </div>
    <div
      v-else
    >
      <!--  todo: would add tabs support for other views like list and calendar -->
      <!-- <MyTasksTabs
        v-if="data && data.length > 0"
        :workspace-id="props?.workspaceId"
        :tasks="tasks"
      /> -->
      <MyTasksBoardsView
        v-if="data && data.length > 0"
        :workspace-id="props?.workspaceId"
        :tasks="tasks"
      />
      <div
        v-else
        class="flex flex-col items-center my-20 gap-y-2"
      >
        <Icon
          name="hugeicons:task-done-02"
          size="80"
        />
        <div class="text-center">
          <h2 class="text-base font-medium">
            You've no assigned tasks
          </h2>
          <p class="text-sm text-muted-foreground">
            All your assigned tasks would be displayed here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
