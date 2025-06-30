<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const colorMode = useColorMode()

withDefaults(defineProps<{
  side?: 'right' | 'top' | 'bottom' | 'left'
}>(), {
  side: 'right',
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="w-full">
      <Button
        variant="ghost"
        size="icon"
        class="w-full justify-start rounded-md p-2 text-base font-normal hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer mt-1"
      >
        <Sun
          class="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span>Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-[#1d1d1d]"
      :side="side"
      :align="side ==='top' || side ==='bottom' ? 'start' : 'end'"
      :side-offset="side ==='top' || side ==='bottom' ? 0: 6"
    >
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        @click="colorMode.preference = 'light'"
      >
        Light
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        @click="colorMode.preference = 'dark'"
      >
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        @click="colorMode.preference = 'system'"
      >
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
