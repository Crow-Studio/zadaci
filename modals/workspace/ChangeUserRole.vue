<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import ChangeTeammateRoleForm from '~/components/workspace/forms/ChangeTeammateRoleForm.vue'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const isModalOpen = computed(() => {
  return modalStore?.type === 'changeTeammateRole' && modalStore?.isOpen
})

const teammates = computed(() => {
  return modalStore?.data.teammates ? modalStore.data.teammates : []
})

const onClose = () => {
  modalStore?.onClose()
  modalStore?.setIsOpen(false)
  modalStore?.setModalData({})
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
          <div class="grid shrink-0 place-items-center self-start rounded-full">
            <Icon
              name="solar:mailbox-outline"
              class="size-10 text-brand dark:text-primary"
            />
          </div>
          <div class="grid gap-1">
            <AlertDialogTitle class="text-brand dark:text-primary">
              Update {{ teammates.length > 1 ? 'teammates' : 'teammate' }} {{ teammates.length > 1 ? 'roles' : 'role' }}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Update the team {{ teammates.length > 1 ? 'members' : 'member' }} {{ teammates.length > 1 ? 'roles' : 'role' }} in
              <strong class="capitalize">
                {{ workspace?.name }} Workspace
              </strong> by selecting the new {{ teammates.length > 1 ? 'teammates' : 'teammate' }} {{ teammates.length > 1 ? 'roles' : 'role' }} in the dropdown
              .
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <ChangeTeammateRoleForm
        :on-close="onClose"
        :workspace-id="workspace?.id!"
        :teammates="teammates"
      />
    </AlertDialogContent>
  </AlertDialog>
</template>
