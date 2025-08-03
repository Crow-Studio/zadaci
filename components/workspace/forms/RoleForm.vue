<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { ChangeTeammateRole, UserRole } from '~/types'

const props = defineProps<{
  isChangingRole: boolean
  teammate: ChangeTeammateRole
  teammates: ChangeTeammateRole[]
}>()

const modalStore = useModalStore()

const member = ref({
  role: props?.teammate.role,
  id: props?.teammate.id,
})

const onUpdateMember = (value: UserRole) => {
  const filteredTeammembers = props?.teammates.filter(t => t.id !== props.teammate.id)
  const findTeammember = props?.teammates.find(t => t.id === props?.teammate.id)

  if (findTeammember) {
    const newTeammates = [
      ...filteredTeammembers,
      {
        ...findTeammember,
        id: props.teammate.id,
        role: value,
      },
    ]

    modalStore?.setModalData({
      teammates: newTeammates,
    })
  }
}

const removeUser = (userId: string) => {
  const filteredUsers = props?.teammates.filter(t => t.id !== userId)
  modalStore?.setModalData({
    teammates: filteredUsers,
  })
}
</script>

<template>
  <div class="group grid grid-cols-2 gap-3">
    <div>
      <Select
        v-model="member.id"
        :default-value="props?.teammate.id"
        :disabled="props?.isChangingRole"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select a teammate" />
        </SelectTrigger>
        <SelectContent
          class="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
        >
          <SelectItem
            :value="props?.teammate.id"
            class="cursor-pointer"
          >
            <span class="flex items-center gap-2">
              <img
                class="size-10 rounded-full object-cover"
                :src="props?.teammate.avatar"
                :alt="props?.teammate.username"
                width="40"
                height="40"
              >
              <span>
                <span class="block font-medium">{{ props?.teammate.username }}</span>
                <span class="sr-only"> : </span>
                <span class="mt-0.5 block text-xs text-muted-foreground">
                  {{ props?.teammate.email }}
                </span>
              </span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="items-center gap-3">
      <div
        class="relative items-center grid grid-cols-4 gap-2.5"
      >
        <Select
          v-model="member.role"
          :disabled="props?.isChangingRole"
          :default-value="props?.teammate.role"
          @update:model-value="(val) => onUpdateMember(val as unknown as UserRole)"
        >
          <SelectTrigger
            id="select-36"
            class="outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 col-span-full"
            :class="cn(
              'outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 w-full',
              props?.teammates.length <=1 ? 'col-span-full' : 'col-span-3',
            )"
          >
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="GUEST"
              class="cursor-pointer"
            >
              Guest
            </SelectItem>
            <SelectItem
              value="MEMBER"
              class="cursor-pointer"
            >
              Member
            </SelectItem>
            <SelectItem
              value="OWNER"
              class="cursor-pointer"
            >
              Owner
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          v-if="props?.teammates.length > 1"
          variant="ghost"
          size="icon"
          class="size-7 rounded-full border text-destructive hover:text-rose-400"
          @click="removeUser(teammate.id)"
        >
          <X class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
