<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import starterKit from '@tiptap/starter-kit'
import taskList from '@tiptap/extension-task-list'
import taskItem from '@tiptap/extension-task-item'
import underline from '@tiptap/extension-underline'
import placeholder from '@tiptap/extension-placeholder'
import characterCount from '@tiptap/extension-character-count'

// custom extensions
import { handle } from '@vueditor/tiptap-extension-handle'
import { symbol } from '@vueditor/tiptap-extension-symbol'
import { document } from './extensions/document'
import { title } from './extensions/title'
import { codeBlock } from './extensions/codeBlock'
import { image } from './extensions/image'
import { link } from './extensions/link'
import { trailingNode } from './extensions/trailingNode'
import { superscript } from './extensions/superscript'
import { subscript } from './extensions/subscript'
import { indent } from './extensions/indent'
import { slashMenu } from './extensions/slashMenu'
import { hashRecord } from './extensions/hashRecord'

import content from './templates/intro.json'
import EditorHeader from './EditorHeader.vue'

const editor = useEditor({
  content,
  extensions: [
    starterKit.configure({
      document: false,
      heading: {
        levels: [2, 3, 4, 5, 6],
      },
      hardBreak: false,
      codeBlock: false,
    }),
    taskList,
    taskItem,
    underline,
    superscript,
    subscript,
    indent,
    placeholder.configure({
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case 'heading': {
            return `Heading ${node.attrs.level}`
          }
          case 'bulletList':
          case 'orderedList':
          case 'taskList':
          case 'codeBlock': {
            return ''
          }
        }

        return 'Write something, or "/" for commands'
      },
    }),
    characterCount,
    document,
    title,
    codeBlock,
    image.configure({
      allowBase64: true,
    }),
    link,
    trailingNode,
    symbol,
    slashMenu,
    hashRecord,
    handle,
  ],
  autofocus: 'start',
})
</script>

<template>
  <div class="h-full overflow-auto">
    <EditorHeader
      v-if="editor"
      :editor="editor"
    />
    <EditorContent
      :editor="editor"
      class="mx-auto mt-12 max-w-5xl"
    />
    <!-- <EditorHandle :editor="editor" /> -->

    <!-- fix load dynamic icon -->
    <div class="">
      <div class="i-mdi:format-text" />
      <div class="i-mdi:format-heading-2" />
      <div class="i-mdi:format-heading-3" />
      <div class="i-mdi:format-heading-4" />
      <div class="i-mdi:format-list-bulleted" />
      <div class="i-mdi:format-list-numbered" />
      <div class="i-mdi:format-list-checkbox" />
    </div>
  </div>
</template>

<style lang="css" scoped>
</style>
