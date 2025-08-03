<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-vue-next'
import { CaretSortIcon, EyeNoneIcon } from '@radix-icons/vue'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps {
  column: Column<any, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div
    v-if="column.getCanSort()"
    :class="cn('flex items-center space-x-2', $attrs.class ?? '')"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <ArrowDownIcon
            v-if="column.getIsSorted() === 'desc'"
            class="ml-2 size-4"
          />
          <ArrowUpIcon
            v-else-if="column.getIsSorted() === 'asc'"
            class="ml-2 size-4"
          />
          <CaretSortIcon
            v-else
            class="ml-2 size-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUpIcon class="mr-2 size-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDownIcon class="mr-2 size-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="column.toggleVisibility(false)">
          <EyeNoneIcon class="mr-2 size-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div
    v-else
    :class="$attrs.class"
  >
    {{ title }}
  </div>
</template>
