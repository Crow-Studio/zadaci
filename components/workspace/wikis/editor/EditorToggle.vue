<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const isEditable = ref(!!editor.value.isEditable)
const text = computed(() => isEditable.value ? 'Enabled' : 'Disabled')
function toggleEditorStatus() {
  editor.value.setEditable(!isEditable.value)
  isEditable.value = !isEditable.value
}
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-1 rounded-2 px-2 py-1 text-sm font-600 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
    title="Edit status"
    @click="toggleEditorStatus"
  >
    <div
      class="size-3 rounded-full"
      :class="[isEditable ? 'bg-green-500' : 'bg-gray-500']"
    />
    <span>{{ text }}</span>
  </div>
</template>

<style>

</style>
