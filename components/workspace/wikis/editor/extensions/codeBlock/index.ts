import { codeBlock as _codeBlock } from '@vueditor/tiptap-extension-code-block'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import EditorCodeBlock from './EditorCodeBlock.vue'

export const codeBlock = _codeBlock.extend({
  addNodeView() {
    return VueNodeViewRenderer(EditorCodeBlock)
  },
})
