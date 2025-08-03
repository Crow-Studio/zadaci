<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import { Badge } from '~/components/ui/badge'
import type { TeammatesWithProfile } from '~/types'

interface DataTableColumnHeaderProps {
  row: Row<TeammatesWithProfile>
}

const props = defineProps<DataTableColumnHeaderProps>()

const role = props?.row.original.role
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :class="$attrs.class">
    <Badge
      v-if="role === 'OWNER' || role ==='MEMBER'"
      class="bg-brand px-4 uppercase dark:text-white"
    >
      {{ role }}
    </Badge>
    <Badge
      v-else
      class="bg-yellow-600 px-4 uppercase dark:text-white"
    >
      {{ role }}
    </Badge>
  </div>
</template>
