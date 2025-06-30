<script setup lang="ts">
import Header from '~/components/shared/navigations/Header.vue'

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
    <Header />
    <div class="flex-1">
      <slot />
    </div>
  </main>
</template>
