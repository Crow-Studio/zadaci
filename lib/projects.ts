import type { IDnDPayload, IDnDStore } from '@vue-dnd-kit/core'
import type { DBProject } from '~/types'

export function createProjectDropHandler(targetList: DBProject[], onDrop: (item: DBProject, index?: number) => void) {
  return {
    data: {
      source: targetList,
    },
    events: {
      onDrop: (store: IDnDStore, payload: IDnDPayload) => {
        const [draggingElement] = payload.items
        const { source: draggingSource, index: draggingIndex } = draggingElement?.data ?? {}

        if (!draggingSource || draggingIndex === undefined) return

        const [moved] = draggingSource.splice(draggingIndex, 1)

        const hoveredElementNode = store.hovered.element.value
        if (hoveredElementNode) {
          const hoveredElement = store.elementsMap.value.get(hoveredElementNode)
          const { index: hoveredIndex } = hoveredElement?.data ?? {}

          // Always notify parent to insert item at specific position
          onDrop(moved, hoveredIndex)
        }
        else {
          // Empty list or no hover target
          onDrop(moved)
        }
      },
    },
  }
}
