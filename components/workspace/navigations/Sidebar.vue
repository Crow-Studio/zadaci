<script setup lang="ts">
import User from './User.vue'
import ToggleTheme from './ToggleTheme.vue'
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import { ScrollArea } from '~/components/ui/scroll-area'
import type { WorkspaceBreadcrumb, Workspace } from '~/types'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()
const { params } = useRoute()
const { user } = useUserSession()

const isOpenSidebar = computed(() => {
  return workspaceStore?.isOpenSidebar
})

const onNavigateToPage = (payload: WorkspaceBreadcrumb, pageName: string) => {
  workspaceStore?.onSetWorkspaceBreadcrumb(payload)
  navigateTo(pageName)
}

const onAddNewProject = () => {
  modalStore?.onOpen('addNewProject')
  modalStore?.setIsOpen(true)
}

const { data: rawWorkspaces, status } = await useAsyncData('workspaces', () => useRequestFetch()(`/api/workspace/user/${user.value?.id}/workspaces`), {
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

const { data } = await useAsyncData(
  () => `sidebar_projects_${currentActiveWorkspace.value?.id}`,
  () => {
    if (currentActiveWorkspace.value?.id) {
      return useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value.id}/user/projects/all`)
    }
    return Promise.resolve([])
  },
  { watch: [() => currentActiveWorkspace.value?.id] },
)

const projects = computed(() => {
  return data.value
    ? data.value.map((project: any) => ({
        ...project,
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
        createdAt: project.createdAt ? new Date(project.createdAt) : null,
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : null,
      }))
    : []
})
</script>

<template>
  <div
    class="fixed top-0 z-20 h-screen shrink-0 bg-[#fafafa] transition-all duration-300 dark:bg-[#1d1d1d] md:block"
    :class="{ 'w-0': !isOpenSidebar, 'hidden p-1 md:w-72': isOpenSidebar }"
  >
    <div
      class="relative flex h-full flex-col"
      :class="{ 'opacity-0': !isOpenSidebar, 'opacity-100': isOpenSidebar }"
    >
      <WorkspaceSwitcher
        :status="status"
        :workspaces="workspaces!"
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
              class="flex w-full items-center   gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
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
              class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer"
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
                name: 'Settings',
                path: `/workspace/${currentActiveWorkspace?.id}/settings/general`,
                children: [
                  {
                    name: 'General',
                    path: `/workspace/${currentActiveWorkspace?.id}/settings/general`,
                    children: null,
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
  </div>
</template>
