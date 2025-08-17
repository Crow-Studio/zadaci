import { Extension } from '@tiptap/vue-3'
import { trailingNode as trailingNodePlugin } from '@tiptap/pm/trailing-node'

export const trailingNode = Extension.create({
  name: 'trailingNode',
  addProseMirrorPlugins() {
    return [
      trailingNodePlugin(),
    ]
  },
})
