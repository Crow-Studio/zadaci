<script setup lang="ts">
import CTA from '~/components/homepage/CTA.vue'
import Demo from '~/components/homepage/Demo.vue'
import Hero from '~/components/homepage/Hero.vue'
import Management from '~/components/homepage/Management.vue'

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
    <Demo />
    <Management />
    <CTA />
  </div>
</template>
