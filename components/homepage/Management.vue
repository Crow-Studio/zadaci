<script setup lang="ts">
import { motion } from 'motion-v'

const agileFeatures = [
  {
    title: '🛫 Sprint Planning',
    info: 'Plan and break down work into sprints. Stay focused on what matters each cycle.',
  },
  {
    title: '📊 Kanban Views',
    info: 'Visualize workflow with intuitive board layouts. Move tasks seamlessly through stages.',
  },
  {
    title: '🎯 Task Prioritization',
    info: 'Drag and drop tasks between statuses to visualize team progress in real time.',
  },
  {
    title: '🤝 Team Collaboration',
    info: 'Assign tasks, leave comments, and work together seamlessly across workspaces.',
  },
  {
    title: '📥 Backlog Organization',
    info: 'Keep ideas and future tasks in a structured backlog, ready for your next sprint.',
  },
  {
    title: '📈 Progress Tracking',
    info: 'Track task completion and monitor velocity across your team with ease.',
  },
]
</script>

<template>
  <motion.section
    :animate="{ opacity: 1, y: 0 }"
    :initial="{ opacity: 0, y: 30 }"
    :transition="{ delay: 0.6, ease: 'easeIn' }"
    class="px-6 py-16 text-center max-w-6xl mx-auto"
  >
    <span class="text-sm text-zinc-500 uppercase tracking-wide">Zadaci is Agile</span>
    <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">
      Agile Project Management, Simplified
    </h2>
    <p class="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
      Built for small, fast-moving teams. Zadaci makes agile workflows easy with the tools you need to plan sprints, manage tasks, and deliver projects on time—without the complexity of traditional PM software.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
      <motion.div
        v-for="(agile, index) in agileFeatures"
        :key="index"
        :animate="{ opacity: 1, y: 0 }"
        :initial="{ opacity: 0, y: 30 }"
        :transition="{ delay: 0.4 * index, ease: 'easeIn', duration: 0.6 }"
        class="bg-[#fafafa] dark:bg-[#1d1d1d] rounded-2xl p-6 shadow"
      >
        <h3 class="text-xl font-semibold mb-2">
          {{ agile.title }}
        </h3>
        <p class="text-zinc-600 dark:text-zinc-300">
          {{ agile.info }}
        </p>
      </motion.div>
    </div>
  </motion.section>
</template>
