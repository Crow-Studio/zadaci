<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import DeleteWorkspaceForm from '~/components/workspace/forms/DeleteWorkspaceForm.vue'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const isModalOpen = computed(() => {
  return modalStore?.type === 'deleteWorkspace' && modalStore?.isOpen
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
        <div class="flex items-center gap-2">
          <div class="grid shrink-0 place-items-center rounded-full">
            <Icon
              name="hugeicons:grid-view"
              class="text-brand dark:text-primary"
              size="35"
            />
          </div>
          <AlertDialogTitle class="text-brand dark:text-primary">
            Are you sure you want to delete the <span class="capitalize">{{ workspace?.name }}</span> Workspace?
          </AlertDialogTitle>
        </div>
        <AlertDialogDescription>
          Deleting the workspace will remove all it's data permanently and the system won't be able to recovery your data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <DeleteWorkspaceForm />
    </AlertDialogContent>
  </AlertDialog>
</template>
