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
    class="fixed my-0 max-h-80 rounded-2 bg-white overflow-y-auto
  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 rounded-md p-2 transition-transform shadow-surround dark:bg-background"
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
        class="m-0 flex cursor-pointer scroll-mt-1 items-center gap-4 rounded px-2 py-1 transition-colors"
        :class="{ 'bg-accent': item.index === currentIndex }"
        @mouseenter="onMouseenter(item.index)"
        @click="selectItem(item.index)"
      >
        <Icon
          :name="item.icon"
          class="flex-shrink-0"
          size="22"
        />
        <div>
          <div class="text-sm">
            {{ item.label }}
          </div>
          <p class="my-0 text-xs text-muted-foreground">
            {{ item.desc }}
          </p>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style>

</style>
