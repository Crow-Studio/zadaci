<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import EditProjectForm from '~/components/workspace/projects/EditProjectForm.vue'

const modalStore = useModalStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'editProject' && modalStore?.isOpen
})

const project = computed(() => {
  return modalStore?.data?.project
})

const isUpdateProject = ref(false)

const onSetIsUpdateProject = (payload: boolean) => {
  isUpdateProject.value = payload
}

const onClose = () => {
  if (!isUpdateProject.value) {
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
        <SheetTitle class="flex items-center gap-x-2 text-xl capitalize text-brand dark:text-primary">
          <div class="size-10 p-2 rounded-md bg-muted">
            <Icon
              name="solar:folder-with-files-outline"
              size="25"
            />
          </div>
          Edit project
        </SheetTitle>
        <SheetDescription class="sr-only">
          Project title
        </SheetDescription>
      </SheetHeader>
      <EditProjectForm
        :is-update-project="isUpdateProject"
        :on-set-is-update-project="onSetIsUpdateProject"
        :on-close="onClose"
        :project="project!"
      />
    </SheetContent>
  </Sheet>
</template>
