<script setup lang="ts">
import Hero from '~/components/homepage/Hero.vue'

const { loggedIn } = useUserSession()

watch(() => loggedIn.value, (loggedIn) => {
  if (loggedIn) {
    navigateTo('/workspace/onboarding')
  }
}, {
  immediate: true,
})
</script>

<template>
  <div>
    <Hero />
  </div>
</template>
