<script setup lang="ts">
import { cn } from '~/lib/utils'
import { priorityOptions, type Priority, type Status } from '~/types'

const props = defineProps<{
  priority: Priority
  onUpdateProjectInfo(field: string, value: Status | Priority | string | undefined): Promise<void>
}>()

const priority = ref(props?.priority)

const onUpdatePriority = async (val: Priority) => {
  priority.value = val
  await props?.onUpdateProjectInfo('priority', val)
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <p>Priority:</p>
    <Select
      :default-value="priority"
      @update:model-value="(val) => onUpdatePriority(val as Priority)"
    >
      <SelectTrigger
        class="w-full shadow-none !border-0 !outline-none !text-sm cursor-pointer p-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&_svg]:hidden !focus:ring-0 !focus:outline-none !focus-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none !active:ring-0 !active:outline-none !hover:border-0 !focus:border-0 !focus-visible:border-0"
        style="border: none !important; outline: none !important; box-shadow: none !important;"
      >
        <SelectValue
          placeholder="Select priority"
          class="sr-only"
        />
        <Badge
          :class="cn(
            'rounded text-xs gap-x-1 flex',
            priority === 'MEDIUM' && 'bg-amber-100 dark:bg-amber-100 text-amber-500',
            priority === 'LOW' && 'bg-purple-100 dark:bg-purple-100 text-purple-500',
            priority === 'HIGH' && 'bg-rose-100 dark:bg-rose-100 text-rose-500',
            priority === 'NONE' && 'bg-zinc-100 dark:bg-zinc-100 text-zinc-500',
          )"
        >
          <div
            :class="cn(
              'rounded-full size-1.5 shrink-0',
              priority === 'MEDIUM' && 'bg-amber-500',
              priority === 'LOW' && 'bg-purple-500',
              priority === 'HIGH' && 'bg-rose-500',
              priority === 'NONE' && 'bg-zinc-500',
            )"
          />
          {{ priority }}
        </Badge>
      </SelectTrigger>
      <SelectContent
        class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2"
      >
        <SelectItem
          v-for="option in priorityOptions"
          :key="option.name"
          :value="option.value"
        >
          <div
            class="size-2 rounded-full"
            :style="{
              backgroundColor: option.color,
            }"
          />
          <span class="truncate">
            {{ option.name }}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
