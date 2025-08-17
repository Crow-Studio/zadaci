<script lang="ts" setup>
import type { Editor } from '@tiptap/core'

const props = defineProps<{
  editor: Editor
}>()

const marks = [
  {
    label: 'Bold',
    icon: 'i-mdi:format-bold',
    isActivated: () => props.editor.isActive('bold'),
    toggle: () => props.editor.chain().focus().toggleBold().run(),
  },
  {
    label: 'Code',
    icon: 'i-mdi:code',
    isActivated: () => props.editor.isActive('code'),
    toggle: () => props.editor.chain().focus().toggleCode().run(),
  },
  {
    label: 'Italic',
    icon: 'i-mdi:format-italic',
    isActivated: () => props.editor.isActive('italic'),
    toggle: () => props.editor.chain().focus().toggleItalic().run(),
  },
  {
    label: 'Strike',
    icon: 'i-mdi:format-strikethrough-variant',
    isActivated: () => props.editor.isActive('strike'),
    toggle: () => props.editor.chain().focus().toggleStrike().run(),
  },
  {
    label: 'Underline',
    icon: 'i-mdi:format-underline',
    isActivated: () => props.editor.isActive('underline'),
    toggle: () => props.editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: 'Superscript',
    icon: 'i-mdi:format-superscript',
    isActivated: () => props.editor.isActive('superscript'),
    toggle: () => props.editor.chain().focus().toggleSubscript().run(),
  },
  {
    label: 'Subscript',
    icon: 'i-mdi:format-subscript',
    isActivated: () => props.editor.isActive('subscript'),
    toggle: () => props.editor.chain().focus().toggleSubscript().run(),
  },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <div
      v-for="item in marks"
      :key="item.label"
      class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
      :class="{ '!bg-blue-600 !text-white': item.isActivated() }"
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
