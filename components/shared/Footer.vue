<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
  <motion.footer
    :animate="{ opacity: 1, y: 0 }"
    :initial="{ opacity: 0, y: 30 }"
    :transition="{ delay: 0.6, ease: 'easeIn' }"
    class="container mx-auto flex flex-col items-center gap-y-3 px-6 py-5"
  >
    <p class="">
      © {{ new Date().getFullYear() }} Crow Studios. All rights reserved.
    </p>
    <nav class="flex items-center md:gap-x-8">
      <NuxtLink
        to="/privacy-policy"
        class="gap-1 font-normal shrink-0 rounded-full ring-[--control] focus-visible:ring-2 outline-hidden outline-0 px-2 tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
        target="_self"
      >
        Privacy Policy
      </NuxtLink>
      <NuxtLink
        to="/terms-of-service"
        class="gap-1 font-normal shrink-0 rounded-full ring-[--control] focus-visible:ring-2 outline-hidden outline-0 px-2 tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
        target="_self"
      >
        Terms of service
      </NuxtLink>
    </nav>
  </motion.footer>
</template>
