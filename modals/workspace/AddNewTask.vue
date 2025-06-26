<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import AddNewTaskForm from '~/components/workspace/projects/AddNewTaskForm.vue'

const modalStore = useModalStore()
const isModalOpen = computed(() => {
  return modalStore?.type === 'addNewTask' && modalStore?.isOpen
})

const projectId = computed(() => {
  return modalStore?.data?.projectId
})

const isAddNewTask = ref(false)

const onSetIsAddNewTask = (payload: boolean) => {
  isAddNewTask.value = payload
}

const onClose = () => {
  if (!isAddNewTask.value) {
    modalStore?.setIsOpen(false)
    modalStore?.onClose()
    modalStore?.setModalData({})
  }
}
</script>

<template>
  <Sheet
    :open="isModalOpen"
    @update:open="onClose"
  >
    <SheetContent class="dark:bg-[#1d1d1d]">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-x-2 text-xl capitalize">
          <div class="size-10 p-2 rounded-md bg-muted">
            <Icon
              name="hugeicons:task-02"
              size="25"
            />
          </div>
          Add new task
        </SheetTitle>
        <SheetDescription class="sr-only">
          Add new task
        </SheetDescription>
      </SheetHeader>
      <AddNewTaskForm
        :on-set-is-add-new-task="onSetIsAddNewTask"
        :is-add-new-task="isAddNewTask"
        :on-close="onClose"
        :project-id="projectId!"
      />
    </SheetContent>
  </Sheet>
</template>
