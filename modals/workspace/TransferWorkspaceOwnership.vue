<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import TransferOwnership from '~/components/workspace/settings/general/TransferOwnership.vue'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const isModalOpen = computed(() => {
  return modalStore?.type === 'transferOwnership' && modalStore?.isOpen
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
              name="hugeicons:square-arrow-data-transfer-horizontal"
              class="text-brand dark:text-primary"
              size="35"
            />
          </div>
          <AlertDialogTitle class="text-brand dark:text-primary">
            Are you sure you want to transfer the <span class="capitalize">{{ workspace?.name }}</span> Workspace ownership?
          </AlertDialogTitle>
        </div>
        <AlertDialogDescription>
          Transferring the workspace ownership will remove all your ownership access from <span>{{ workspace?.name }}</span> workspace.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <TransferOwnership />
    </AlertDialogContent>
  </AlertDialog>
</template>
