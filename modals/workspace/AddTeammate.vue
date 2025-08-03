<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import InviteMemberForm from '~/components/workspace/forms/InviteMemberForm.vue'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const isModalOpen = computed(() => {
  return modalStore?.type === 'inviteTeammate' && modalStore?.isOpen
})

const onClose = () => {
  modalStore?.onClose()
  modalStore?.setIsOpen(false)
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
              name="hugeicons:user-add-01"
              class="size-10 text-brand dark:text-primary"
              size="45"
            />
          </div>
          <div class="grid">
            <AlertDialogTitle class="text-brand dark:text-primary">
              Add new team member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add new team members by inviting them to collaborate with you on the
              <strong class="capitalize">
                {{ workspace?.name }} Workspace
              </strong>
              .
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <InviteMemberForm
        :on-close="onClose"
        :workspace-id="workspace?.id!"
      />
    </AlertDialogContent>
  </AlertDialog>
</template>
