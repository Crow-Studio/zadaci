<script lang="ts" setup>
import type { Placement, Strategy } from '@floating-ui/vue'
import { autoUpdate, flip, offset as offsetMiddleware, useFloating } from '@floating-ui/vue'
import { useZIndex } from '~/composables/zIndex'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  placement?: Placement
  strategy?: Strategy
  offset?: number
  disabled?: boolean
}>(), {
  modelValue: false,
  placement: 'top-end',
  strategy: 'fixed',
  offset: 4,
  disabled: false,
})
const emit = defineEmits(['update:modelValue', 'open', 'close'])

const { placement, strategy, offset, disabled } = toRefs(props)

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
  if (disabled.value || visible.value) {
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

const isReferenceHover = useElementHover(referenceRef)
const isFloatingRefHover = useElementHover(floatingRef)
const isHover = computed(() => isReferenceHover.value || isFloatingRefHover.value)
watchDebounced(isHover, (isHover) => {
  if (isHover) {
    open()
  }
  else {
    close()
  }
}, {
  immediate: true,
  debounce: 100,
})

onClickOutside(referenceRef, () => {
  close()
}, {
  ignore: [floatingRef],
})

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
  >
    <slot />
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-show="modelValue || visibleDebounced"
          ref="floatingRef"
          class="border border-stone-300 rounded-2 border-solid bg-gray-100 p-2 transition-transform shadow-surround-sm dark:border-stone-700 dark:bg-gray-900"
          :style="{ ...floatingStyles, zIndex }"
        >
          <slot name="floating" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
