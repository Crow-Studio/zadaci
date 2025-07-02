import type { IDnDPayload, IDnDStore } from '@vue-dnd-kit/core'
import { toast } from 'vue-sonner'
import type { Status, Task } from '~/types'

export function createMyTaskDropHandler(targetList: Task[], onDrop: (item: Task, index?: number) => void, columnId: string) {
  return {
    data: {
      source: targetList,
      columnId,
    },
    events: {
      onDrop: (store: IDnDStore, payload: IDnDPayload) => {
        const [draggingElement] = payload.items
        const dragData = draggingElement?.data

        if (!dragData || typeof dragData.index !== 'number' || !dragData.source) {
          return
        }

        const { source: draggingSource, index: draggingIndex } = dragData

        // Get the actual task object
        const taskToMove = draggingSource[draggingIndex]

        if (!taskToMove) {
          return
        }

        // Only remove from source if it's a different column
        if (draggingSource !== targetList) {
          draggingSource.splice(draggingIndex, 1)
        }
        else {
          // For reordering within the same column, we need to be more careful
          draggingSource.splice(draggingIndex, 1)
        }

        // Try to determine drop position
        let dropIndex = targetList.length // Default to end

        // Check if we're hovering over a specific element
        const hoveredElement = store.hovered.element.value
        if (
          hoveredElement
          && (hoveredElement as HTMLElement).dataset
          && (hoveredElement as HTMLElement).dataset.index
        ) {
          const hoveredIndex = parseInt((hoveredElement as HTMLElement).dataset.index ?? '')
          if (!isNaN(hoveredIndex)) {
            dropIndex = hoveredIndex
          }
        }

        onDrop(taskToMove, dropIndex)
      },
    },
  }
}

export function mapMyTasksByStatus(data: any[], tasks: globalThis.Ref<Record<string, Task[]>, Record<string, Task[]>>) {
  const grouped = Object.fromEntries(Object.keys(tasks.value).map(k => [k, [] as Task[]]))

  for (const task of data) {
    const key = task.status.toUpperCase()
    if (grouped[key]) {
      grouped[key].push({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        subtasks: (task.subtasks || []).map((subtask: any) => ({
          ...subtask,
          taskId: task.id,
          createdAt: new Date(subtask.createdAt),
          updatedAt: new Date(subtask.updatedAt),
        })),
      } as Task)
    }
  }

  // sort each column by updatedAt descending
  Object.keys(grouped).forEach((key) => {
    (grouped[key] ?? []).sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0
      const aDate = typeof a.updatedAt === 'string' ? new Date(a.updatedAt) : a.updatedAt
      const bDate = typeof b.updatedAt === 'string' ? new Date(b.updatedAt) : b.updatedAt
      return bDate.getTime() - aDate.getTime()
    })
  })

  tasks.value = grouped
}

export async function myTaskHandleDrop(columnKey: Status, task: Task, tasks: globalThis.Ref<Record<string, Task[]>, Record<string, Task[]>>, index?: number) {
  const targetList = tasks.value[columnKey]
  if (!targetList) {
    return
  }

  // Check if task already exists in target column
  const existingIndex = targetList.findIndex(p => p.id === task.id)
  if (existingIndex !== -1) {
    // Remove from current position
    targetList.splice(existingIndex, 1)
  }
  else {
    // Remove from all other columns first
    Object.keys(tasks.value).forEach((key) => {
      if (key !== columnKey && tasks.value[key]) {
        const oldIndex = tasks.value[key]!.findIndex(p => p.id === task.id)
        if (oldIndex !== -1) {
          tasks.value[key]!.splice(oldIndex, 1)
        }
      }
    })
  }

  // Update task status
  const updatedTask = { ...task, status: columnKey }

  // Insert at specified index or append to end
  if (typeof index === 'number' && index >= 0) {
    targetList.splice(Math.min(index, targetList.length), 0, updatedTask)
  }
  else {
    targetList.push(updatedTask)
  }
  try {
    await $fetch(`/api/workspace/project/${task.projectId}/task/${task.id}`, {
      method: 'PATCH',
      body: { status: columnKey },
    })

    await refreshNuxtData([`board_view_project_tasks_${task.projectId}`, `all_project_task_stats_${task.projectId}`, 'all_project_task_stats'])
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
}
