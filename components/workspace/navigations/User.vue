<script setup lang="ts">
import {
  ChevronsUpDown,
  LogOut,
  SparklesIcon,
} from 'lucide-vue-next'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

withDefaults(defineProps<{
  side?: 'right' | 'top' | 'bottom' | 'left'
}>(), {
  side: 'right',
})

const { user } = useUserSession()

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const { data: productId, status } = await useFetch('/api/polar/products', {
  lazy: true,
})

const onOpenSignoutModal = () => {
  modalStore?.setIsOpen(true)
  modalStore?.onOpen('signout')
}

const onUpgradeToPro = async () => {
  try {
    const res = await $fetch(`/api/payments/checkout`, {
      method: 'POST',
      body: {
        productId: productId.value as string,
        workspaceId: currentActiveWorkspace.value?.id as string,
      },
    })

    console.log(res.url)
  }
  catch (error: any) {
    // Handle error (optional: log or show notification)
    console.error('Upgrade to Pro failed:', error)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="w-full px-1 py-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:bg-[#1d1d1d] cursor-pointer bg-transparent"
      >
        <Avatar class="size-8 rounded-lg">
          <AvatarImage
            :src="user?.avatar ?? ''"
            :alt="user?.username"
          />
          <AvatarFallback class="rounded-lg">
            CN
          </AvatarFallback>
        </Avatar>

        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ user?.username }}</span>
          <span class="truncate text-xs">{{ user?.email }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-[#1d1d1d]"
      :side="side"
      :align="side ==='top' || side==='bottom' ? 'start' : 'end'"
      :side-offset="side ==='top' || side==='bottom' ? 0: 4"
    >
      <DropdownMenuLabel class="p-0 font-normal ">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="size-8 rounded-lg">
            <AvatarImage
              :src="user?.avatar ?? ''"
              :alt="user?.username"
            />
            <AvatarFallback class="rounded-lg">
              CN
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ user?.username }}</span>
            <span class="truncate text-xs">{{ user?.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        :disabled="status ==='pending' || status ==='idle'"
        @click="onUpgradeToPro"
      >
        <SparklesIcon />
        Upgrade to Pro
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        @click="onOpenSignoutModal"
      >
        <LogOut />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
