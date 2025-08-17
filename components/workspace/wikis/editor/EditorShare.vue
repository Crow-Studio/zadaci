<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { zipStr } from '../utils/compress'
import type { HashRecord } from './extensions/hashRecord'

const props = defineProps<{
  editor: Editor
}>()

const { copy, copied } = useClipboard()

function handleCopy() {
  const doc = props.editor.getJSON()

  const record: HashRecord = {
    doc,
  }

  const hash = `#${zipStr(JSON.stringify(record))}`
  copy(`${location.origin}/${hash}`)
}
</script>

<template>
  <div
    class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
    title="Toggle theme"
    @click="handleCopy"
  >
    <Transition
      name="slide-up"
      mode="out-in"
    >
      <Icon
        v-if="copied"
        name="i-mdi:success-circle"
        class="h-1em w-1em bg-green-500"
      />
      <Icon
        v-else
        name="i-mdi:share-outline"
        class="h-1em w-1em"
      />
    </Transition>
  </div>
</template>

<style>

</style>
