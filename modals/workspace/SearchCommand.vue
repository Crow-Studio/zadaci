<script setup lang="ts">
import {
  Calculator,
  Calendar,
  Smile,
  Home,
  FileText,
  Blocks,
  Palette,
} from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import ActionTooltip from '~/components/workspace/global/ActionTooltip.vue'
</script>

<template>
  <Dialog>
    <ActionTooltip
      label="Search (⌘K)"
      as-child
    >
      <DialogTrigger class="inline-flex items-center cursor-pointer gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-2 sm:px-4 py-2 relative h-8 justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 w-fit sm:w-40">
        <span class="flex items-center gap-x-2">
          <Icon name="hugeicons:search-01" />
          <span class="hidden md:inline-flex">
            Search
          </span>
        </span>
        <kbd class="hidden items-center pointer-events-none select-none gap-1 p-1 rounded border border-border bg-muted font-sans font-medium min-h-4 text-[10px] h-4 px-1 absolute right-[0.3rem] top-[0.4rem] opacity-100 sm:flex">⌘ K</kbd>
      </DialogTrigger>
    </ActionTooltip>

    <DialogContent class="p-0 max-w-[640px] gap-0">
      <Command class="rounded-lg border-0 shadow-none dark:bg-[#1d1d1d]">
        <CommandInput
          placeholder="Type a command or search..."
          class="h-12 text-base rounded-none shadow-none"
        />
        <CommandList class="max-h-[400px] overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup
            heading="Links"
            class="px-2 py-3"
          >
            <CommandItem
              value="home"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <Home class="mr-3 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem
              value="docs"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <FileText class="mr-3 h-4 w-4" />
              <span>Docs</span>
            </CommandItem>
            <CommandItem
              value="blocks"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <Blocks class="mr-3 h-4 w-4" />
              <span>Blocks</span>
            </CommandItem>
            <CommandItem
              value="themes"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <Palette class="mr-3 h-4 w-4" />
              <span>Themes</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup
            heading="Getting Started"
            class="px-2 py-3"
          >
            <CommandItem
              value="calendar"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <Calendar class="mr-3 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem
              value="search"
              class="px-3 py-2 rounded-md cursor-pointer"
            >
              <Smile class="mr-3 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem
              disabled
              value="calculator"
              class="px-3 py-2 rounded-md opacity-50 cursor-not-allowed"
            >
              <Calculator class="mr-3 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
