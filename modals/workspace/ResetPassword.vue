<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import ResetPasswordForm from '~/components/workspace/forms/ResetPasswordForm.vue'

const modalStore = useModalStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'resetPassword' && modalStore?.isOpen
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
          <div class="grid shrink-0 place-items-center self-start rounded-full">
            <Icon
              name="hugeicons:square-lock-add-01"
              class="size-10 text-brand dark:text-primary"
            />
          </div>
          <div class="grid gap-1">
            <AlertDialogTitle class="text-brand dark:text-primary">
              Choose New Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Almost done. Enter your current and new password and you're all set.
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <ResetPasswordForm />
    </AlertDialogContent>
  </AlertDialog>
</template>
