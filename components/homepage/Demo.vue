<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
  <motion.div
    :animate="{ opacity: 1, y: 0 }"
    :initial="{ opacity: 0, y: 30 }"
    :transition="{ duration: 4, delay: 0.4 }"
    class="max-w-6xl mx-auto p-6"
  >
    <div class="rounded-3xl border-[10px] overflow-clip">
      <video
        autoplay
        loop
        muted
        playsinline
      >
        <source
          src="https://res.cloudinary.com/dfa1yoc1v/video/upload/v1754418297/Untitled_video_-_Made_with_Clipchamp_2_p40mxl.mp4"
          type="video/mp4"
        >
        Your browser does not support the video tag.
      </video>
    </div>
  </motion.div>
</template>
