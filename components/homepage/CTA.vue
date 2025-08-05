<script setup lang="ts">
import { motion } from 'motion-v'
import { Button } from '../ui/button'
</script>

<template>
  <motion.section
    :animate="{ opacity: 1, y: 0 }"
    :initial="{ opacity: 0, y: 30 }"
    :transition="{ delay: 0.6, ease: 'easeIn' }"
    class="py-14 flex flex-col items-center gap-10 relative container mx-auto px-6"
  >
    <article class="relative flex flex-col items-center justify-center gap-9 self-stretch overflow-hidden rounded-xl border border-[--border] bg-[--surface-secondary] p-6 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
      <div class="relative z-20 flex flex-col items-center gap-2 text-center">
        <h4 class="text-center text-3xl font-medium tracking-tighter text-[--text-primary] dark:text-[--dark-text-primary] sm:max-w-full sm:px-0 md:text-4xl">
          Enhance your team's productivity with Zadaci
        </h4>
        <p class="text-lg text-muted-foreground max-w-3xl">
          Empower you or your team with integrated tools for file project/task management, and team collaboration, ensuring smooth project workflows from start to finish.
        </p>
      </div>
      <NuxtLink to="/auth/signup">
        <Button class="inline-flex text-sm font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2 w-full group hover:translate-y-0.5 duration-300 ease-in-out cursor-pointer">
          Get started
          <Icon
            name="lucide-arrow-right"
            class="-rotate-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            size="15"
          />
        </Button>
      </NuxtLink>
    </article>
  </motion.section>
</template>
