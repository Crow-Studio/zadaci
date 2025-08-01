<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import Signout from '~/modals/global/Signout.vue'
import UseAuthenticatorApp from '~/modals/workspace/UseAuthenticatorApp.vue'

useHead({
  meta: [
    { property: 'og:title', content: `Zadaci` },
    {
      name: 'description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    {
      property: 'og:description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    { property: 'og:url', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
    { name: 'twitter:title', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
    {
      name: 'twitter:description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    { name: 'twitter:site', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
  ],
  title: `Zadaci`,
})
</script>

<template>
  <main class="min-h-screen relative max-w-8xl overflow-hidden mx-auto flex flex-col">
    <NuxtLoadingIndicator />
    <Toaster
      :close-button="true"
      rich-colors
    />
    <div class="flex-1">
      <slot />
    </div>
    <Signout />
    <UseAuthenticatorApp />
  </main>
</template>
