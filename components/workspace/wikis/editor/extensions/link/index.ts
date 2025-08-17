import type { PasteRuleMatch } from '@tiptap/vue-3'
import { Node, VueNodeViewRenderer, findParentNodeClosestToPos, nodePasteRule } from '@tiptap/vue-3'
import { find, test } from 'linkifyjs'
import { base } from 'w3c-keyname'
import EditorLink from './EditorLink.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      setLink: () => ReturnType
      unsetLink: (pos: number) => ReturnType
      updateLink: (pos: number, info: { text?: string, href?: string }) => ReturnType
    }
  }
}

export const link = Node.create({
  name: 'link',
  group: 'inline',
  content: 'text*',
  inline: true,
  marks: '',
  addAttributes() {
    return {
      href: {
        default: null,
        renderHTML: (attrs) => {
          return {
            href: attrs?.href,
          }
        },
        parseHTML: el => el.getAttribute('href'),
      },
      defaultText: {
        default: null,
        rendered: false,
      },
    }
  },
  parseHTML() {
    return [
      { tag: 'a[href]' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0]
  },
  addCommands() {
    return {
      setLink: () => ({ state, dispatch }) => {
        if (!dispatch) {
          return
        }

        const { selection, tr, doc } = state
        if (selection.empty) {
          return
        }

        const defaultText = doc.textBetween(selection.from, selection.to)

        selection.replaceWith(tr, this.type.create(null, state.schema.text(defaultText)))

        return dispatch(tr)
      },
      unsetLink: pos => ({ dispatch, state, tr }) => {
        if (!dispatch) {
          return false
        }

        const node = state.doc.nodeAt(pos)
        if (!node) {
          return false
        }

        tr.replaceRangeWith(pos, pos + node.nodeSize, state.schema.text(node.textContent))

        return true
      },
      updateLink: (pos, info) => ({ dispatch, tr, state }) => {
        if (!info || !dispatch) {
          return false
        }

        let { text, href } = info
        text = text?.trim() ?? ''
        href = href?.trim() ?? ''
        if (!text && !test(href)) {
          return false
        }

        if (text) {
          const node = state.doc.nodeAt(pos)
          if (node) {
            tr.replaceRangeWith(pos + 1, pos + node.nodeSize, state.schema.text(text))
          }
        }

        if (test(href ?? '')) {
          tr.setNodeAttribute(pos, 'href', href)
        }

        return dispatch(tr)
      },
    }
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: (text) => {
          if (!text) {
            return
          }

          return find(text).filter(item => item.isLink).map<PasteRuleMatch>(({ value, start, href }) => ({
            text: value,
            index: start,
            data: {
              href,
              defaultText: value,
            },
          }))
        },
        type: this.type,
        getAttributes({ data }) {
          return data
        },
        getContent(attrs) {
          return [
            {
              type: 'text',
              text: attrs?.defaultText,
            },
          ]
        },
      }),
    ]
  },
  onSelectionUpdate() {
    const { state } = this.editor.view
    const { selection } = state

    // not in link / text selection / not at end
    if (!this.editor.isActive(this.name) || !selection.empty) {
      return
    }

    // at start
    if (!selection.$to.nodeBefore) {
      if (state.doc.nodeAt(selection.to - 1)?.type.name !== this.name) {
        return this.editor.chain().focus(selection.to - 2).run()
      }

      return this.editor.chain().insertContentAt(selection.to - 1, ' ').run()
    }

    // at end
    if (!selection.$to.nodeAfter) {
      if (state.doc.nodeAt(selection.to + 1)) {
        return this.editor.chain().focus(selection.to + 2).run()
      }

      return this.editor.chain().insertContentAt(selection.to + 1, ' ').run()
    }

    return false
  },
  addKeyboardShortcuts() {
    return {
      [base['37']]: ({ editor }) => {
        const { state } = editor.view
        const { selection, doc } = state

        // const node = doc.nodeAt(selection.to)
        // console.info(selection, node, findParentNodeClosestToPos(doc.resolve(selection.to - 2), () => true))
        const { node } = findParentNodeClosestToPos(doc.resolve(selection.to - 2), () => true)!
        if (node.type.name !== this.name) {
          return false
        }

        return editor.commands.focus(selection.to - 3)
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(EditorLink)
  },
})
