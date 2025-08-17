import { Extension } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'

export interface IndentOptions {
  // margin-left = tabs * tabSize
  tabSize: number

  // max tab numbers
  maxTabs: number

  excludes: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      increaseIndent: (tabs?: number) => ReturnType
      decreaseIndent: (tabs?: number) => ReturnType
    }
  }
}

export const indent = Extension.create<IndentOptions>({
  name: 'indent',
  priority: 1000,
  addOptions() {
    return {
      tabSize: 16,
      maxTabs: Number.MAX_SAFE_INTEGER,
      excludes: ['table', 'listItem', 'taskItem'],
    }
  },
  addGlobalAttributes() {
    const blockNodes = this.extensions.filter(ext => ext.type === 'node' && ext.name !== 'text')

    return [
      {
        types: blockNodes.map(node => node.name),
        attributes: {
          tabs: {
            default: 0,
            parseHTML: (element) => {
              if (this.options.tabSize <= 0) {
                return 0
              }

              let marginLeft = Number.parseInt(element.style.paddingLeft)
              if (Number.isNaN(marginLeft)) {
                marginLeft = 0
              }

              return marginLeft / this.options.tabSize
            },
            renderHTML: (attributes) => {
              return {
                style: `padding-left: ${Math.max(Number(attributes.tabs), 0) * this.options.tabSize}px;`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    const getNodePos = (doc: Node, node: Node) => {
      let pos = 0

      doc.forEach((child, offset) => {
        if (child.eq(node)) {
          pos = offset
        }
      })

      return pos
    }

    return {
      increaseIndent: tabs => ({ dispatch, state, tr, editor }) => {
        const isInExcludes = this.options.excludes.some(node => editor.isActive(node))
        if (isInExcludes) {
          return false
        }

        const { selection, doc } = state
        const row = selection.$head.node(1)

        if (!dispatch || !selection.empty || row.attrs.tabs >= this.options.maxTabs) {
          return false
        }

        tr.setNodeAttribute(getNodePos(doc, row), 'tabs', tabs ?? Math.min(row.attrs.tabs + 1, this.options.maxTabs))
        return dispatch(tr)
      },
      decreaseIndent: tabs => ({ editor, dispatch, state, tr }) => {
        const isInExcludes = this.options.excludes.some(node => editor.isActive(node))
        if (isInExcludes) {
          return false
        }

        const { selection, doc } = state
        const row = selection.$head.node(1)

        if (!dispatch || !selection.empty || row.attrs.tabs <= 0) {
          return false
        }

        tr.setNodeAttribute(getNodePos(doc, row), 'tabs', tabs ?? Math.max(row.attrs.tabs - 1, 0))
        return dispatch(tr)
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Tab': ({ editor }) => editor.commands.increaseIndent(),
      'Shift-Tab': ({ editor }) => editor.commands.decreaseIndent(),
    }
  },
})
