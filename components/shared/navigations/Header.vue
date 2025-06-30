<script setup lang="ts">
import { motion } from 'motion-v'
import Zadaci from '~/components/svgs/Zadaci.vue'
</script>

<template>
  <motion.header
    :initial="{
      opacity: 0, y: -10,
    }"
    :animate="{
      opacity: 1,
      y: 0,
    }"
    :transition="{
      duration: 0.5, ease: 'easeIn',
    }"
    class="px-2 sticky top-0 right-0 left-0 backdrop-blur z-30 md:px-5 xl:px-10 py-3 flex items-center justify-between"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2"
    >
      <Zadaci class="w-9 h-auto" />
      <h1 class="text-[2rem] mt-1 font-semibold font-bebas-neue">
        Zadaci
      </h1>
    </NuxtLink>
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
  </motion.header>
</template>
