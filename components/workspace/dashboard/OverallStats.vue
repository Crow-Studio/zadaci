<script setup lang="ts">
const { workspaceId } = defineProps<{
  workspaceId: string
}>()

const { data, status } = await useAsyncData(`overall_stats_${workspaceId}`, () =>
  useRequestFetch()(`/api/workspace/${workspaceId}/stats/overall`),
)

const loadingArray = ref(Array.from({ length: 4 }))
</script>

<template>
  <div>
    <div
      v-if="status ==='pending' || status === 'idle'"
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
    >
      <div
        v-for="(_, index) in loadingArray"
        :key="index"
        class="rounded-md border p-5 grid gap-y-1.5"
      >
        <div class="h-2.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
        <div class="flex w-1/12 items-center gap-1.5">
          <div class="size-8 shrink-0 animate-pulse rounded-md bg-slate-200 dark:bg-muted-foreground md:size-10" />
          <div class="grid w-full shrink-0 gap-1">
            <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
            <div class="h-2 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
    >
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
  </div>
</template>
