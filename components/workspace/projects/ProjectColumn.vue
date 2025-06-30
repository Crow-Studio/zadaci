<script setup lang="ts">
import { useDroppable } from '@vue-dnd-kit/core'
import Project from './Project.vue'
import Draggable from '~/components/shared/Draggable.vue'
import { Button } from '~/components/ui/button'
import type { DBProject, IProjectColumn } from '~/types'
import { createProjectDropHandler } from '~/lib/projects'

const props = defineProps<{
  column: IProjectColumn
  data: DBProject[]
  onDrop: (item: DBProject, index?: number) => void
}>()

const modalStore = useModalStore()

const { elementRef: columnRef, isOvered, isAllowed, isLazyAllowed } = useDroppable(createProjectDropHandler(props.data, props.onDrop))

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}

const onEditProject = (project: DBProject) => {
  modalStore?.onOpen('editProject')
  modalStore?.setIsOpen(true)
  modalStore?.setModalData({
    project,
  })
}
</script>

<template>
  <div
    ref="columnRef"
    class="bg-muted rounded-md w-[350px] flex-shrink-0 self-start grid gap-1"
  >
    <div class="px-3 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <Icon :name="props.column.icon" />
          <p>
            {{ props.column.name }}
          </p>
        </div>
        <Icon name="uis:ellipsis-v" />
      </div>
      <p class="text-xs italic text-muted-foreground">
        {{ props.column.description }}
      </p>
    </div>
    <ScrollArea
      class="max-h-[610px] overflow-y-auto px-3"
    >
      <div
        v-for="(project, index) in props.data"
        :key="project.id"
        class="my-2"
        @click.stop.prevent="onEditProject(project)"
      >
        <Draggable
          :index="index"
          :source="props.data"
        >
          <Project :project="project" />
        </Draggable>
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
        @click="onAddNewProject"
      >
        <Icon
          name="hugeicons:plus-sign"
          class="size-4"
        />
        Add Project
      </Button>
    </div>
  </div>
</template>
