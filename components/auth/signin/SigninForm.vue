<script setup lang="ts">
import SigninCompleteForm from './SigninCompleteForm.vue'
import UniqueCodeForm from './UniqueCodeForm.vue'

const email = ref('')
const isCodeSent = ref(false)
const lastUsedMethod = ref<'email' | 'google' | 'github' | null>(null)

function onResetForm({ mail, codeSent }: { mail: string, codeSent: boolean }) {
  email.value = mail
  isCodeSent.value = codeSent
  lastUsedMethod.value = 'email'
  localStorage.setItem('lastUsedMethod', 'email')
}

onMounted(() => {
  const stored = localStorage.getItem('lastUsedMethod')
  if (stored) lastUsedMethod.value = stored as any
})
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
