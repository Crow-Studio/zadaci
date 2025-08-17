<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { test } from 'linkifyjs'
import type EditorFloating from '../../EditorFloating.vue'

const props = defineProps<NodeViewProps>()

const formData = ref<{
  text?: string
  href?: string
}>({
  text: props.node.textContent,
  href: (props.node.attrs.href ?? '') as string,
})
const isEdit = ref(!formData.value.href)
function resetState() {
  formData.value = {
    text: props.node.textContent,
    href: props.node.attrs.href as string,
  }
  isEdit.value = !formData.value.href
}
function toEdit(e?: MouseEvent) {
  e?.preventDefault()
  props.editor.commands.setNodeSelection(props.getPos())
  isEdit.value = true
}

const floatingRef = ref<InstanceType<typeof EditorFloating>>()

const canUpdate = computed(() => !!formData.value.text && test(formData.value.href ?? ''))
function updateLink() {
  props.editor.commands.updateLink(props.getPos(), formData.value)
  floatingRef.value?.close()
}
function cancelEdit() {
  floatingRef.value?.close()
}

function unsetLink() {
  props.editor.commands.unsetLink(props.getPos())
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="ml-0.5 inline-block"
  >
    <EditorFloating
      ref="floatingRef"
      :model-value="!formData.href"
      mode="hover"
      :disabled="!editor.isEditable"
      @open="resetState"
    >
      <NodeViewContent
        as="a"
        v-bind="node.attrs"
        target="_blank"
        class="text-blue-600 font-600 no-underline word-break hover:underline"
      />
      <template #floating>
        <div
          v-if="isEdit"
          class="w-100 p-2"
        >
          <div>
            <label class="block text-neutral-900">Text</label>
            <input
              v-model="formData.text"
              class="mt-2 block w-full border border-stone-300 rounded-1 border-solid px-2 py-1 text-sm outline-blue-500 outline-offset-4 focus:outline-2"
            >
          </div>
          <div class="mt-4">
            <label
              label
              class="block text-neutral-900"
            >Href</label>
            <input
              v-model="formData.href"
              class="mt-2 block w-full border border-stone-300 rounded-1 border-solid px-2 py-1 text-sm outline-blue-500 outline-offset-4 focus:outline-2"
            >
          </div>
          <div class="mt-4 flex items-center justify-end gap-2">
            <button
              class="cursor-pointer rounded border-none bg-blue-600 px-2 py-0.5 text-sm text-white transition-colors hover:bg-blue-700 !disabled:cursor-not-allowed !disabled:bg-slate-400"
              :disabled="!canUpdate"
              @click="updateLink"
            >
              Update
            </button>
            <button
              class="cursor-pointer border border-stone-4 rounded border-solid bg-white px-2 py-0.5 text-sm transition-colors hover:bg-zinc-200"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </div>
        <div
          v-else
          class="h-8 flex items-center gap-1"
        >
          <a
            class="inline-block max-w-80 cursor-pointer truncate rounded-1.5 px-2 py-0.5 text-sm text-blue-600 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            :href="node.attrs.href"
            target="_blank"
          >{{ node.textContent }}</a>
          <div
            title="Edit link"
            class="cursor-pointer rounded-2 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            @click="toEdit"
          >
            <div class="i-mdi:edit-outline h-1em w-1em" />
          </div>
          <div
            title="Unlink"
            class="cursor-pointer rounded-2 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            @click="unsetLink"
          >
            <div class="i-tdesign:link-unlink h-1em w-1em" />
          </div>
          <div
            title="Delete link"
            class="cursor-pointer rounded-2 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
            @click="deleteNode()"
          >
            <div class="i-mdi:delete-outline h-1em w-1em" />
          </div>
        </div>
      </template>
    </EditorFloating>
  </NodeViewWrapper>
</template>

<style>

</style>
