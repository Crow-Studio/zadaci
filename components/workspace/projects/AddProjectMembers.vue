<script setup lang="ts">
import { Check } from 'lucide-vue-next'
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
  members: ProjectMembers[]
  onAddMember: (payload: ProjectMembers) => void
  onRemoveMember: (payload: ProjectMembers) => void
  isAddNewMember: boolean
}>()

const workspaceStore = useWorkspaceStore()

const activeWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const open = ref(false)

const { data } = await useAsyncData(`project_members_${activeWorkspace.value?.id}`, () => useRequestFetch()(`/api/workspace/${activeWorkspace.value?.id}/teammates/all`))

const teammates = computed(() => {
  return data.value ? data.value : []
})

const onSelectAssignee = (currentValue: ListboxItemSelectEvent<AcceptableValue>) => {
  const member = currentValue.detail.value as ProjectMembers

  const alreadyExists = props?.members.find(a => a.member_id === member.member_id)

  if (alreadyExists) {
    props?.onRemoveMember(member)
  }
  else {
    props?.onAddMember(member)
  }
  open.value = false
}
</script>

<template>
  <div class="space-y-2 w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          :disabled="props?.isAddNewMember"
          class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out sm:hover:scale-105 w-fit flex-shrink-0"
          :aria-expanded="open"
        >
          + Add Member
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="w-full min-w-[var(--reka-popper-anchor-width)] p-0"
        align="start"
      >
        <Command class="dark:bg-[#1d1d1d]">
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
                  v-if="props.members.some(a => a.member_id === teammate.member_id)"
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
