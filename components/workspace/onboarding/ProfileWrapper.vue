<script setup lang="ts">
import { motion } from 'motion-v'
import ProfileForm from './ProfileForm.vue'

const props = defineProps<{
  onSetCurrentStep: (step: number) => void
}>()
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
    class="animate-content flex w-full flex-col items-center justify-center p-8"
  >
    <div class="mx-auto space-y-1 py-4 text-center">
      <h3 class="text-onboarding-text-100 text-3xl font-bold">
        Welcome to <span class="font-bebas-neue text-[2rem]">Zadaci</span>!
      </h3>
      <p class="max-w-sm text-balance font-medium text-muted-foreground">
        Let’s setup your profile, tell us a bit about yourself.
      </p>
    </div>
    <ProfileForm :on-set-current-step="props.onSetCurrentStep" />
  </motion.div>
</template>
