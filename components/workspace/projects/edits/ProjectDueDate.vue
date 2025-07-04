<script setup lang="ts">
import ProjectDatePicker from './ProjectDatePicker.vue'
import { formatDateForPicker } from '~/lib/utils'
import type { Priority, Status } from '~/types'

const props = defineProps<{
  dueDate: string | undefined
  onUpdateProjectInfo(field: string, value: Status | Priority | string | undefined): Promise<void>
}>()

const dueDate = ref(props?.dueDate)

const onUpdateProjectDueDate = async (date: string | undefined) => {
  dueDate.value = date
  await props?.onUpdateProjectInfo('dueDate', date)
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <span class="hidden sm:block">Due:</span>
    <ProjectDatePicker
      :value="dueDate ? formatDateForPicker(dueDate) : undefined"
      :on-update-project-due-date="onUpdateProjectDueDate"
    />
  </div>
</template>
