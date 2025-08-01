<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import TOTPAuthenticatorForm from '~/components/auth/2fa/TOTPAuthenticatorForm.vue'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'

const modalStore = useModalStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'totpAuthentication' && modalStore?.isOpen
})

function onClose() {
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
      <AlertDialogHeader class="flex items-center justify-center">
        <AlertDialogTitle class="text-center">
          Two factor authentication using <br> authenticator app
        </AlertDialogTitle>
        <AlertDialogDescription class="text-center">
          Open <strong class="dark:text-primary">Authenticator app</strong> that you used to set-up <strong class="dark:text-primary">two-factor </strong> authentication. Type the security code provided by the application.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <TOTPAuthenticatorForm :on-close="onClose" />
    </AlertDialogContent>
  </AlertDialog>
</template>
