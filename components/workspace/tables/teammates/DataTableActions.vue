<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import { MoreHorizontal } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { TeammatesWithProfile, ChangeTeammateRole } from '~/types'

interface DataTableColumnHeaderProps {
  row: Row<TeammatesWithProfile>
}

const props = defineProps<DataTableColumnHeaderProps>()
const modalStore = useModalStore()
const isChangingRole = ref(false)
const isRemovingUser = ref(false)

const onChangeRole = async ({
  workspaceId,
  user,
}: {
  workspaceId: string
  user: ChangeTeammateRole
}) => {
  try {
    isChangingRole.value = true
    let users: ChangeTeammateRole[] = []

    users = [
      ...users,
      user,
    ]

    modalStore?.onOpen('changeTeammateRole')
    modalStore?.setIsOpen(true)
    modalStore?.setModalData({
      teammates: users,
    })
  }
  finally {
    isChangingRole.value = false
  }
}

const onDeleteInvite = async ({
  userId,
  workspaceId,
}: {
  userId: string
  workspaceId: string
}) => {
  try {
    isRemovingUser.value = true
    let userIds: string[] = []

    userIds = [
      ...userIds,
      userId,
    ]

    toast.promise(
      (async () => {
        const res = await $fetch(
          `/api/workspace/${workspaceId}/teammates/remove`,
          {
            method: 'DELETE',
            body: {
              userIds,
              workspaceId,
            },
          },
        )
        return res
      })(),
      {
        loading: 'Removing teammate...',
        success: async (data: {
          message: string
        }) => {
          await refreshNuxtData()
          return data.message
        },
        error: (error: any) => {
          const errorMessage = error.response
            ? error.response._data.statusMessage
            : error.message

          return errorMessage
        },
        position: 'top-center',
      },
    )
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isRemovingUser.value = false
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :class="$attrs.class">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          class="size-8 p-0"
        >
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          class="focus:cursor-pointer"
          :disabled="isChangingRole || isRemovingUser"
          @click="
            onChangeRole({
              workspaceId: props?.row.original.workspaceId,
              user: {
                id: props?.row.original.user.id,
                role: props?.row.original.role,
                avatar: props?.row.original.user.profilePictureUrl as string,
                username: props?.row.original.user.username as string,
                email: props?.row.original.user.email,
              },
            })
          "
        >
          <Icon
            name="hugeicons:user-edit-01"
            class="size-5"
          />
          Change role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="bg-rose-50 text-rose-600 focus:cursor-pointer focus:bg-rose-600 focus:text-white"
          :disabled="isChangingRole || isRemovingUser"
          @click="
            onDeleteInvite({
              userId: props?.row.original.userId,
              workspaceId: props?.row.original.workspaceId,
            })
          "
        >
          <Icon
            name="solar:trash-bin-minimalistic-linear"
            class="size-5"
          />
          Remove user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
