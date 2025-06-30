<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import User from './User.vue'
import ProfileWrapper from './ProfileWrapper.vue'
import WorkspaceWrapper from './WorkspaceWrapper.vue'
import TeammatesWrapper from './TeammatesWrapper.vue'
import type { Workspace } from '~/types'

const props = defineProps<{
  workspace: Workspace | null
  username: string | null
}>()

const currentStep = useState<number>('current_step', () => 1)

const onSetCurrentStep = (step: number) => {
  currentStep.value = Math.min(Math.max(step, 1), 3)
}

const progressWidth = computed(() => {
  const width = (currentStep.value / 3) * 100
  return `${Math.min(width, 100)}%`
})

onBeforeMount(() => {
  if (!props.username) {
    currentStep.value = 1
  }
  else if (props.username && props.workspace && !props.workspace.id) {
    currentStep.value = 2
  }
})
</script>

<template>
  <ClientOnly>
    <div class="relative flex h-screen w-full flex-col overflow-hidden">
      <div class="absolute inset-0 z-0 dark:hidden">
        <SvgsSvgBackgroundPattern class="size-full" />
      </div>
      <div class="relative size-full overflow-hidden">
        <div class="flex size-full flex-col">
          <div class="flex size-full">
            <div class="size-full overflow-auto px-6 py-8 sm:px-7 md:px-14 lg:px-28">
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                class="flex items-center justify-between"
              >
                <div class="flex w-full items-center justify-between font-semibold">
                  <div class="flex items-center gap-x-2">
                    <SvgsZadaci class="mr-3 size-10" />
                    <div class="flex flex-col justify-center">
                      <div class="text-sm font-medium">
                        {{ currentStep }} of 3 steps
                      </div>
                      <div class="mx-1 my-0.5 flex w-40 items-center justify-center lg:w-52">
                        <div class="relative h-1.5 w-full rounded-full bg-purple-100">
                          <div
                            class="absolute left-0 h-1.5 rounded-full bg-brand"
                            :style="{ width: progressWidth }"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="shrink-0">
                  <User />
                </div>
              </motion.div>
              <ProfileWrapper
                v-if="currentStep ===1"
                :on-set-current-step="onSetCurrentStep"
              />
              <WorkspaceWrapper
                v-if="currentStep ===2"
                :on-set-current-step="onSetCurrentStep"
              />
              <TeammatesWrapper
                v-if="currentStep ===3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
