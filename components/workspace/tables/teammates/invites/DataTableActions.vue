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
import type { UserRole, WorkspaceInvite } from '~/types'

interface DataTableColumnHeaderProps {
  row: Row<WorkspaceInvite>
}

const props = defineProps<DataTableColumnHeaderProps>()
const isLoading = ref(false)
const isRemovingInvite = ref(false)

const onResendInvite = async ({
  role,
  workspaceId,
  email,
}: {
  workspaceId: string
  role: UserRole
  email: string
}) => {
  try {
    isLoading.value = true
    let teammates: { email: string
      role: UserRole }[] = []

    teammates = [
      ...teammates,
      {
        role,
        email,
      },
    ]

    toast.promise(
      (async () => {
        const res = await $fetch(
          `/api/workspace/${workspaceId}/teammates/team-invite/resend`,
          {
            method: 'PATCH',
            body: {
              teammates,
            },
          },
        )
        return res
      })(),
      {
        loading: 'Resending invite...',
        success: async (data: {
          message: string
        }) => {
          await refreshNuxtData('workspace_team_invites')
          isLoading.value = false
          return data.message
        },
        error: (error: any) => {
          const errorMessage = error.response
            ? error.response._data.statusMessage
            : error.message
          isLoading.value = false

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
    isLoading.value = false
  }
}

const onRemoveInvite = async ({
  email,
  workspaceId,
}: {
  email: string
  workspaceId: string
}) => {
  try {
    isRemovingInvite.value = true
    let emails: string[] = []
    emails = [...emails, email]

    toast.promise(
      (async () => {
        const res = await $fetch(
          `/api/workspace/${workspaceId}/teammates/team-invite/remove`,
          {
            method: 'DELETE',
            body: {
              emails,
            },
          },
        )
        return res
      })(),
      {
        loading: 'Removing invite...',
        success: async (data: {
          message: string
        }) => {
          await refreshNuxtData('workspace_team_invites')
          isRemovingInvite.value = false
          return data.message
        },
        error: (error: any) => {
          const errorMessage = error.response
            ? error.response._data.statusMessage
            : error.message
          isRemovingInvite.value = false

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
    isRemovingInvite.value = false
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
          :disabled="isLoading || isRemovingInvite"
          @click="
            onResendInvite({
              workspaceId: props?.row.original.workspaceId,
              role: props?.row.original.role,
              email: props?.row.original.email,
            })
          "
        >
          <Icon
            name="solar:mailbox-outline"
            class="size-5"
          />
          Resend Invite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="bg-rose-50 text-rose-600 focus:cursor-pointer focus:bg-rose-600 focus:text-white dark:bg-background dark:focus:bg-rose-600"
          :disabled="isLoading || isRemovingInvite"
          @click="
            onRemoveInvite({
              email: props?.row.original.email,
              workspaceId: props?.row.original.workspaceId,
            })
          "
        >
          <Icon
            name="solar:trash-bin-minimalistic-linear"
            class="size-5"
          />
          Remove Invite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
