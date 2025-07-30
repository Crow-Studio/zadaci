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

// Flatten the nested breadcrumb structure into a linear array
const flattenedBreadcrumbs = computed(() => {
  if (!workspaceBreadcrumb.value) return []

  const result: { name: string, path: string }[] = []

  const flatten = (item: { name: string, path: string, children?: { name: string, path: string, children?: any }[] | null }) => {
    result.push({ name: item.name, path: item.path })

    if (item.children && item.children.length > 0) {
      // For nested breadcrumbs, we typically want to show the path to the deepest/current item
      // This assumes the last child in the array is the current active path
      const activeChild = item.children[item.children.length - 1]
      if (activeChild) {
        flatten(activeChild)
      }
    }
  }

  flatten(workspaceBreadcrumb.value)
  return result
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
      <Breadcrumb v-if="flattenedBreadcrumbs.length > 0">
        <BreadcrumbList>
          <template
            v-for="(breadcrumb, index) in flattenedBreadcrumbs"
            :key="breadcrumb.path"
          >
            <BreadcrumbItem class="text-base capitalize">
              <BreadcrumbLink :href="breadcrumb.path">
                {{ breadcrumb.name }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < flattenedBreadcrumbs.length - 1" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </div>
</template>
