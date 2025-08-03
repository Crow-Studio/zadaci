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
import WorkspaceSwitcher from '~/components/workspace/navigations/WorkspaceSwitcher.vue'
import type { Workspace, WorkspaceBreadcrumb } from '~/types'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()
const { user } = useUserSession()
const { params } = useRoute()

const onNavigateToPage = (payload: WorkspaceBreadcrumb, pageName: string) => {
  workspaceStore?.onSetWorkspaceBreadcrumb(payload)
  onClose()
  return navigateTo(pageName)
}

const isModalOpen = computed(() => {
  return modalStore?.type === 'mobileSidebar' && modalStore?.isOpen
})

const { data: rawWorkspaces, status } = await useAsyncData('mobile_workspaces', () => useRequestFetch()(`/api/workspace/user/${user.value?.id}/workspaces`), {
  transform(input) {
    return {
      input,
      fetchedAt: new Date(),
    }
  },
  getCachedData(key, nuxtApp) {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    // If data is not fetched yet
    if (!data) {
      // Fetch the first time
      return
    }

    // Check if the data is older than 5 minutes
    const expirationDate = new Date(data.fetchedAt)
    expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 1000) // 5 minutes TTL
    const isExpired = expirationDate.getTime() < Date.now()
    if (isExpired) {
      // Refetch the data
      return
    }

    return data
  },
})

const workspaces = computed(() => {
  return rawWorkspaces.value?.input?.map(workspace => ({
    ...workspace,
    updatedAt: workspace.updatedAt || '',
  })) || []
})

onMounted(() => {
  if (workspaces.value && workspaces.value.length > 0) {
    if (workspaceStore.activeWorkspace) {
      const activeWorkspace = workspaces.value.find(
        (w: Workspace) => w.id === workspaceStore.activeWorkspace?.id,
      )
      const workspaceId = params.workspaceId

      if (workspaceId !== activeWorkspace?.id) {
        workspaceStore?.onSetWorkspaceBreadcrumb({
          name: 'Dashboard',
          path: `/workspace/${activeWorkspace?.id}/dashboard`,
          children: null,
        })
        return navigateTo(`/workspace/${activeWorkspace?.id}/dashboard`)
      }
    }
    else {
      const firstWorkspace = workspaces.value[0]
      if (firstWorkspace) {
        workspaceStore.onSetActiveWorkspace(firstWorkspace)
        workspaceStore?.onSetWorkspaceBreadcrumb({
          name: 'Dashboard',
          path: `/workspace/${firstWorkspace.id}/dashboard`,
          children: null,
        })
        navigateTo(`/workspace/${firstWorkspace.id}/dashboard`)
      }
    }
  }
})

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const onClose = () => {
  modalStore?.setIsOpen(false)
  modalStore?.onClose()
}

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}

const { data: projects } = await useAsyncData(`mobile_sidebar_projects_${currentActiveWorkspace.value?.id}`, () => useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/user/projects/all`))
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
        class="relative mt-1 flex h-full flex-col"
      >
        <WorkspaceSwitcher
          :status="status"
          :workspaces="workspaces!"
          side="bottom"
        />
        <ScrollArea class="flex-1 h-full py-3 space-y-3">
          <div
            class="flex flex-col"
          >
            <button
              class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
              @click="onNavigateToPage({
                name: 'Dashboard',
                path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                children: null,
              }, `/workspace/${currentActiveWorkspace?.id}/dashboard`)"
            >
              <Icon
                name="solar:home-angle-2-outline"
                class="size-4"
              />
              Dashboard
            </button>
            <button
              class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
              @click="onNavigateToPage({
                name: `${currentActiveWorkspace?.name}`,
                path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                children: [
                  {
                    name: 'My Tasks',
                    path: `/workspace/${currentActiveWorkspace?.id}/members`,
                    children: null,
                  },
                ],
              }, `/workspace/${currentActiveWorkspace?.id}/members`)"
            >
              <Icon
                name="solar:users-group-two-rounded-outline"
                class="size-4"
              />
              Members
            </button>
            <button
              class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
              @click="onNavigateToPage({
                name: `${currentActiveWorkspace?.name}`,
                path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                children: [
                  {
                    name: 'My Tasks',
                    path: `/workspace/${currentActiveWorkspace?.id}/my-tasks`,
                    children: null,
                  },
                ],
              }, `/workspace/${currentActiveWorkspace?.id}/my-tasks`)"
            >
              <Icon
                name="hugeicons:task-01"
                class="size-4"
              />
              My Tasks
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
                class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: `${currentActiveWorkspace?.name}`,
                  path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                  children: [
                    {
                      name: 'Projects',
                      path: `/workspace/${currentActiveWorkspace?.id}/projects/all`,
                      children: [
                        {
                          name: 'All',
                          path: `/workspace/${currentActiveWorkspace?.id}/projects/all`,
                          children: null,
                        },
                      ],
                    },
                  ],
                }, `/workspace/${currentActiveWorkspace?.id}/projects/all`)"
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
                class="flex w-full items-center capitalize gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: `${currentActiveWorkspace?.name}`,
                  path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                  children: [
                    {
                      name: `Projects`,
                      path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                      children: [
                        {
                          name: `${project.title}`,
                          path: `/workspace/projects/${project.id}`,
                          children: null,
                        },
                      ],
                    },
                  ],
                }, `/workspace/${currentActiveWorkspace?.id}/projects/${project.id}`)"
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
                  name: `${currentActiveWorkspace?.name}`,
                  path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                  children: [
                    {
                      name: 'Settings',
                      path: `/workspace/${currentActiveWorkspace?.id}/settings/general`,
                      children: [
                        {
                          name: 'General',
                          path: `/workspace/${currentActiveWorkspace?.id}/settings/general`,
                          children: null,
                        },
                      ],
                    },
                  ],
                }, `/workspace/${currentActiveWorkspace?.id}/settings/general`)"
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
                  name: `${currentActiveWorkspace?.name}`,
                  path: `/workspace/${currentActiveWorkspace?.id}/dashboard`,
                  children: [
                    {
                      name: 'Settings',
                      path: `/workspace/${currentActiveWorkspace?.id}/settings/profile`,
                      children: [
                        {
                          name: 'Profile',
                          path: `/workspace/${currentActiveWorkspace?.id}/settings/profile`,
                          children: null,
                        },
                      ],
                    },
                  ],
                }, `/workspace/${currentActiveWorkspace?.id}/settings/profile`)"
              >
                <Icon
                  name="hugeicons:user-settings-01"
                  class="size-4"
                />
                Profile
              </button>
              <button
                class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
                @click="onNavigateToPage({
                  name: 'Settings',
                  path: `/workspace/${currentActiveWorkspace?.id}/settings/general`,
                  children: [
                    {
                      name: 'Security',
                      path: `/workspace/${currentActiveWorkspace?.id}/settings/security`,
                      children: null,
                    },
                  ],
                }, `/workspace/${currentActiveWorkspace?.id}/settings/security`)"
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
        <div class="mt-auto w-full bg-transparent dark:bg-[#1d1d1d]">
          <User />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
