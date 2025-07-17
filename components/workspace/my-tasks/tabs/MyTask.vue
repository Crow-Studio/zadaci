<script setup lang="ts">
import { format, isBefore, isPast } from 'date-fns'
import ActionTooltip from '../../global/ActionTooltip.vue'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'
import type { MyTask } from '~/types'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

const props = defineProps<{
  task: MyTask
}>()
</script>

<template>
  <div class="space-y-2">
    <div>
      <Badge
        :class="cn(
          'rounded text-xs gap-x-1 flex',
          props?.task.priority === 'MEDIUM' && 'bg-amber-100 dark:bg-amber-100 text-amber-500',
          props?.task.priority === 'LOW' && 'bg-purple-100 dark:bg-purple-100 text-purple-500',
          props?.task.priority === 'HIGH' && 'bg-rose-100 dark:bg-rose-100 text-rose-500',
          props?.task.priority === 'NONE' && 'bg-zinc-100 dark:bg-zinc-100 text-zinc-500',
        )"
      >
        <div
          :class="cn(
            'rounded-full size-1.5 shrink-0',
            props?.task.priority === 'MEDIUM' && 'bg-amber-500',
            props?.task.priority === 'LOW' && 'bg-purple-500',
            props?.task.priority === 'HIGH' && 'bg-rose-500',
            props?.task.priority === 'NONE' && 'bg-zinc-500',
          )"
        />
        {{ props?.task.priority }}
      </Badge>
    </div>
    <div>
      <h3
        :class="cn(
          'text-sm font-semibold',
          props?.task.status === 'COMPLETED' && 'line-through text-emerald-600',
          props?.task.status === 'ABANDONED' && 'line-through text-rose-600',
        )"
      >
        {{ props?.task.name }}
      </h3>
      <p
        v-if="props?.task.description"
        :class="cn(
          'text-sm text-muted-foreground',
          props?.task.status === 'COMPLETED' && 'line-through',
          props?.task.status === 'ABANDONED' && 'line-through text-rose-300',
        )"
      >
        {{ props?.task.description }}
      </p>
    </div>
    <div class="grid gap-1.5">
      <div
        v-for="subtask in props?.task.subtasks"
        :key="subtask.id"
        class="flex items-center gap-x-2 text-sm"
      >
        <Checkbox
          v-model="subtask.is_completed"
          disabled
          class="self-start mt-1 size-4 border-zinc-300"
        />
        <p
          :class="cn(
            'self-start mt-0.5',
            subtask.is_completed ? 'line-through text-emerald-500' : 'text-muted-foreground',
          )"
        >
          {{ subtask.name }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between text-muted-foreground text-sm">
      <div
        :class="cn(
          'flex items-center gap-1',
          props?.task.dueDate && props?.task.status !== 'COMPLETED' && props?.task.status !== 'ABANDONED' && props && (isPast(props?.task.dueDate) && isBefore(props?.task.dueDate, new Date())) && 'text-red-500',
        )"
      >
        <Icon
          name="hugeicons:calendar-02"
          class="size-5 shrink-0"
        />
        <p>
          {{
            props?.task.dueDate
              ? format(new Date(props.task.dueDate), 'd MMM')
              : 'Due'
          }}
        </p>
      </div>

      <div class="flex items-center gap-x-2">
        <p v-if="props?.task.subtasks.length > 0">
          {{ props?.task.subtasks.filter(s => s.is_completed).length }} / {{ props?.task.subtasks.length }}
        </p>
        <div
          v-if="props?.task.subtasks.length > 0"
          class="bg-muted-foreground size-1 rounded-full"
        />
        <div class="flex -space-x-2">
          <ActionTooltip
            v-for="(member, index) in props?.task.assignees.slice(0, 5)"
            :key="member.member_id"
            :label="member.username"
          >
            <Avatar
              class="size-5 border border-muted rounded-full cursor-pointer"
              :style="{ zIndex: 10 - index }"
            >
              <AvatarImage :src="member.avatar!" />
              <AvatarFallback>{{ member.username.charAt(0) }}</AvatarFallback>
            </Avatar>
          </ActionTooltip>

          <div
            v-if="props?.task.assignees.length > 5"
            class="size-5 flex items-center justify-center bg-gray-200 text-sm text-gray-700 rounded-full border-2 border-white"
            :style="{ zIndex: 5 }"
          >
            {{ props?.task.assignees.length - 5 }}+
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
