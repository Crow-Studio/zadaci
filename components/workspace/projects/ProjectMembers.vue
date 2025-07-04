<script setup lang="ts">
import type { ProjectMembers } from '~/types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import ActionTooltip from '~/components/workspace/global/ActionTooltip.vue'

const props = defineProps<{
  members: ProjectMembers[]
}>()
</script>

<template>
  <div class="flex -space-x-2">
    <ActionTooltip
      v-for="(member, index) in props.members.slice(0, 5)"
      :key="member.member_id"
      :label="member.username"
    >
      <Avatar
        class="size-9 border-2 border-white rounded-full cursor-pointer"
        :style="{ zIndex: 10 - index }"
      >
        <AvatarImage :src="member.avatar!" />
        <AvatarFallback>{{ member.username.charAt(0) }}</AvatarFallback>
      </Avatar>
    </ActionTooltip>

    <div
      v-if="members.length > 5"
      class="size-9 flex items-center justify-center bg-gray-200 text-sm text-gray-700 rounded-full border-2 border-white"
      :style="{ zIndex: 5 }"
    >
      {{ members.length - 5 }}+
    </div>
  </div>
</template>
