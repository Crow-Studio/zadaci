<script setup lang="ts">
import { PanelLeftIcon, PanelRightIcon } from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import SearchCommand from '~/modals/workspace/SearchCommand.vue'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const toggleSidebar = () => {
  workspaceStore.onOpenSidebar()
}

const isSidebarOpen = computed(() => {
  return workspaceStore?.isOpenSidebar
})

const workspaceBreadcrumb = computed(() => {
  return workspaceStore?.breadcrumb as {
    name: string
    path: string
    children: { name: string, path: string }[] | null
  } | null
})

const onToggleMobileSidebar = () => {
  modalStore?.onOpen('mobileSidebar')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <div class="sticky inset-x-0 top-0 z-20 p-2 md:p-2 flex items-center justify-between gap-2 bg-background backdrop-blur-sm sm:px-1">
    <div class="flex items-center">
      <Button
        size="icon"
        variant="ghost"
        class="md:hidden cursor-pointer"
        @click="onToggleMobileSidebar"
      >
        <PanelLeftIcon class="size-6" />
      </Button>
      <Button
        v-if="!isSidebarOpen"
        size="icon"
        variant="ghost"
        class="hidden md:flex cursor-pointer"
        @click="toggleSidebar"
      >
        <PanelRightIcon class="size-6" />
      </Button>
      <Button
        v-else
        size="icon"
        variant="ghost"
        class="hidden md:flex cursor-pointer"
        @click="toggleSidebar"
      >
        <PanelLeftIcon class="size-6" />
      </Button>
      <Separator
        orientation="vertical"
        class="mr-2 h-4"
      />
      <Breadcrumb v-if="workspaceBreadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem class="text-base">
            <BreadcrumbLink :href="workspaceBreadcrumb.path">
              {{ workspaceBreadcrumb.name }}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <template v-if="workspaceBreadcrumb.children?.length">
            <BreadcrumbSeparator />
            <BreadcrumbItem
              v-for="child in workspaceBreadcrumb.children"
              :key="child.path"
              class="text-base"
            >
              <BreadcrumbLink :href="child.path">
                {{ child.name }}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <SearchCommand />
  </div>
</template>
