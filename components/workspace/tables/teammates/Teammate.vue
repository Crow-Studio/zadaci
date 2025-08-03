<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import type { TeammatesWithProfile } from '~/types'

interface DataTableColumnHeaderProps {
  row: Row<TeammatesWithProfile>
}

const props = defineProps<DataTableColumnHeaderProps>()

const user = props?.row.original.user
const { user: activeUser } = useUserSession()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :class="$attrs.class">
    <div class="flex items-center gap-2">
      <Avatar class="shrink-0 rounded-md border-muted">
        <AvatarImage :src="user.profilePictureUrl!" />
        <AvatarFallback>
          CN
        </AvatarFallback>
      </Avatar>
      <div class="self-start">
        <p class="text-xs font-medium capitalize sm:text-sm">
          {{ user.username }} <span
            v-if="user.id ===activeUser?.id"
            class="font-semibold text-emerald-600"
          >(You)</span>
        </p>
        <p class="text-xs text-muted-foreground">
          {{ user.email }}
        </p>
      </div>
    </div>
  </div>
</template>
