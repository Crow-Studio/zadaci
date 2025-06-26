<script setup lang="ts">
import AddNewProjectForm from '~/components/workspace/projects/AddNewProjectForm.vue'

const modalStore = useModalStore()

const isAddNewProject = ref(false)

const isModalOpen = computed(() => {
  return modalStore?.type === 'addNewProject' && modalStore?.isOpen
})

const onSetIsAddNewProject = (payload: boolean) => {
  isAddNewProject.value = payload
}

const onClose = () => {
  if (!isAddNewProject.value) {
    modalStore?.setIsOpen(false)
    modalStore?.onClose()
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
        <SheetTitle class="flex items-center gap-x-2 text-xl capitalize text-brand dark:text-primary">
          <div class="size-10 p-2 rounded-md bg-muted">
            <Icon
              name="solar:folder-with-files-outline"
              size="25"
            />
          </div>
          Add new project
        </SheetTitle>
        <SheetDescription class="sr-only">
          Add new project
        </SheetDescription>
      </SheetHeader>
      <AddNewProjectForm
        :on-close="onClose"
        :is-add-new-project="isAddNewProject"
        :on-set-is-add-new-project="onSetIsAddNewProject"
      />
    </SheetContent>
  </Sheet>
</template>
