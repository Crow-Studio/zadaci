<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import CreateWorkspaceForm from '~/components/workspace/forms/CreateWorkspaceForm.vue'

const modalStore = useModalStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'createWorkspace' && modalStore?.isOpen
})

const onClose = () => {
  modalStore?.setIsOpen(false)
  modalStore?.onClose()
}
</script>

<template>
  <AlertDialog
    :open="isModalOpen"
    @update:open="onClose"
  >
    <AlertDialogContent class="dark:bg-[#1d1d1d]">
      <AlertDialogHeader>
        <div class="flex items-center gap-x-2">
          <div class="grid shrink-0 place-items-center self-start mt-1 rounded-full">
            <Icon
              name="hugeicons:grid-view"
              class="text-brand"
              size="25"
            />
          </div>
          <div class="grid gap-0.5 self-start">
            <AlertDialogTitle class="text-brand">
              Create a new Workspace
            </AlertDialogTitle>
            <AlertDialogDescription>
              A workspace is where you and your teammates can collaborate. Give your workspace a name to get started.
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <CreateWorkspaceForm />
    </AlertDialogContent>
  </AlertDialog>
</template>
