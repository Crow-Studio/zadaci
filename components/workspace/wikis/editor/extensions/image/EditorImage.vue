<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { test } from 'linkifyjs'
import EditorFloating from '../../EditorFloating.vue'

const props = defineProps<NodeViewProps>()
const { editor, node } = toRefs(props)

function replaceImage() {
  const src = window.prompt(`Input image url to replace: ${node.value.attrs.src}`, '')
  if (src === null) {
    return
  }

  if (!test(src, 'url')) {
    alert('Invalid image src.')
  }

  props.updateAttributes({
    src,
  })
}

const imageRef = ref<InstanceType<typeof EditorFloating>>()
const { width } = useElementSize(imageRef)

const resizing = ref(false)
let initX = 0
let initWidth = 0
let direction = 'left' as 'left' | 'right'
function onMouseDown(e: MouseEvent, _direction: 'left' | 'right') {
  initX = e.clientX
  initWidth = imageRef.value!.$el.clientWidth
  direction = _direction
  resizing.value = true
}
useEventListener(document, 'mousemove', (e: MouseEvent) => {
  if (!resizing.value)
    return

  if (direction === 'right') {
    imageRef.value!.$el.style.width = `${initWidth + e.clientX - initX}px`
  }
  else {
    imageRef.value!.$el.style.width = `${initWidth + initX - e.clientX}px`
  }
})
useEventListener(document, 'mouseup', () => {
  resizing.value = false
  props.updateAttributes({
    width: width.value,
  })
})
</script>

<template>
  <NodeViewWrapper class="my-4">
    <EditorFloating
      ref="imageRef"
      mode="hover"
      :disabled="!editor.isEditable"
      class="max-w-full"
      :style="{ width: `${node.attrs.width}px` }"
    >
      <div class="relative">
        <img
          :src="node.attrs.src"
          class="pointer-events-none object-scale-down"
          :alt="node.attrs.alt"
          :title="node.attrs.title"
        >
        <div
          class="absolute bottom-0 top-0 contents h-full"
          @mousedown="(e) => onMouseDown(e, 'left')"
        >
          <div class="absolute left-1 top-1/2 h-12 max-h-1/2 w-2 cursor-ew-resize rounded bg-gray-400 shadow-surround-sm -translate-y-1/2 dark:bg-gray-600" />
        </div>
        <div
          class="absolute bottom-0 top-0 contents h-full"
          @mousedown="(e) => onMouseDown(e, 'right')"
        >
          <div class="absolute right-1 top-1/2 h-12 max-h-1/2 w-2 cursor-ew-resize rounded bg-gray-400 shadow-surround-sm -translate-y-1/2 dark:bg-gray-600" />
        </div>
      </div>
      <template #floating>
        <div
          class="h-8 flex items-center gap-1"
        >
          <a
            class="inline-block max-w-80 cursor-pointer truncate rounded-1.5 px-2 py-0.5 text-sm text-blue-600 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            :href="node.attrs.src"
            target="_blank"
          >{{ node.attrs.src }}</a>
          <div
            title="Replace"
            class="cursor-pointer rounded-2 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            @click="replaceImage"
          >
            <div class="i-material-symbols:replace-image-outline h-1em w-1em" />
          </div>
        </div>
      </template>
    </EditorFloating>
  </NodeViewWrapper>
</template>

<style>

</style>
