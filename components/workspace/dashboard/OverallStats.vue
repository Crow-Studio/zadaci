<script setup lang="ts">
const { workspaceId } = defineProps<{
  workspaceId: string
}>()

const { data } = await useAsyncData(`overall_stats_${workspaceId}`, () =>
  useRequestFetch()(`/api/workspace/${workspaceId}/stats/overall`),
)
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
    <div class="rounded-md border p-5 grid gap-y-2">
      <h3 class="uppercase text-muted-foreground text-sm font-semibold">
        Total Projects
      </h3>
      <div class="flex items-center gap-x-3">
        <Icon
          name="solar:folder-with-files-outline"
          size="35"
        />
        <p class="text-3xl">
          {{ data?.totalProjects }} <span class="text-base text-muted-foreground">/ active</span>
        </p>
      </div>
    </div>
    <div class="rounded-md border p-5 grid gap-y-2">
      <h3 class="uppercase text-muted-foreground text-sm font-semibold">
        Total Tasks
      </h3>
      <div class="flex items-center gap-x-3">
        <Icon
          name="hugeicons:task-01"
          size="35"
        />
        <p class="text-3xl">
          {{ data?.totalTasks }} <span class="text-base text-muted-foreground">/ created</span>
        </p>
      </div>
    </div>
    <div class="rounded-md border p-5 grid gap-y-2">
      <h3 class="uppercase text-muted-foreground text-sm font-semibold">
        In Progress
      </h3>
      <div class="flex items-center gap-x-3">
        <Icon
          name="solar:alarm-outline"
          size="35"
        />
        <p class="text-3xl">
          {{ data?.totalTasksInProgress }} <span class="text-base text-muted-foreground">/ tasks</span>
        </p>
      </div>
    </div>
    <div class="rounded-md border p-5 grid gap-y-2">
      <h3 class="uppercase text-muted-foreground text-sm font-semibold">
        Completed
      </h3>
      <div class="flex items-center gap-x-3">
        <Icon
          name="solar:check-circle-outline"
          size="35"
        />
        <p class="text-3xl">
          {{ data?.totalTasksCompleted }} <span class="text-base text-muted-foreground">/ tasks</span>
        </p>
      </div>
    </div>
  </div>
</template>
