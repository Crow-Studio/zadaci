<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { weekDays } from '~/types'

const { workspaceId } = defineProps<{
  workspaceId: string
}>()

type ProductivityDataItem = {
  day: string
  completed: number
  inReview: number
  abandoned: number
}

const selectedValue = ref<'on' | 'off'>('on') // 'on' = this week, 'off' = last week
const productivityData = ref<ProductivityDataItem[]>([])

const normalizeData = (raw: Partial<ProductivityDataItem>[]): ProductivityDataItem[] => {
  return weekDays.map((day) => {
    const match = raw.find(d => d.day === day)
    return {
      day,
      completed: match?.completed || 0,
      inReview: match?.inReview || 0,
      abandoned: match?.abandoned || 0,
    }
  })
}

const fetchData = async () => {
  try {
    const range = selectedValue.value === 'on' ? 'this' : 'last'
    const res = await $fetch(`/api/workspace/${workspaceId}/project/stats/tasks/productivity?range=${range}`, {
      method: 'GET',
    })
    productivityData.value = normalizeData(res)
  }
  catch (err) {
    console.error('Error loading productivity data', err)
  }
}

watch(selectedValue, fetchData, { immediate: true })

const ProductivityCategories = {
  completed: { name: 'Completed', color: '#22c55e' },
  inReview: { name: 'In Review', color: '#eab308' },
  abandoned: { name: 'Abandoned', color: '#ef4444' },
}

const xFormatter = (i: number): string => productivityData.value[i]?.day ?? ''
const yFormatter = (tick: number) => tick.toString()
</script>

<template>
  <div class="p-5 rounded-md border grid gap-5">
    <div class="flex items-center justify-between xl:flex-row flex-col gap-2">
      <h2 class="text-lg font-medium">
        Weekly Tasks Productivity Overview
      </h2>
      <div class="inline-flex h-9 rounded-lg bg-input/50 p-0.5 w-full xl:w-auto">
        <RadioGroup
          v-model="selectedValue"
          :data-state="selectedValue"
          class="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background after:shadow-xs after:shadow-black/[.04] after:ring-offset-background after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-2 has-focus-visible:after:ring-ring has-focus-visible:after:ring-offset-2 data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full w-full xl:w-auto"
        >
          <label
            class="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center whitespace-nowrap px-4 group-data-[state=on]:text-muted-foreground/70"
          >
            Last week
            <RadioGroupItem
              value="off"
              class="sr-only"
            />
          </label>
          <label
            class="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center whitespace-nowrap px-4 group-data-[state=off]:text-muted-foreground/70"
          >
            <span> This <span class="group-data-[state=on]:text-emerald-500">week</span> </span>
            <RadioGroupItem
              value="on"
              class="sr-only"
            />
          </label>
        </RadioGroup>
      </div>
    </div>
    <div class="w-full overflow-hidden">
      <BarChart
        :data="productivityData"
        :height="300"
        :categories="ProductivityCategories"
        :y-axis="['completed', 'inReview', 'abandoned']"
        :x-num-ticks="6"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :group-padding="0"
        :bar-padding="0.2"
        :radius="4"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
        :y-grid-line="false"
      />
    </div>
  </div>
</template>
