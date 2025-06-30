<script setup lang="ts">
import { motion } from 'motion-v'
import TeammatesForm from './TeammatesForm.vue'
</script>

<template>
  <motion.div
    :initial="{
      opacity: 0,
      x: 30,
    }"
    :animate="{
      opacity: 1,
      x: 0,
    }"
    :transition="{
      delay: 0.4,
    }"
    class="animate-content flex w-full flex-col items-center justify-center p-8 md:gap-5"
  >
    <div class="mx-auto space-y-1 py-4 text-center">
      <h3 class="text-onboarding-text-100 text-3xl font-bold">
        Invite your teammates
      </h3>
      <p class="max-w-lg text-balance font-medium text-muted-foreground">
        Work in <span class="font-bebas-neue text-xl text-brand">Zadaci</span> happens best with your team. Invite them now to use <span class="font-bebas-neue text-xl text-brand">Zadaci</span> to its potential.
      </p>
    </div>
    <TeammatesForm />
  </motion.div>
</template>
