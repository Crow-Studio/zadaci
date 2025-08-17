<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import type { CodeBlockStorage } from '@vueditor/tiptap-extension-code-block'

const props = defineProps<NodeViewProps>()
const { extension, node } = toRefs(props)

const language = computed({
  get() {
    return node.value.attrs.language ?? 'text'
  },
  set(language) {
    props.updateAttributes({
      language,
    })
  },
})
const languageClass = computed(() => `${extension.value.options?.languageClassPrefix}${language.value}`)

const { languages } = extension.value.storage as CodeBlockStorage
const displayLanguageName = computed(() => languages.find(item => item.name === language.value)?.displayName)
</script>

<template>
  <NodeViewWrapper
    as="pre"
    class="relative rounded p-2 focus-visible:!outline-none"
  >
    <EditorFloating
      class="!block"
      :disabled="!editor.isEditable"
    >
      <NodeViewContent
        as="code"
        :class="languageClass"
        class="block font-mono"
      />
      <template #floating>
        <Dropdown
          :options="languages.map(item => ({ label: item.displayName, command: () => language = item.name }))"
          :teleport="false"
        >
          <div class="flex cursor-pointer items-center rounded-2 px-2 py-1 text-sm text-indigo-600 font-600 transition-colors hover:bg-zinc-300 dark:text-indigo-400 dark:hover:bg-zinc-700">
            {{ language }}
          </div>
        </Dropdown>
      </template>
    </EditorFloating>
    <div class="absolute right-2 top-2 inline-block text-xs">
      {{ displayLanguageName }}
    </div>
  </NodeViewWrapper>
</template>

<style>

</style>
