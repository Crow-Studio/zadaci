<script setup lang="ts">
import type { MotionValue } from 'motion-v'
import { motion } from 'motion-v'

const props = defineProps<{
  isHovering: boolean
  cursorXSpring: MotionValue<number>
  cursorYSpring: MotionValue<number>
}>()

const showCursor = ref(true)

onMounted(() => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  showCursor.value = !isTouchDevice
})
</script>

<template>
  <motion.div
    v-if="showCursor"
    class="custom-cursor fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
    :style="{
      x: props?.cursorXSpring,
      y: props?.cursorYSpring,
    }"
  >
    <motion.div
      class="w-full h-full bg-white rounded-full"
      :animate="{
        scale: props?.isHovering ? 1.5 : 1,
        opacity: props?.isHovering ? 0.8 : 1,
      }"
      :transition="{ duration: 0.2 }"
    />
  </motion.div>
</template>

<style scoped>
/* Only hide default cursor on devices that can hover */
@media (hover: hover) and (pointer: fine) {
  :deep(*) {
    cursor: none !important;
  }
}

/* Ensure cursor is hidden on touch devices */
@media (hover: none) and (pointer: coarse) {
  .custom-cursor {
    display: none !important;
  }
}
</style>
