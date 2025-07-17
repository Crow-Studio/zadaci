<script setup lang="ts">
import { CheckIcon, ChevronsUpDown, Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import type { Workspace } from '~/types'

const props = defineProps<{
  status: string
  workspaces: Workspace[]
  side?: 'right' | 'top' | 'bottom' | 'left'
}>()

const modalStore = useModalStore()

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const onSelectActiveWorkspace = async (w: Workspace) => {
  workspaceStore.onSetActiveWorkspace(w)
  workspaceStore?.onSetWorkspaceBreadcrumb({
    name: 'Dashboard',
    path: `/workspace/${w.id}/dashboard`,
    children: null,
  })
  await refreshNuxtData([`sidebar_projects_${w.id}`, `board_view_projects_${w.id}`, `all_project_stats_${w.id}`, `mobile_sidebar_projects_${w.id}`])
  navigateTo(`/workspace/${w.id}/dashboard`)
}

const onCreateWorkspace = () => {
  modalStore?.onOpen('createWorkspace')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <div
        v-if="props.status ==='pending' || props.status ==='idle'"
        class="flex items-center gap-2 p-1"
      >
        <div class="aspect-square size-8 animate-pulse rounded-lg bg-slate-200" />
        <div class="grid w-full gap-2 self-start">
          <div class="h-2.5 animate-pulse rounded bg-slate-200" />
          <div class="h-2.5 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <Button
        v-else
        variant="ghost"
        class="w-full px-1 py-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:bg-[#1d1d1d] cursor-pointer"
      >
        <Avatar class="aspect-square size-8 rounded-lg">
          <AvatarImage
            :src="currentActiveWorkspace?.imageUrl ?? ''"
            :alt="currentActiveWorkspace?.name"
          />
          <AvatarFallback class="rounded-lg">
            CN
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">
            {{ currentActiveWorkspace?.name }}
          </span>
          <span class="truncate text-xs">Free Plan</span>
        </div>
        <ChevronsUpDown class="ml-auto" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      v-if="status === 'success'"
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-[#1d1d1d]"
      :side="props?.side ? props?.side: 'left'"
      :align="props?.side ==='top' ? 'start' : 'end'"
      :side-offset="props?.side ==='top' ? 0: 6"
    >
      <DropdownMenuLabel class="text-xs text-muted-foreground">
        Workspaces
      </DropdownMenuLabel>
      <DropdownMenuItem
        v-for="(w, index) in props.workspaces"
        :key="w.name"
        class="flex cursor-pointer items-center justify-between gap-2 p-2 dark:hover:bg-[#343434]"
        @click="onSelectActiveWorkspace(w)"
      >
        <div class="flex items-center gap-2">
          <Avatar class="aspect-square size-6 rounded-sm">
            <AvatarImage
              :src="w?.imageUrl ?? ''"
              :alt="w?.name"
            />
            <AvatarFallback class="rounded-lg">
              CN
            </AvatarFallback>
          </Avatar>
          {{ w.name }}
        </div>
        <CheckIcon
          v-if="currentActiveWorkspace?.id === w.id"
        />
        <DropdownMenuShortcut v-else>
          ⌘{{ index + 1 }}
        </DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="cursor-pointer gap-2 p-2 dark:hover:bg-[#343434]"
        @click="onCreateWorkspace"
      >
        <div class="flex size-6 items-center justify-center rounded-md border bg-background">
          <Plus class="size-4" />
        </div>
        <div class="font-medium text-muted-foreground">
          Create Workspace
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
