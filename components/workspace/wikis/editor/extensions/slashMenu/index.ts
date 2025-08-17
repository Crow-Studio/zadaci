import { Extension } from '@tiptap/core'
import type { Editor, Range } from '@tiptap/core'
import suggestion from '@tiptap/suggestion'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { VueRenderer } from '@tiptap/vue-3'
import { computePosition, flip, offset } from '@floating-ui/dom'
import { test } from 'linkifyjs'
import { KEYBOARD_EVENT_KEYS } from '../../utils/constants'
import EditorSlashMenu from './EditorSlashMenu.vue'

export const SLASH_MENU_ITEM_GROUP = {
  0: 'Basic',
  1: 'Media',
}

export interface SlashMenuItem {
  label: string
  desc: string
  icon: string
  command: (editor: Editor, range: Range) => void
  group: keyof typeof SLASH_MENU_ITEM_GROUP
  relatedWords?: string[]
}
export type SlashMenuCommand = (editor: Editor, range: Range) => void

interface SlashMenuOptions {
  suggestion: Partial<SuggestionOptions<SlashMenuItem, { items: SlashMenuItem[], command: SlashMenuCommand }>>
}

export const slashMenuItems: SlashMenuItem[] = [
  {
    label: 'Text',
    desc: 'Start typing with plain text.',
    icon: 'i-mdi:format-text',
    command: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
    group: 0,
    relatedWords: ['paragraph'],
  },
  {
    label: 'Heading 2',
    desc: 'Big section heading.',
    icon: 'i-mdi:format-heading-2',
    command: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
    group: 0,
    relatedWords: ['h2'],
  },
  {
    label: 'Heading 3',
    desc: 'Medium section heading.',
    icon: 'i-mdi:format-heading-3',
    command: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
    group: 0,
    relatedWords: ['h3'],
  },
  {
    label: 'Heading 4',
    desc: 'Small section heading.',
    icon: 'i-mdi:format-heading-4',
    command: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run(),
    group: 0,
    relatedWords: ['h4'],
  },
  {
    label: 'Bulleted list',
    desc: 'Create a simple bulleted list.',
    icon: 'i-mdi:format-list-bulleted',
    command: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    group: 0,
  },
  {
    label: 'Numbered list',
    desc: 'Create a simple numbered list.',
    icon: 'i-mdi:format-list-numbered',
    command: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    group: 0,
  },
  {
    label: 'To-do list',
    desc: 'Create a to-do list.',
    icon: 'i-mdi:format-list-checkbox',
    command: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    group: 0,
    relatedWords: ['task'],
  },
  {
    label: 'To-do list',
    desc: 'Create a to-do list.',
    icon: 'i-mdi:format-list-checkbox',
    command: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    group: 0,
    relatedWords: ['task'],
  },
  {
    label: 'Image',
    desc: 'Embed with a link',
    icon: 'i-mdi:image-outline',
    command: (editor, range) => {
      const src = window.prompt('Please input image src', '')
      if (src === null) {
        return
      }

      if (!test(src, 'url')) {
        alert('Invalid image src.')
        return
      }

      editor.chain().focus().deleteRange(range).setImage({ src }).run()
    },
    group: 1,
  },
]

const isStringContains = (all: string, part: string) => all.toLocaleLowerCase().includes(part.toLocaleLowerCase())

export const slashMenu = Extension.create<SlashMenuOptions>({
  name: 'slashMenu',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        allow({ editor }) {
          return !editor.isActive('codeBlock')
        },
        items({ query }) {
          return slashMenuItems.filter(item => isStringContains(item.label, query) || item.relatedWords?.find(word => isStringContains(word, query)))
        },
        command({ editor, range, props }) {
          props.command(editor, range)
        },
        render() {
          let component: VueRenderer | null

          const destroy = () => {
            component?.element?.remove()
            component?.destroy()
            component = null
          }
          const updatePosition = (props: SuggestionProps) => {
            if (component) {
              component.updateProps(props)
            }
            else {
              component = new VueRenderer(EditorSlashMenu, {
                props: {
                  ...props,
                  destroy,
                },
                editor: props.editor,
              })
              document.body.appendChild(component.element!)
            }

            if (!props.clientRect)
              return

            computePosition(
              {
                getBoundingClientRect() {
                  return props.clientRect!()!
                },
              },
              component.element! as HTMLElement,
              {
                strategy: 'fixed',
                placement: 'bottom-start',
                middleware: [flip(), offset(8)],
              },
            ).then(({ x, y }) => {
              Object.assign((component!.element as HTMLElement).style, {
                left: `${x}px`,
                top: `${y}px`,

              })
            })
          }

          return {
            onStart: (props) => {
              if (!props.items.length) {
                destroy()
                return
              }
              updatePosition(props)
            },
            onUpdate(props) {
              if (!props.items.length) {
                destroy()
                return
              }

              updatePosition(props)
            },
            onKeyDown(props) {
              if (props.event.key === KEYBOARD_EVENT_KEYS.ESCAPE) {
                destroy()
                return false
              }

              return component?.ref?.onKeyDown(props)
            },
            onExit() {
              destroy()
            },
          }
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
