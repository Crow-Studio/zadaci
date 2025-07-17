<!-- Parent.vue -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import ProjectColumn from './ProjectColumn.vue'
import type { DBProject, Status } from '~/types'
import { columns } from '~/types'

const workspaceStore = useWorkspaceStore()

const projects = ref<Record<string, DBProject[]>>({
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

function mapProjectsByStatus(data: DBProject[]) {
  const grouped = Object.fromEntries(Object.keys(projects.value).map(k => [k, [] as DBProject[]]))

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

  // sort each column by updatedAt descending
  Object.keys(grouped).forEach((key) => {
    (grouped[key] ?? []).sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0
      return (b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime())
        - (a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime())
    })
  })

  projects.value = grouped
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
  const list = projects.value[columnKey]
  if (!list) return

  const exists = list.find(p => p.id === project.id)
  if (exists) return

  if (typeof index === 'number') {
    list.splice(index, 0, { ...project, status: columnKey })
  }
  else {
    list.push({ ...project, status: columnKey })
  }

  Object.keys(projects.value).forEach((key) => {
    if (key !== columnKey) {
      if (projects.value[key]) {
        projects.value[key] = projects.value[key]!.filter(p => p.id !== project.id)
      }
    }
  })

  try {
    await $fetch(`/api/workspace/${currentActiveWorkspace.value?.id}/project/${project.id}/update-status`, {
      method: 'PATCH',
      body: { status: columnKey },
    })

    await refreshNuxtData([`sidebar_projects_${currentActiveWorkspace.value?.id}`, `board_view_projects_${currentActiveWorkspace.value?.id}`, `all_project_stats_${currentActiveWorkspace.value?.id}`, `mobile_sidebar_projects_${currentActiveWorkspace.value?.id}`])
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
  <div class="flex overflow-x-scroll gap-5 my-2 scrollbar-hide">
    <ProjectColumn
      v-for="column in columns"
      :key="column.name"
      :column="column"
      :data="projects[column.name.toUpperCase()] ?? []"
      :on-drop="(project, index) => handleDrop(column.name.toUpperCase() as Status, project, index)"
    />
  </div>
</template>
