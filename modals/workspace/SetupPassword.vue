<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import SetupPasswordForm from '~/components/workspace/forms/SetupPasswordForm.vue'

const modalStore = useModalStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'setupPassword' && modalStore?.isOpen
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
              class="text-brand dark:text-primary"
              size="45"
            />
          </div>
          <div class="grid">
            <AlertDialogTitle class="text-brand dark:text-primary">
              Setup Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Almost done. Enter a password and you're all set.
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <SetupPasswordForm />
    </AlertDialogContent>
  </AlertDialog>
</template>
