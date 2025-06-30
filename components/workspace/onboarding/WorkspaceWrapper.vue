<script setup lang="ts">
import { motion } from 'motion-v'
import WorkspaceForm from './WorkspaceForm.vue'

const props = defineProps<{
  onSetCurrentStep: (step: number) => void
}>()
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, x: 30 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ delay: 0.4 }"
    class="animate-content flex w-full flex-col items-center justify-center p-8"
  >
    <div class="mx-auto space-y-1 py-4 text-center">
      <h3 class="text-onboarding-text-100 text-3xl font-bold">
        Create your workspace
      </h3>
      <p class="max-w-sm text-balance font-medium text-muted-foreground">
        To start using Zadaci, you need to create or join a workspace.
      </p>
    </div>
    <WorkspaceForm :on-set-current-step="props.onSetCurrentStep" />
  </motion.div>
</template>
