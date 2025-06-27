<script setup lang="ts">
import SigninCompleteForm from './SigninCompleteForm.vue'
import UniqueCodeForm from './UniqueCodeForm.vue'

const email = ref('')
const isCodeSent = ref(false)

function onResetForm({ mail, codeSent }: { mail: string, codeSent: boolean }) {
  email.value = mail
  isCodeSent.value = codeSent
}
</script>

<template>
  <SigninCompleteForm
    v-if="isCodeSent"
    :email="email"
    :on-reset-form="onResetForm"
  />
  <UniqueCodeForm
    v-else
    :on-reset-form="onResetForm"
  />
</template>
