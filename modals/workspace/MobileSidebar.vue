<script setup lang="ts">
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import ToggleTheme from '~/components/workspace/navigations/ToggleTheme.vue'
import User from '~/components/workspace/navigations/User.vue'
import type { WorkspaceBreadcrumb } from '~/types'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const onNavigateToPage = (payload: WorkspaceBreadcrumb, pageName: string) => {
  workspaceStore?.onSetWorkspaceBreadcrumb(payload)
  onClose()
  return navigateTo(`/workspace/${pageName}`)
}

const isModalOpen = computed(() => {
  return modalStore?.type === 'mobileSidebar' && modalStore?.isOpen
})

const { data: projects } = await useAsyncData('mobile_sidebar_projects', () => useRequestFetch()('/api/workspace/project/all'))

const onClose = () => {
  modalStore?.setIsOpen(false)
  modalStore?.onClose()
}

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <Sheet
    :open="isModalOpen"
    @update:open="onClose"
  >
    <SheetContent
      side="left"
      class="bg-[#fafafa] dark:bg-[#1d1d1d]"
    >
      <SheetHeader>
        <SheetTitle class="sr-only">
          Mobile Sidebar
        </SheetTitle>
        <SheetDescription class="sr-only">
          This is a mobile sidebar
        </SheetDescription>
      </SheetHeader>
      <div
        class="relative mt-4 flex h-full flex-col"
      >
        <div class="mt-auto w-full bg-background dark:bg-[#1d1d1d]">
          <User side="top" />
        </div>
        <ScrollArea class="flex-1 py-3 space-y-3">
          <div
            class="flex flex-col"
          >
            <button
              class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
              @click="onNavigateToPage({
                name: 'Dashboard',
                path: `/workspace/dashboard`,
                children: null,
              }, 'dashboard')"
            >
              <Icon
                name="solar:home-angle-2-outline"
                class="size-4"
              />
              Dashboard
            </button>
          </div>
          <div class="grid">
            <h3 class="p-2 text-xs text-muted-foreground">
              Projects
            </h3>
            <div>
              <button
                class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onAddNewProject"
              >
                <Icon
                  name="solar:add-folder-outline"
                  class="size-4"
                />
                New Project
              </button>
              <button
                class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: 'Projects',
                  path: `/workspace/projects/all`,
                  children: [
                    {
                      name: 'All',
                      path: `/workspace/projects/all`,
                      children: null,
                    },
                  ],
                }, 'projects/all')"
              >
                <Icon
                  name="solar:folder-with-files-outline"
                  class="size-4"
                />
                All Projects
              </button>
              <button
                v-for="project in projects"
                :key="project.id"
                class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: 'Projects',
                  path: `/workspace/projects/all`,
                  children: [
                    {
                      name: `${project.title}`,
                      path: `/workspace/projects/${project.id}`,
                      children: null,
                    },
                  ],
                }, `projects/${project.id}`)"
              >
                <Icon
                  name="solar:folder-with-files-outline"
                  class="size-4"
                />
                <span class="truncate text-start w-55">
                  {{ project.title }}
                </span>
              </button>
            </div>
          </div>
          <div class="grid">
            <h3 class="p-2 text-xs text-muted-foreground">
              Settings
            </h3>
            <div>
              <button
                class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: 'Settings',
                  path: `/workspace/settings/general`,
                  children: [
                    {
                      name: 'General',
                      path: `/workspace/settings/general`,
                      children: null,
                    },
                  ],
                }, 'settings/general')"
              >
                <Icon
                  name="solar:settings-outline"
                  class="size-4"
                />
                General
              </button>
              <button
                class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: 'Settings',
                  path: `/workspace/settings/security`,
                  children: [
                    {
                      name: 'Security',
                      path: `/workspace/settings/security`,
                      children: null,
                    },
                  ],
                }, 'settings/security')"
              >
                <Icon
                  name="solar:lock-password-outline"
                  class="size-4"
                />
                Security
              </button>
              <ToggleTheme side="bottom" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </SheetContent>
  </Sheet>
</template>
