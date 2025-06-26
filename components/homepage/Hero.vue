<template>
  <div
    class="relative overflow-hidden"
  >
    <CustomCursor
      :cursor-x-spring="cursorXSpring"
      :cursor-y-spring="cursorYSpring"
      :is-hovering="isHovering"
    />
    <motion.div
      class="relative z-10"
      :variants="containerVariants"
      initial="hidden"
      animate="visible"
    >
      <div class="max-w-6xl mx-auto p-8">
        <motion.div
          :variants="cardVariants"
          :while-hover="{ scale: 1.02 }"
          :transition="{ duration: 0.3 }"
        >
          <div class="px-6 py-12 text-center">
            <motion.h1
              class="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              :variants="itemVariants"
            >
              Say Hello
              <motion.span
                class="inline-block"
                :animate="{ rotate: [0, 14, -8, 14, -4, 10, 0] }"
                :transition="{ duration: 2, repeat: Infinity, repeatDelay: 3 }"
              >
                👋
              </motion.span>
              to Effortless
              <br>
              Project Management
            </motion.h1>

            <motion.p
              class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              :variants="itemVariants"
            >
              Stay organized and collaborate seamlessly with Zadaci. The all-in-one
              project management platform built to get things done faster.
            </motion.p>

            <motion.div
              class="flex flex-col sm:flex-row gap-4 justify-center items-center"
              :variants="itemVariants"
            >
              <motion.div
                :while-hover="{ scale: 1.05 }"
                :while-tap="{ scale: 0.95 }"
                @mouseenter="setIsHovering(true)"
                @mouseleave="setIsHovering(false)"
              >
                <NuxtLink to="/auth/signup">
                  <Button class="inline-flex gap-x-2 text-base font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2.5 w-full group">
                    Try it for free
                    <div class="size-6 overflow-hidden rounded-full border border-white/10 bg-white/5 duration-500 group-hover:bg-white/10">
                      <div class="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span class="flex size-6">
                          <Icon
                            name="lucide-arrow-right"
                            class="m-auto size-[14px]"
                          />
                        </span>
                        <span class="flex size-6">
                          <Icon
                            name="lucide-arrow-right"
                            class="m-auto size-[14px]"
                          />
                        </span>
                      </div>
                    </div>
                  </Button>
                </NuxtLink>
              </motion.div>

              <motion.div
                :while-hover="{ scale: 1.05 }"
                :while-tap="{ scale: 0.95 }"
                @mouseenter="setIsHovering(true)"
                @mouseleave="setIsHovering(false)"
              >
                <Button
                  variant="ghost"
                >
                  <Icon
                    name="solar:play-circle-outline"
                    size="20"
                  />
                  See how it works
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <!-- Dashboard Preview -->
        </motion.div>
      </div>
    </motion.div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { motion, useMotionValue, useSpring } from 'motion-v'
import { Button } from '../ui/button'
import CustomCursor from '../shared/CustomCursor.vue'

// Reactive data
const mousePosition = ref({ x: 0, y: 0 })
const isHovering = ref(false)

const cursorX = useMotionValue(0)
const cursorY = useMotionValue(0)

const springConfig = { damping: 25, stiffness: 700 }
const cursorXSpring = useSpring(cursorX, springConfig)
const cursorYSpring = useSpring(cursorY, springConfig)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

// Methods
const setIsHovering = (value) => {
  isHovering.value = value
}

const moveCursor = (e) => {
  mousePosition.value = { x: e.clientX, y: e.clientY }
  cursorX.set(e.clientX - 16)
  cursorY.set(e.clientY - 16)
}

// Lifecycle
onMounted(() => {
  window.addEventListener('mousemove', moveCursor)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor)
})
</script>

<style scoped>
* {
  cursor: none !important;
}
</style>
