<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { motion } from 'motion-v'

const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully')
    })

    videoRef.value.addEventListener('canplay', () => {
      console.log('Video is ready to play')
    })
  }
})
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
        ref="videoRef"
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
