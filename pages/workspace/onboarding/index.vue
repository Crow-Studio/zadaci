<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
  layout: 'onboarding',
})

useHead({
  titleTemplate: '%s - Onboarding',
})

defineOgImageComponent('UseOdama', {
  title: 'use-odama - Onboarding',
  description:
    'Manage multiple restaurants, build menus, handle online orders, track inventory, and empower your team with use-odama.',
})
</script>

<template>
  <div>
    Workspace Onboarding
  </div>
</template>
