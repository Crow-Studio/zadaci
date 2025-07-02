<script setup lang="ts">
import { columns, type Status, type Priority } from '~/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const props = defineProps<{
  status: Status
  onUpdateProjectInfo(field: string, value: Status | Priority | string | undefined): Promise<void>
}>()

const status = ref(props?.status)

const onUpdateStatus = async (val: Status) => {
  status.value = val
  await props?.onUpdateProjectInfo('status', val)
}
</script>

<template>
  <div class="flex items-center gap-x-1.5 text-primary">
    <Icon
      :name="status
        ? (columns.find(c => c.name.toUpperCase() === status)?.icon || 'hugeicons:ai-idea')
        : 'hugeicons:ai-idea'"
      class="shrink-0"
    />
    <Select
      :default-value="status"
      @update:model-value="(val) => onUpdateStatus(val as Status)"
    >
      <SelectTrigger
        class="w-full shadow-none !border-0 !outline-none !text-sm cursor-pointer p-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&_svg]:hidden !focus:ring-0 !focus:outline-none !focus-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none !active:ring-0 !active:outline-none !hover:border-0 !focus:border-0 !focus-visible:border-0"
        style="border: none !important; outline: none !important; box-shadow: none !important;"
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent
        class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 dark:bg-[#1d1d1d]"
      >
        <SelectItem
          v-for="column in columns"
          :key="column.name"
          :value="column.name.toUpperCase()"
        >
          <Icon
            :name="column.icon"
            width="16"
            height="16"
            aria-hidden="true"
          />
          <span class="truncate">
            {{ column.name }}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
