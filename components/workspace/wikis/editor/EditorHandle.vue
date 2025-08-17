<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3'
import { NODE_GROUP } from './utils/constants'

const props = defineProps({
  editor: Editor,
})

function triggerSlashMenu(e: MouseEvent) {
  const { view } = props.editor!

  const posInfo = view.posAtCoords({
    left: e.clientX + 64,
    top: e.clientY,
  })
  if (!posInfo) {
    return
  }

  const { doc } = view.state
  const resolvedPos = doc.resolve(posInfo.pos)
  const pos = resolvedPos.before(1)
  const node = doc.nodeAt(pos)

  if (!node) {
    return
  }

  if (node.textContent) {
    props.editor!.chain().setNodeSelection(pos).createParagraphNear().insertContent('/').focus().run()
    return
  }

  if (node.type.spec.group?.includes(NODE_GROUP.LIST)) {
    props.editor!.chain().focus(pos + 3).insertContent('/').run()
    return
  }

  props.editor!.chain().focus(pos).insertContent('/').run()
}
</script>

<template>
  <Teleport to="body">
    <div
      id="vueditor-handle"
      class="fixed left-0 top-0 flex items-center transition-transform transition-duration-300 ease-in-out -translate-y-32"
    >
      <div
        class="cursor-pointer rounded-1 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
        @click="triggerSlashMenu"
      >
        <div class="i-ic:round-plus h-1em w-1em" />
      </div>
      <div
        id="vueditor-handle-bar"
        class="cursor-pointer rounded-1 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
        draggable="true"
      >
        <div class="i-icon-park-outline:drag h-1em w-1em" />
      </div>
    </div>
  </Teleport>
</template>
