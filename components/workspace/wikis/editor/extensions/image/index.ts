import Image from '@tiptap/extension-image'
import type { JSONContent } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import EditorImage from './EditorImage.vue'

export const image = Image.extend({
  group: 'block',
  inline: false,
  draggable: false,
  atom: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        rendered: true,
        renderHTML(attributes) {
          return {
            width: attributes.width,
          }
        },
        parseHTML(element) {
          const width = element.getAttribute('width')

          if (!width) {
            return 200
          }

          return Math.max(Number(width), 200)
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handlePaste(view, event) {
            if (!event.clipboardData?.files.length) {
              return
            }

            for (const file of event.clipboardData.files) {
              if (!file.type.includes('image')) {
                continue
              }

              const reader = new FileReader()
              reader.addEventListener('load', () => {
                const { dispatch, state } = view
                if (!dispatch) {
                  return
                }

                const { tr, selection, schema } = state

                tr.insert(selection.to, schema.nodeFromJSON({
                  type: 'image',
                  attrs: {
                    src: reader.result,
                    title: file.name,
                    alt: file.name,
                  },
                } as JSONContent))
                dispatch(tr)
              })
              reader.readAsDataURL(file)
              return true
            }
          },
        },
      }),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(EditorImage)
  },
})
