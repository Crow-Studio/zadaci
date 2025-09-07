<script setup lang="ts">
import { toast } from 'vue-sonner'
import ProjectColumn from './ProjectColumn.vue'
import ProjectsBoardFilter from './ProjectsBoardFilter.vue'
import type { DBProject, Status } from '~/types'
import { columns } from '~/types'

const workspaceStore = useWorkspaceStore()

// Original projects data from API
const originalProjects = ref<Record<string, DBProject[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

// Displayed projects (after filtering)
const displayedProjects = ref<Record<string, DBProject[]>>({
  'IDEA': [],
  'TODO': [],
  'IN PROGRESS': [],
  'IN REVIEW': [],
  'COMPLETED': [],
  'ABANDONED': [],
})

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const { data } = await useAsyncData(`board_view_projects_${currentActiveWorkspace.value?.id}`, () =>
  useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/user/projects/all`),
)

function handleProjectFiltered(newFilteredProjects: Record<string, DBProject[]>) {
  displayedProjects.value = newFilteredProjects
}

function mapProjectsByStatus(data: DBProject[]) {
  const grouped = Object.fromEntries(Object.keys(originalProjects.value).map(k => [k, [] as DBProject[]]))

  for (const project of data) {
    const key = project.status.toUpperCase()
    if (grouped[key]) {
      grouped[key].push({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
      })
    }
  }

  // Sort each column by updatedAt descending
  Object.keys(grouped).forEach((key) => {
    (grouped[key] ?? []).sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0
      return (b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime())
        - (a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime())
    })
  })

  originalProjects.value = grouped
  // Initialize displayed projects with original data
  displayedProjects.value = { ...grouped }
}

onMounted(() => {
  if (data.value) {
    const normalized = data.value.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      dueDate: project.dueDate ? new Date(project.dueDate) : null,
    }))
    mapProjectsByStatus(normalized)
  }
})

watch(data, () => {
  if (data.value) {
    const normalized = data.value.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      dueDate: project.dueDate ? new Date(project.dueDate) : null,
    }))
    mapProjectsByStatus(normalized)
  }
}, { immediate: true })

async function handleDrop(columnKey: Status, project: DBProject, index?: number) {
  // Update both original and displayed projects
  const originalList = originalProjects.value[columnKey]
  const displayedList = displayedProjects.value[columnKey]

  if (!originalList || !displayedList) return

  // Check if project already exists in the column
  const existsInOriginal = originalList.find(p => p.id === project.id)
  const existsInDisplayed = displayedList.find(p => p.id === project.id)

  if (existsInOriginal || existsInDisplayed) return

  const updatedProject = { ...project, status: columnKey }

  // Update original projects
  if (typeof index === 'number') {
    originalList.splice(index, 0, updatedProject)
  }
  else {
    originalList.push(updatedProject)
  }

  // Update displayed projects
  if (typeof index === 'number') {
    displayedList.splice(index, 0, updatedProject)
  }
  else {
    displayedList.push(updatedProject)
  }

  // Remove from other columns in both original and displayed
  Object.keys(originalProjects.value).forEach((key) => {
    if (key !== columnKey) {
      if (originalProjects.value[key]) {
        originalProjects.value[key] = originalProjects.value[key]!.filter(p => p.id !== project.id)
      }
      if (displayedProjects.value[key]) {
        displayedProjects.value[key] = displayedProjects.value[key]!.filter(p => p.id !== project.id)
      }
    }
  })

  try {
    await $fetch(`/api/workspace/${currentActiveWorkspace.value?.id}/project/${project.id}/update-status`, {
      method: 'PATCH',
      body: { status: columnKey },
    })

    await refreshNuxtData([
      `sidebar_projects_${currentActiveWorkspace.value?.id}`,
      `board_view_projects_${currentActiveWorkspace.value?.id}`,
      `all_project_stats_${currentActiveWorkspace.value?.id}`,
      `mobile_sidebar_projects_${currentActiveWorkspace.value?.id}`,
      `workspace_user_due_items_${currentActiveWorkspace.value?.id}`,
    ])
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
}
</script>

<template>
  <div class="w-full overflow-x-hidden md:col-span-2 xl:col-span-6">
    <ProjectsBoardFilter
      :projects="originalProjects"
      @projects-filtered="handleProjectFiltered"
    />
    <div class="flex overflow-x-scroll gap-5 my-2 scrollbar-hide">
      <ProjectColumn
        v-for="column in columns"
        :key="column.name"
        :column="column"
        :data="displayedProjects[column.name.toUpperCase()] ?? []"
        :on-drop="(project, index) => handleDrop(column.name.toUpperCase() as Status, project, index)"
      />
    </div>
  </div>
</template>
