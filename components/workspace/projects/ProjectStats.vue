<script setup lang="ts">
import {
  isThisWeek,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from 'date-fns'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { useAsyncData, refreshNuxtData } from '#app'
import { cn } from '~/lib/utils'

interface DonutItem {
  color: string
  name: string
  value: number
}

const workspaceStore = useWorkspaceStore()
const donutData = ref<DonutItem[]>([])
const totalCompleted = ref(0)
const totalInProgress = ref(0)
const weeklyDifference = ref<number | null>(null)
const isRefreshing = ref(false)
const chartLoaded = ref(false)

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

function isLastWeek(date: Date) {
  const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })
  const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })
  return date >= lastWeekStart && date <= lastWeekEnd
}

const { data } = await useAsyncData(`all_project_stats_${currentActiveWorkspace.value?.id}`, () =>
  useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/user/projects/all`),
)

watchEffect(() => {
  if (data.value && data.value.length > 0) {
    const projects = data.value

    const completed = projects.filter(p => p.status === 'COMPLETED').length
    const inProgress = projects.filter(p => p.status === 'IN PROGRESS').length
    const total = projects.length

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

    const completedThisWeek = projects.filter(
      p =>
        p.status === 'COMPLETED'
        && isThisWeek(new Date(p.updatedAt)),
    ).length

    const completedLastWeek = projects.filter(
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

async function refreshStats() {
  isRefreshing.value = true
  try {
    await refreshNuxtData(`all_project_stats_${currentActiveWorkspace.value?.id}`)
  }
  finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  // fallback if chart doesn’t emit
  setTimeout(() => {
    chartLoaded.value = true
  }, 500)
})
</script>

<template>
  <div class="md:col-span-2 p-3">
    <div class="flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between -mb-2.5">
        <h2 class="text-lg font-semibold">
          Project Stats
        </h2>
        <Button
          :disabled="isRefreshing"
          :class="cn(
            'rounded-full cursor-pointer',
            isRefreshing && 'animate-spin',
          )"
          variant="ghost"
          size="icon"
          @click="refreshStats"
        >
          <Icon name="solar:refresh-outline" />
        </Button>
      </div>

      <div class="flex items-center justify-center h-[275px] w-full">
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

      <!-- Stats under chart -->
      <div class="grid grid-cols-2 -mt-6">
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

      <!-- Weekly diff -->
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
          of projects this week than last week.
        </template>
        <template v-else>
          No comparison data available.
        </template>
      </p>
    </div>
  </div>
</template>
