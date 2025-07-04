<script setup lang="ts">
import { toast } from 'vue-sonner'
import ProjectStatus from './edits/ProjectStatus.vue'
import ProjectPriority from './edits/ProjectPriority.vue'
import ProjectDueDate from './edits/ProjectDueDate.vue'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import type { DBProject, Priority, Status } from '~/types'

const props = defineProps<{ project: DBProject }>()

const savingState = ref<{ isSaving: boolean, message: string }>({
  isSaving: false,
  message: 'Saving',
})

async function updateField(field: string, event: Event) {
  const target = event.target as HTMLElement
  const value = target.textContent?.trim() || ''

  const oldValue = props.project[field as keyof DBProject]

  if (value === oldValue) {
    // No change, do nothing
    target.blur()
    return
  }

  if (!value) {
    target.textContent = String(oldValue ?? '')
    return toast.error(`${capitalize(field)} cannot be empty!`, {
      position: 'top-center',
    })
  }

  savingState.value = { isSaving: true, message: 'Saving' }

  const payload = {
    title: field === 'title' ? value : props.project.title,
    status: field === 'status' ? value : props.project.status,
    priority: field === 'priority' ? value : props.project.priority,
    description: props.project.description,
    dueDate: props.project.dueDate ? new Date(props.project.dueDate) : undefined,
  }

  try {
    await $fetch(`/api/workspace/${props?.project.workspaceId}/project/${props.project.id}/update`, {
      method: 'PATCH',
      body: payload,
    })

    await refreshNuxtData([
      `sidebar_projects_${props?.project.workspaceId}`,
      `board_view_projects_${props?.project.workspaceId}`,
      `all_project_stats_${props?.project.workspaceId}`,
      `mobile_sidebar_projects_${props?.project.workspaceId}`,
      `project-${props.project.id}`,
    ])

    target.blur()
    savingState.value = { isSaving: true, message: 'Saved' }
    setTimeout(() => (savingState.value.isSaving = false), 1000)
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, { position: 'top-center' })
    savingState.value = { isSaving: true, message: 'Error' }
    setTimeout(() => (savingState.value.isSaving = false), 1000)
  }
}

async function onUpdateProjectInfo(field: string, value: Status | Priority | string | undefined) {
  try {
    const payload = {
      title: props.project.title,
      status: field === 'status' ? value : props.project.status,
      priority: field === 'priority' ? value : props.project.priority,
      description: props.project.description,
      dueDate: field === 'dueDate' ? value ? new Date(value as string) : undefined : props.project.dueDate,
    }
    await $fetch(`/api/workspace/${props?.project.workspaceId}/project/${props.project.id}/update`, {
      method: 'PATCH',
      body: payload,
    })

    await refreshNuxtData([
      `sidebar_projects_${props?.project.workspaceId}`,
      `board_view_projects_${props?.project.workspaceId}`,
      `all_project_stats_${props?.project.workspaceId}`,
      `mobile_sidebar_projects_${props?.project.workspaceId}`,
      `project-${props.project.id}`,
    ])

    savingState.value = { isSaving: true, message: 'Saved' }
    setTimeout(() => (savingState.value.isSaving = false), 1000)
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, { position: 'top-center' })
    savingState.value = { isSaving: true, message: 'Error' }
    setTimeout(() => (savingState.value.isSaving = false), 1000)
  }
}
</script>

<template>
  <div class="flex items-center gap-x-3">
    <Avatar class="size-12 rounded-md">
      <AvatarImage
        :src="`https://avatar.vercel.sh/vercel.svg?text=${project.title?.charAt(0)}`"
        :alt="project.title"
      />
      <AvatarFallback class="rounded-md">
        {{ project.title?.slice(0, 2).toUpperCase() || 'PR' }}
      </AvatarFallback>
    </Avatar>

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-x-2">
        <h1
          contenteditable="true"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          class="text-lg sm:text-xl font-semibold truncate capitalize outline-none focus:border-b focus:border-purple-500 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden"
          @keydown.enter.prevent
          @keyup.enter.prevent="(ev) => updateField('title', ev)"
          @blur="(ev) => updateField('title', ev)"
        >
          {{ project.title }}
        </h1>

        <div
          v-if="savingState.isSaving"
          class="flex items-center gap-x-1 text-sm text-muted-foreground"
        >
          <Icon
            name="solar:cloud-upload-outline"
          />
          <p>{{ savingState.message }}</p>
        </div>
      </div>

      <div class="text-sm text-muted-foreground flex items-center gap-x-3 -mt-2">
        <ProjectDueDate
          :due-date="project?.dueDate ? project.dueDate.toISOString() : undefined"
          :on-update-project-info="onUpdateProjectInfo"
        />

        <div class="bg-primary size-1 rounded-full" />

        <div class="flex items-center gap-x-2">
          <p class="hidden sm:block">
            Status:
          </p>
          <ProjectStatus
            :status="project.status"
            :on-update-project-info="onUpdateProjectInfo"
          />
        </div>

        <div class="bg-primary size-1 rounded-full" />

        <ProjectPriority
          :priority="project.priority"
          :on-update-project-info="onUpdateProjectInfo"
        />
      </div>
    </div>
  </div>
</template>
