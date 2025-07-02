<script setup lang="ts">
import { useDroppable } from '@vue-dnd-kit/core'
import MyTaskDraggable from './MyTaskDraggable.vue'
import MyTask from './MyTask.vue'
import { Button } from '~/components/ui/button'
import type { IProjectColumn, Task as ITask } from '~/types'
import { createTaskDropHandler } from '~/lib/tasks'
import { ScrollArea } from '~/components/ui/scroll-area'

const props = defineProps<{
  column: IProjectColumn
  data: ITask[]
  onDrop: (item: ITask, index?: number) => void
}>()

const modalStore = useModalStore()
// const workspaceStore = useWorkspaceStore()

const { elementRef: myTaskColumnRef, isOvered, isAllowed, isLazyAllowed } = useDroppable(
  createTaskDropHandler(props.data, props.onDrop, props.column.name),
)

const onAddNewTask = () => {
  modalStore?.onOpen('addNewTask')
  modalStore?.setIsOpen(true)
}

const onEditTask = (task: ITask) => {
  modalStore?.onOpen('editProjectTask')
  modalStore?.setIsOpen(true)
  console.log(task)
}
</script>

<template>
  <div
    ref="myTaskColumnRef"
    class="bg-muted rounded-md w-[350px] flex-shrink-0 self-start grid gap-1"
  >
    <div class="px-3 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <Icon :name="props.column.icon" />
          <p>
            {{ props.column.name }} {{ props.data.length ? `(${props.data.length})` : '' }}
          </p>
        </div>
      </div>
      <p class="text-xs italic text-muted-foreground">
        {{ props.column.description }}
      </p>
    </div>
    <ScrollArea
      class="max-h-[610px] overflow-y-auto px-3"
    >
      <div
        v-for="(task, index) in props.data"
        :key="`${task.id}-${index}`"
        class="my-2"
        @click.stop.prevent="onEditTask(task)"
      >
        <MyTaskDraggable
          :index="index"
          :source="props.data"
          :task="task"
        >
          <MyTask :task="task" />
        </MyTaskDraggable>
      </div>
      <div
        v-if="isOvered && isAllowed && isLazyAllowed && props.data.length <= 0"
        class="text-sm font-medium bg-background/50 my-2 p-9 rounded-md"
      />
    </ScrollArea>
    <div class="px-3 pb-2">
      <Button
        class="w-full gap-2 cursor-pointer dark:hover:bg-[#343434]"
        size="sm"
        variant="outline"
        @click="onAddNewTask"
      >
        <Icon
          name="hugeicons:plus-sign"
          class="size-4"
        />
        Add Task
      </Button>
    </div>
  </div>
</template>
