<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

useHead({
  meta: [
    { property: 'og:title', content: `Zadaci` },
    {
      name: 'description',
      content: 'Say Hello 👋 to Effortless Project Management',
    },
    {
      property: 'og:description',
      content: 'Say Hello 👋 to Effortless Project Management',
    },
    { property: 'og:url', content: 'Say Hello 👋 to Effortless Project Management' },
    { name: 'twitter:title', content: 'Say Hello 👋 to Effortless Project Management' },
    {
      name: 'twitter:description',
      content: 'Say Hello 👋 to Effortless Project Management',
    },
    { name: 'twitter:site', content: 'Say Hello 👋 to Effortless Project Management' },
  ],
  title: `Zadaci`,
})
</script>

<template>
  <main class="min-h-screen relative max-w-8xl overflow-hidden mx-auto flex flex-col">
    <Toaster
      :close-button="true"
      rich-colors
    />
    <div class="flex-1">
      <slot />
    </div>
  </main>
</template>
