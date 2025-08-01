<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  handleChange: (e: Event | unknown, shouldValidate?: boolean) => void
  value: string | undefined
}>()

const password = ref('')
const isVisible = ref(false)

watch(password, (val) => {
  if (val) {
    props?.handleChange(val)
  }
}, {
  immediate: true,
})

const toggleVisibility = () => (isVisible.value = !isVisible.value)
</script>

<template>
  <div class="space-y-2">
    <div class="relative">
      <Input
        id="input-51"
        v-model="password"
        class="pe-9"
        placeholder="Password"
        :type="isVisible ? 'text' : 'password'"
        aria-describedby="password-strength"
      />
      <button
        class="absolute inset-y-px end-px flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :aria-pressed="isVisible"
        aria-controls="password"
        @click="toggleVisibility"
      >
        <EyeOff
          v-if="isVisible"
          :size="16"
          :stroke-width="2"
          aria-hidden="true"
        />
        <Eye
          v-else
          :size="16"
          :stroke-width="2"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
