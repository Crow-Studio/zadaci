<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  type DateValue,
  parseDate,
  today,
} from '@internationalized/date'

import { computed } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const df = new DateFormatter('en-US', { dateStyle: 'long' })

const parsed = computed<DateValue | undefined>(() =>
  props.modelValue ? parseDate(props.modelValue) : undefined,
)

const onSelect = (val?: DateValue) => {
  emit('update:modelValue', val?.toString())
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !parsed && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-0.5 h-4 w-4" />
        {{ parsed ? df.format(parsed.toDate(getLocalTimeZone())) : "Due" }}
      </Button>
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
