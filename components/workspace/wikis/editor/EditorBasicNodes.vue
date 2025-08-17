<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { test } from 'linkifyjs'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const nodes = [
  {
    label: 'Link',
    icon: 'i-mdi:link',
    isActivated: () => editor.value.isActive('link'),
    toggle: () => {
      if (editor.value.isActive('link'))
        return

      editor.value.chain().focus().setLink().run()
    },
  },
  {
    label: 'Image',
    icon: 'i-mdi:image-outline',
    isActivated: () => editor.value.isActive('image'),
    toggle: () => {
      if (editor.value.isActive('image'))
        return

      const src = window.prompt('Please input image src', '')
      if (src === null) {
        return
      }

      if (!test(src, 'url')) {
        alert('Invalid image src.')
        return
      }

      editor.value.chain().focus().setImage({ src }).run()
    },
  },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <div
      v-for="item in nodes"
      :key="item.label"
      class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
      :class="{ 'bg-blue-600 text-white': item.isActivated() }"
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

<style>

</style>
