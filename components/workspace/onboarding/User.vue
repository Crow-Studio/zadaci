<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const { user } = useUserSession()

const modalStore = useModalStore()

const onOpenSignoutModal = () => {
  modalStore?.setIsOpen(true)
  modalStore?.onOpen('signout')
}
</script>

<template>
  <div class="flex w-full shrink-0 justify-end">
    <div class="z-10 flex items-center gap-x-2 pr-4">
      <div
        class="grid place-items-center overflow-hidden rounded"
        tabindex="-1"
        style="height: 24px; width: 24px;"
      >
        <img
          :src="user?.avatar!"
          class="size-full rounded !text-base capitalize"
          alt="Coder Chris"
        >
      </div>
      <div
        class="relative"
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              id="headlessui-menu-button-:r1:"
              class="z-10 flex items-center gap-x-1"
              type="button"
            >
              <span class="text-custom-text-200 hidden text-sm font-medium lg:block">
                {{ user?.username ? user.username : user?.email }}
              </span>
              <Icon
                name="lucide-chevron-down"
                class="size-4"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-full max-w-md">
            <DropdownMenuLabel class="text-center">
              Action
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="focus:cursor-pointer focus:bg-rose-50 focus:text-rose-600"
              @click="onOpenSignoutModal"
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
