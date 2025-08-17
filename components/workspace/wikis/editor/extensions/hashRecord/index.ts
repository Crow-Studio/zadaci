import type { JSONContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/vue-3'
import destr from 'destr'
import { unzipStr, zipStr } from '../../../utils/compress'

export interface HashRecord {
  doc: JSONContent
}

const updateHash = useDebounceFn((editor: Editor) => {
  const record: HashRecord = {
    doc: editor.getJSON(),
  }

  location.hash = `#${zipStr(JSON.stringify(record))}`
}, 100)

export const hashRecord = Extension.create({
  name: 'hashRecord',
  onCreate() {
    const hash = location.hash.slice(1)
    if (!hash) {
      return
    }

    const record = destr<HashRecord>(unzipStr(hash))
    if (!record) {
      return
    }

    const { doc } = record

    this.editor.chain().setContent(doc).run()
  },
  onUpdate() {
    updateHash(this.editor)
  },
})
