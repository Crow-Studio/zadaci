<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const nodes = [
  {
    label: 'Decrease indent',
    icon: 'i-mdi:format-indent-decrease',
    toggle: () => editor.value.chain().focus().decreaseIndent().run(),
  },
  {
    label: 'Increase indent',
    icon: 'i-mdi:format-indent-increase',
    toggle: () => editor.value.chain().focus().increaseIndent().run(),
  },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <div
      v-for="item in nodes"
      :key="item.label"
      class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
      :title="item.label"
      @click="item.toggle"
    >
      <Icon
        class="h-1em w-1em"
        :name="item.icon"
      />
    </div>
  </div>
</template>
