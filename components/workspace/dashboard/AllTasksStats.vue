<script setup lang="ts">
import {
  isThisWeek,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from 'date-fns'
import { ref, watchEffect } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { useAsyncData, refreshNuxtData } from '#app'

interface DonutItem {
  color: string
  name: string
  value: number
}

const { workspaceId } = defineProps<{
  workspaceId: string
}>()

const donutData = ref<DonutItem[]>([])
const totalCompleted = ref(0)
const totalInProgress = ref(0)
const weeklyDifference = ref<number | null>(null)
const isRefreshing = ref(false)
const chartLoaded = ref(false)

function isLastWeek(date: Date) {
  const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }) // Monday
  const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }) // Sunday
  return date >= lastWeekStart && date <= lastWeekEnd
}

const { data } = await useAsyncData(`all_project_task_stats_${workspaceId}`, () =>
  useRequestFetch()(`/api/workspace/${workspaceId}/project/stats/tasks`),
)

watchEffect(() => {
  if (data.value && data.value.length > 0) {
    const tasks = data.value

    const completed = tasks.filter(p => p.status === 'COMPLETED').length
    const inProgress = tasks.filter(p => p.status === 'IN PROGRESS').length
    const total = tasks.length

    totalCompleted.value = completed
    totalInProgress.value = inProgress

    donutData.value = [
      {
        name: 'Completed',
        color: '#22c55e',
        value: Math.round((completed / total) * 100),
      },
      {
        name: 'In Progress',
        color: '#3b82f6',
        value: Math.round((inProgress / total) * 100),
      },
    ]

    const completedThisWeek = tasks.filter(
      p =>
        p.status === 'COMPLETED'
        && isThisWeek(new Date(p.updatedAt)),
    ).length

    const completedLastWeek = tasks.filter(
      p =>
        p.status === 'COMPLETED'
        && isLastWeek(new Date(p.updatedAt)),
    ).length

    if (completedLastWeek === 0 && completedThisWeek > 0) {
      weeklyDifference.value = 100
    }
    else if (completedLastWeek === 0) {
      weeklyDifference.value = null
    }
    else {
      const diff
        = ((completedThisWeek - completedLastWeek) / completedLastWeek) * 100
      weeklyDifference.value = Math.round(diff)
    }
  }
  else {
    donutData.value = []
    totalCompleted.value = 0
    totalInProgress.value = 0
    weeklyDifference.value = null
  }
})

onMounted(() => {
  setTimeout(() => {
    chartLoaded.value = true
  }, 500)
})

async function refreshStats() {
  isRefreshing.value = true
  try {
    await refreshNuxtData(`all_project_task_stats_${workspaceId}`)
  }
  catch (error) {
    console.error('Error refreshing stats:', error)
  }
  finally {
    isRefreshing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between -mb-8">
      <h2 class="text-lg font-semibold">
        All Tasks Stats
      </h2>
      <Button
        :disabled="isRefreshing"
        class="rounded-full cursor-pointer"
        variant="ghost"
        size="icon"
        @click="refreshStats"
      >
        <Loader2
          v-if="isRefreshing"
          class="w-5 h-5 animate-spin"
        />
        <Icon
          v-else
          name="solar:refresh-outline"
        />
      </Button>
    </div>

    <div class="max-w-full overflow-hidden flex items-center justify-center h-[275px]">
      <div
        v-if="!chartLoaded"
        class="flex flex-col items-center gap-y-1.5"
      >
        <Loader2

          class="w-8 h-8 animate-spin text-muted-foreground"
        />
        <p class="text-xs text-muted-foreground">
          Loading chart
        </p>
      </div>
      <DonutChart
        v-else
        :data="donutData.map(i => i.value)"
        :height="275"
        :labels="donutData"
        :hide-legend="true"
        :radius="0"
        type="half"
        @ready="chartLoaded = true"
      />
    </div>

    <div class="grid grid-cols-2 -mt-8">
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-x-2">
          <div class="bg-green-500 size-1.5 rounded-full" />
          <p class="text-muted-foreground text-sm">
            Completed
          </p>
        </div>
        <p class="text-2xl font-medium">
          {{ totalCompleted }}
        </p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-x-2">
          <div class="bg-blue-500 size-1.5 rounded-full" />
          <p class="text-muted-foreground text-sm">
            In Progress
          </p>
        </div>
        <p class="text-2xl font-medium">
          {{ totalInProgress }}
        </p>
      </div>
    </div>

    <p class="text-center text-muted-foreground text-sm">
      <template v-if="weeklyDifference !== null">
        You completed
        <strong
          :class="{
            'text-emerald-500': weeklyDifference > 0,
            'text-rose-500': weeklyDifference < 0,
            'text-muted-foreground': weeklyDifference === 0,
          }"
        >
          {{ Math.abs(weeklyDifference) }}% {{
            weeklyDifference > 0
              ? 'more'
              : weeklyDifference < 0
                ? 'less'
                : 'same'
          }}
        </strong>
        of tasks this week than last week.
      </template>
      <template v-else>
        No comparison data available.
      </template>
    </p>
  </div>
</template>
