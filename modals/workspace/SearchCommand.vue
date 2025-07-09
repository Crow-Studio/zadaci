<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '~/components/ui/dialog'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'

import ActionTooltip from '~/components/workspace/global/ActionTooltip.vue'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const isOpen = ref(false)

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

const onCommandSelect = (value: string) => {
  const workspaceId = currentActiveWorkspace.value?.id
  if (!workspaceId) return

  if (value === 'dashboard') {
    navigateTo(`/workspace/${workspaceId}/dashboard`)
  }
  else if (value === 'my-tasks') {
    navigateTo(`/workspace/${workspaceId}/my-tasks`)
  }
  else if (value === 'new-project') {
    modalStore?.onOpen('addNewProject')
    modalStore?.setIsOpen(true)
  }
  else if (value === 'all-projects') {
    navigateTo(`/workspace/${workspaceId}/projects/all`)
  }
  else {
    const project = projects.value.find(p => p.title === value)
    if (project) {
      navigateTo(`/workspace/${workspaceId}/projects/${project.id}`)
    }
  }

  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      isOpen.value = true
    }
  })
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <ActionTooltip
      label="Search (⌘K)"
      as-child
    >
      <DialogTrigger
        class="inline-flex items-center cursor-pointer gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-2 sm:px-4 py-2 relative h-8 justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 w-fit sm:w-40"
      >
        <span class="flex items-center gap-x-2">
          <Icon name="hugeicons:search-01" />
          <span class="hidden md:inline-flex">
            Search
          </span>
        </span>
        <kbd
          class="hidden items-center pointer-events-none select-none gap-1 p-1 rounded border border-border bg-muted font-sans font-medium min-h-4 text-[10px] h-4 px-1 absolute right-[0.3rem] top-[0.4rem] opacity-100 sm:flex"
        >⌘ K</kbd>
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
              value="dashboard"
              class="px-3 py-2 rounded-md cursor-pointer"
              @select="onCommandSelect('dashboard')"
            >
              <Icon
                name="solar:home-angle-2-outline"
                class="mr-3"
                size="18"
              />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              value="my-tasks"
              class="px-3 py-2 rounded-md cursor-pointer"
              @select="onCommandSelect('my-tasks')"
            >
              <Icon
                name="hugeicons:task-01"
                class="mr-3"
                size="18"
              />
              <span>My Tasks</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup
            heading="Projects"
            class="px-2 py-3"
          >
            <CommandItem
              value="new-project"
              class="px-3 py-2 rounded-md cursor-pointer"
              @select="onCommandSelect('new-project')"
            >
              <Icon
                name="solar:add-folder-outline"
                class="mr-3"
                size="18"
              />
              <span>New Project</span>
            </CommandItem>
            <CommandItem
              value="all-projects"
              class="px-3 py-2 rounded-md cursor-pointer"
              @select="onCommandSelect('all-projects')"
            >
              <Icon
                name="solar:folder-with-files-outline"
                class="mr-3"
                size="18"
              />
              <span>All Projects</span>
            </CommandItem>

            <CommandItem
              v-for="project in projects"
              :key="project.id"
              :value="project.title"
              class="px-3 py-2 rounded-md cursor-pointer"
              @select="onCommandSelect(project.title)"
            >
              <Icon
                name="solar:folder-with-files-outline"
                class="mr-3"
                size="18"
              />
              <span>{{ project.title }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
