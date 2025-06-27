<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const colorMode = useColorMode()
const checked = ref(false)

const updateCheckedState = (mode: string) => {
  checked.value = mode === 'light'
}

watch(() => colorMode.value, (newVal) => {
  updateCheckedState(newVal)
}, {
  immediate: true,
})

onMounted(() => {
  updateCheckedState(colorMode.value)
})
</script>

<template>
  <div>
    <div class="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
      <Switch
        id="switch-12"
        v-model="checked"
        class="peer absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        @update:model-value="(payload) => {
          colorMode.preference = payload ? 'light' : 'dark'
        }"
      />
      <span
        class="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70 text-black"
      >
        <Moon
          :size="14"
          stroke-width="2"
          aria-hidden="true"
        />
      </span>
      <span
        class="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70"
      >
        <Sun
          :size="14"
          stroke-width="2"
          aria-hidden="true"
        />
      </span>
    </div>
    <Label
      for="switch-12"
      class="sr-only"
    >
      Theme Switch
    </Label>
  </div>
</template>
