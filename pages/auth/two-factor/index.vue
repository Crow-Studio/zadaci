<script setup lang="ts">
import MFAWrapper from '~/components/auth/2fa/MFAWrapper.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['authenticated'],
})

defineOgImageComponent('Zadaci', {
  title: 'Two Factor Verificatin',
  description: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
})
</script>

<template>
  <section class="grid min-h-screen place-content-center">
    <MFAWrapper />
  </section>
</template>
