<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import DeleteAccountForm from '~/components/workspace/forms/DeleteAccountForm.vue'

const modalStore = useModalStore()
const { user } = useUserSession()

const isModalOpen = computed(() => {
  return modalStore?.type === 'deleteAccount' && modalStore?.isOpen
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
              name="hugeicons:information-circle"
              class="text-brand dark:text-primary"
              size="40"
            />
          </div>
          <AlertDialogTitle class="text-brand dark:text-primary">
            <span>{{ user?.username }}</span>, are you absolutely sure you want to delete your account?
          </AlertDialogTitle>
        </div>
        <AlertDialogDescription>
          Deleting an account will remove all your data permanently and the system won't be able to recovery your data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <DeleteAccountForm />
    </AlertDialogContent>
  </AlertDialog>
</template>
