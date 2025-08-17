<script lang="ts" setup>
import type Floating from './Floating.vue'

export interface DropdownOption {
  label: string
  icon?: string
  command: () => void
}

withDefaults(defineProps<{
  options: DropdownOption[]
  teleport?: boolean
}>(), {
  teleport: true,
})

const floating = ref<InstanceType<typeof Floating>>()
function onCommand(command: DropdownOption['command']) {
  command()
  floating.value?.close()
}
</script>

<template>
  <Floating
    ref="floating"
    mode="click"
    placement="bottom-start"
    :teleport="teleport"
  >
    <slot />
    <template #floating>
      <ul class="my-0 max-h-100 list-none overflow-auto pl-0">
        <li
          v-for="item in options"
          :key="item.label"
          class="flex cursor-pointer items-center gap-1 rounded-2 px-2 py-1 transition-colors hover:bg-zinc-300"
          @click="onCommand(item.command)"
        >
          <div>
            <div :class="item.icon" />
          </div>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </template>
  </Floating>
</template>
