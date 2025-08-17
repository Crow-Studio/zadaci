<script lang="ts" setup>
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

const zIndex = ref(100)
const { nextZIndex } = useZIndex()

const visible = ref(false)
const visibleDebounced = refDebounced(visible, 300)
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
watch(disabled, (disabled) => {
  if (disabled) {
    close()
  }
})

const isHover = useElementHover(referenceRef)
if (mode.value === 'hover') {
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
if (mode.value === 'click') {
  onClickOutside(referenceRef, () => {
    close()
  }, {
    ignore: [floatingRef],
  })
}

defineExpose({
  open,
  close,
  visible,
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
      <Transition name="fade">
        <div
          v-show="visibleDebounced"
          ref="floatingRef"
          class="rounded-2 bg-gray-100 p-2 transition-transform shadow-surround dark:bg-gray-900 dark:shadow-stone-700"
          :style="{ ...floatingStyles, zIndex }"
        >
          <slot name="floating" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
