<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  type DateValue,
  parseDate,
  today,
} from '@internationalized/date'

import { computed } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{
  value?: string
  onUpdateProjectDueDate: (date: string | undefined) => void
}>()

const df = new DateFormatter('en-US', { dateStyle: 'long' })

const parsed = computed<DateValue | undefined>(() =>
  props.value ? parseDate(props.value) : undefined,
)

const onSelect = (val?: DateValue) => {
  props?.onUpdateProjectDueDate(val?.toString())
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        class="w-full flex cursor-pointer text-primary"
      >
        {{ parsed ? df.format(parsed.toDate(getLocalTimeZone())) : "N/A" }}
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        :model-value="parsed"
        initial-focus
        :min-value="today(getLocalTimeZone())"
        @update:model-value="onSelect"
      />
    </PopoverContent>
  </Popover>
</template>
