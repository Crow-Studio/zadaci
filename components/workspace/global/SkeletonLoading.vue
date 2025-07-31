<script setup lang="ts">
import { cn } from '~/lib/utils'

const loadingArray = ref(Array.from({ length: 3 }))
</script>

<template>
  <div
    class="rounded-lg border"
  >
    <div
      v-for="(_, index) in loadingArray"
      :key="index"
      :class="cn(
        'flex items-center justify-between p-3 sm:gap-1.5 gap-2',
        index < loadingArray.length - 1 && 'border-b',
      )"
    >
      <div class="flex w-1/12 items-center gap-1.5">
        <div class="size-8 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-muted-foreground md:size-10" />
        <div class="grid w-full shrink-0 gap-1">
          <div class="h-2 w-full animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
          <div class="h-2 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="h-7 w-16 shrink-0 animate-pulse rounded bg-slate-200 dark:bg-muted-foreground" />
      </div>
    </div>
  </div>
</template>
