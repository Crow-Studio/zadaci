import { Node } from '@tiptap/vue-3'

export const title = Node.create({
  name: 'title',
  group: 'title',
  content: 'text*',
  marks: '',
  parseHTML() {
    return [
      {
        tag: 'h1',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['h1', HTMLAttributes, 0]
  },
})
