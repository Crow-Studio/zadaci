<script setup lang="ts">
import { useDraggable } from '@vue-dnd-kit/core'
import { computed } from 'vue'

const { index, source } = defineProps<{
  index: number
  source: any[]
}>()

const { elementRef: elementTaskRef, handleDragStart, isOvered, isDragging } = useDraggable({
  data: computed(() => ({
    index,
    source,
  })),
  groups: ['default'],
})
</script>

<template>
  <div
    ref="elementTaskRef"
    :data-index="index"
    :class="{
      'is-over': isOvered,
      'is-dragging': isDragging,
    }"
    class="w-full rounded-md transition-all self-start"
  >
    <div
      v-if="isOvered"
      class="text-sm font-medium bg-background/50 my-2 p-9 rounded-md"
    />
    <div class="bg-background p-2.5 rounded-sm shadow space-y-1 group">
      <div
        class="drag-handle grid place-content-center text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
        role="button"
        tabindex="0"
        aria-label="Drag handle"
        @pointerdown="handleDragStart"
      >
        <Icon
          name="akar-icons:drag-vertical"
          class="rotate-90"
        />
      </div>
      <div class="cursor-pointer">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.drag-handle {
  cursor: grabbing;
  user-select: none;
}

.is-dragging {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>
