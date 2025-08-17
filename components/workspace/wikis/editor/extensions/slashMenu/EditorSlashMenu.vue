<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import { KEYBOARD_EVENT_KEYS } from '../../utils/constants'
import type { SlashMenuCommand, SlashMenuItem } from './index'
import { SLASH_MENU_ITEM_GROUP } from './index'

const props = defineProps<SuggestionProps<SlashMenuItem, { items: SlashMenuItem[], command: SlashMenuCommand }> & {
  destroy: () => void
}>()

interface ItemsGroup {
  label: string
  items: Array<SlashMenuItem & {
    index: number
  }>
}
const itemsGroups = computed(() => {
  let index = 0

  return props.items.reduce((groups, item) => {
    const groupName = SLASH_MENU_ITEM_GROUP[item.group]

    let group = (groups as ItemsGroup[]).find(item => item.label === groupName)
    if (!group) {
      group = {
        label: groupName,
        items: [{ ...item, index }],
      } as ItemsGroup
      (groups as ItemsGroup[]).push(group)
    }
    else {
      group.items.push({ ...item, index })
    }
    index++

    return groups
  }, []) as ItemsGroup[]
})

const menuRef = ref<HTMLDListElement>()
const currentIndex = ref(0)
function selectItem(index: number) {
  const items = itemsGroups.value.reduce<ItemsGroup['items']>((pre, cur) => {
    (pre as ItemsGroup['items']).push(...cur.items)

    return pre
  }, [])
  const item = items.find(_item => _item.index === index)
  item?.command(props.editor, props.range)
}
function scroll(index: number) {
  menuRef.value?.querySelector(`#${CSS.escape(index.toString())}`)?.scrollIntoView({
    behavior: 'smooth',
  })
}
function onKeyDown({ event }: SuggestionKeyDownProps) {
  switch (event.key) {
    case KEYBOARD_EVENT_KEYS.ARROW_UP: {
      menuRef.value!.blur()
      currentIndex.value = (currentIndex.value + props.items.length - 1) % props.items.length
      scroll(currentIndex.value)
      return true
    }
    case KEYBOARD_EVENT_KEYS.ARROW_DOWN: {
      menuRef.value!.blur()
      currentIndex.value = (currentIndex.value + 1) % props.items.length
      scroll(currentIndex.value)
      return true
    }
    case KEYBOARD_EVENT_KEYS.ENTER: {
      selectItem(currentIndex.value)
      return true
    }
    default: {
      return false
    }
  }
}
function onMouseenter(index: number) {
  currentIndex.value = index
}

onClickOutside(menuRef, () => {
  props.destroy()
}, {
  ignore: [props.editor.view.dom],
})

defineExpose({
  onKeyDown,
})
</script>

<template>
  <dl
    ref="menuRef"
    class="fixed my-0 max-h-80 overflow-auto rounded-2 bg-gray-100 p-2 transition-transform shadow-surround dark:bg-gray-900 dark:shadow-stone-700"
  >
    <div
      v-for="group in itemsGroups"
      :key="group.label"
      class="mb-4 last:mb-0"
    >
      <dt class="mb-1 pl-2 text-xs">
        {{ group.label }}
      </dt>
      <dd
        v-for="item in group.items"
        :id="item.index.toString()"
        :key="item.label"
        class="m-0 flex cursor-pointer scroll-mt-1 items-center gap-4 rounded-1 px-2 py-1 transition-colors"
        :class="{ 'bg-zinc-300 dark:bg-zinc-700': item.index === currentIndex }"
        @mouseenter="onMouseenter(item.index)"
        @click="selectItem(item.index)"
      >
        <div class="rounded-1 p-1 text-xl shadow">
          <div :class="item.icon" />
        </div>
        <div>
          <div class="text-sm">
            {{ item.label }}
          </div>
          <p class="my-0 text-xs text-neutral-600 dark:text-neutral-400">
            {{ item.desc }}
          </p>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style>

</style>
