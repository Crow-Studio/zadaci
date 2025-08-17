<script lang="ts" setup>
import type { Editor } from '@tiptap/core'
import { useSpring, useTransform } from 'motion-v'

const props = defineProps<{
  editor: Editor
}>()

let count = 0
const motionValue = useSpring(0, {
  duration: 1000,
  // ease: 'easeOut',
})

const displayValue = useTransform(motionValue, value => Math.round(value))
const countRef = ref<HTMLDivElement>()

function updateCount() {
  setTimeout(() => {
    const newCount = props.editor?.storage.characterCount.characters()
    count = newCount
    motionValue.set(newCount)
  })
}

const updateCountDebounce = useDebounceFn(updateCount, 1000)
props.editor?.on('update', updateCountDebounce)

// Watch for changes in displayValue and update the DOM
watchEffect(() => {
  if (countRef.value) {
    countRef.value.textContent = displayValue.get().toString()
  }
})

onBeforeUnmount(() => {
  props.editor?.off('update', updateCountDebounce)
})
</script>

<template>
  <div
    class="flex items-center gap-1 text-sm"
    title="Characters count"
  >
    <Icon
      name="i-mdi:fountain-pen-tip"
    />
    <p ref="countRef">
      {{ count }}
    </p>
  </div>
</template>
