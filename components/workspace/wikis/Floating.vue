<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue'
import { refDebounced, useElementHover, onClickOutside } from '@vueuse/core'
import type { Placement, Strategy } from '@floating-ui/vue'
import { autoUpdate, flip, offset as offsetMiddleware, useFloating } from '@floating-ui/vue'
import { useZIndex } from '~/composables/zIndex'

const props = withDefaults(defineProps<{
  mode?: 'hover' | 'click'
  placement?: Placement
  strategy?: Strategy
  offset?: number
  disabled?: boolean
  teleport?: boolean
}>(), {
  mode: 'hover',
  placement: 'top',
  strategy: 'fixed',
  offset: 4,
  disabled: false,
  teleport: true,
})
const emit = defineEmits(['open', 'close'])

const { mode, placement, strategy, offset, disabled } = toRefs(props)

const referenceRef = ref<HTMLDivElement>()
const floatingRef = ref<HTMLDivElement>()

const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  placement: placement.value,
  strategy: strategy.value,
  middleware: [flip(), offsetMiddleware(offset.value)],
  whileElementsMounted: autoUpdate,
})

const zIndex = ref(1000)
const { nextZIndex } = useZIndex()

const visible = ref(false)
const visibleDebounced = refDebounced(visible, 100) // Reduced debounce for better responsiveness

function open() {
  if (disabled.value) {
    return
  }

  zIndex.value = nextZIndex()
  visible.value = true
  emit('open')
}

function close() {
  visible.value = false
  emit('close')
}

watch(disabled, (newDisabled) => {
  if (newDisabled) {
    close()
  }
})

// Handle hover mode
if (mode.value === 'hover') {
  const isHover = useElementHover(referenceRef)
  watch(isHover, (isHover) => {
    if (isHover) {
      open()
    }
    else {
      close()
    }
  }, {
    immediate: true,
  })
}

function onClickReference() {
  if (mode.value !== 'click') {
    return
  }

  if (visible.value) {
    close()
  }
  else {
    open()
  }
}

// Handle click outside for click mode
if (mode.value === 'click') {
  onClickOutside(referenceRef, () => {
    if (visible.value) {
      close()
    }
  }, {
    ignore: [floatingRef],
  })
}

defineExpose({
  open,
  close,
  visible: readonly(visible),
})
</script>

<template>
  <div
    ref="referenceRef"
    class="inline-block"
    :class="{ 'cursor-not-allowed': disabled }"
    @click="onClickReference"
  >
    <slot />
    <Teleport
      to="body"
      :disabled="!teleport"
    >
      <Transition
        name="fade"
        enter-active-class="transition-all duration-150 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-show="visibleDebounced"
          ref="floatingRef"
          class="rounded-2 bg-white border border-gray-200 shadow-lg transition-transform dark:bg-gray-800 dark:border-gray-700"
          :style="{ ...floatingStyles, zIndex }"
        >
          <slot name="floating" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
