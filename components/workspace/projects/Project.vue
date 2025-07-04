<script setup lang="ts">
import { format, isBefore, isPast } from 'date-fns'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import type { DBProject } from '~/types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import ActionTooltip from '~/components/workspace/global/ActionTooltip.vue'

const props = defineProps<{
  project: DBProject
}>()
</script>

<template>
  <div
    class="space-y-2"
  >
    <div>
      <Badge
        :class="cn(
          'rounded text-xs gap-x-1 flex',
          props?.project.priority === 'MEDIUM' && 'bg-amber-100 dark:bg-amber-100 text-amber-500',
          props?.project.priority === 'LOW' && 'bg-purple-100 dark:bg-purple-100 text-purple-500',
          props?.project.priority === 'HIGH' && 'bg-rose-100 dark:bg-rose-100 text-rose-500',
          props?.project.priority === 'NONE' && 'bg-zinc-100 dark:bg-zinc-100 text-zinc-500',
        )"
      >
        <div
          :class="cn(
            'rounded-full size-1.5 shrink-0',
            props?.project.priority === 'MEDIUM' && 'bg-amber-500',
            props?.project.priority === 'LOW' && 'bg-purple-500',
            props?.project.priority === 'HIGH' && 'bg-rose-500',
            props?.project.priority === 'NONE' && 'bg-zinc-500',
          )"
        />
        {{ props?.project.priority }}
      </Badge>
    </div>
    <div>
      <h3
        :class="cn(
          'text-sm font-semibold',
          props?.project.status === 'COMPLETED' && 'line-through text-emerald-600',
          props?.project.status === 'ABANDONED' && 'line-through text-rose-600',
        )"
      >
        {{ props?.project.title }}
      </h3>
      <p
        v-if="props?.project.description"
        :class="cn(
          'text-sm text-muted-foreground',
          props?.project.status === 'COMPLETED' && 'line-through',
          props?.project.status === 'ABANDONED' && 'line-through text-rose-300',
        )"
      >
        {{ props?.project.description }}
      </p>
    </div>
    <div class="flex items-center justify-between text-muted-foreground text-sm">
      <div
        :class="cn(
          'flex items-center gap-1',
          props?.project.dueDate && props?.project.status !== 'COMPLETED' && props?.project.status !== 'ABANDONED' && props && (isPast(props?.project.dueDate) && isBefore(props?.project.dueDate, new Date())) && 'text-red-500',
        )"
      >
        <Icon
          name="hugeicons:calendar-02"
          class="size-5 shrink-0"
        />
        <p>
          {{ props?.project.dueDate ? format(new Date(2017, 10, 6), 'd MMM') : 'Due' }}
        </p>
      </div>
      <div class="flex -space-x-2">
        <ActionTooltip
          v-for="(member, index) in props?.project.members.slice(0, 5)"
          :key="member.member_id"
          :label="member.username"
        >
          <Avatar
            class="size-5 border-2 border-white rounded-full cursor-pointer"
            :style="{ zIndex: 10 - index }"
          >
            <AvatarImage :src="member.avatar!" />
            <AvatarFallback>{{ member.username.charAt(0) }}</AvatarFallback>
          </Avatar>
        </ActionTooltip>

        <div
          v-if="props?.project.members.length > 5"
          class="size-5 flex items-center justify-center bg-gray-200 text-sm text-gray-700 rounded-full border-2 border-white"
          :style="{ zIndex: 5 }"
        >
          {{ props?.project.members.length - 5 }}+
        </div>
      </div>
    </div>
  </div>
</template>
