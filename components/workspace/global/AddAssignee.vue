<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import type { AcceptableValue, ListboxItemSelectEvent } from 'reka-ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import type { ProjectMembers } from '~/types'

const props = defineProps<{
  assignees: ProjectMembers[]
  onAddAssiginees: (payload: ProjectMembers) => void
  onRemoveAssignee: (payload: ProjectMembers) => void
}>()

const workspaceStore = useWorkspaceStore()

const activeWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const open = ref(false)

const { data } = await useAsyncData(() => useRequestFetch()(`/api/workspace/${activeWorkspace.value?.id}/teammates/all`), {
  watch: [() => activeWorkspace.value?.id || ''],
  transform(input) {
    return {
      teammates: input,
      fetchedAt: new Date(),
    }
  },
  getCachedData(key, nuxtApp) {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    // If data is not fetched yet
    if (!data) {
      // Fetch the first time
      return
    }

    // Check if the data is older than 5 minutes
    const expirationDate = new Date(data.fetchedAt)
    expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 1000) // 5 minutes TTL
    const isExpired = expirationDate.getTime() < Date.now()
    if (isExpired) {
      // Refetch the data
      return
    }

    return data
  },
})

const teammates = computed(() => {
  return data.value ? data.value.teammates : []
})

const onSelectAssignee = (currentValue: ListboxItemSelectEvent<AcceptableValue>) => {
  const assignee = currentValue.detail.value as ProjectMembers

  const alreadyExists = props?.assignees.find(a => a.member_id === assignee.member_id)

  if (alreadyExists) {
    props?.onRemoveAssignee(assignee)
  }
  else {
    props?.onAddAssiginees(assignee)
  }
  open.value = false
}
</script>

<template>
  <div class="space-y-2 w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="bg-background font-normal hover:bg-background cursor-pointer w-full px-3 justify-between dark:border dark:border-ring"
        >
          <span class="text-muted-foreground">Select teammate</span>
          <ChevronDown
            :size="16"
            :stroke-width="2"
            class="shrink-0 text-muted-foreground/80"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="w-full min-w-[var(--reka-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search teammate.." />
          <CommandList>
            <CommandEmpty>No teammate found.</CommandEmpty>
            <CommandGroup heading="Teammates">
              <CommandItem
                v-for="teammate in teammates"
                :key="teammate.member_id"
                :value="teammate"
                class="cursor-pointer"
                @select="(ev) => onSelectAssignee(ev)"
              >
                <Avatar>
                  <AvatarImage
                    :src="teammate.avatar!"
                    :alt="teammate.username"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span class="leading-none">{{ teammate.username }}</span>
                <Check
                  v-if="props.assignees.some(a => a.member_id === teammate.member_id)"
                  :size="16"
                  stroke-width="2"
                  class="ml-auto"
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
