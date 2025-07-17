<script setup lang="ts">
import { toast } from 'vue-sonner'
import ProjectContentEditable from '~/components/workspace/projects/ProjectContentEditable.vue'
import type { ProjectMembers as IProjectMembers } from '~/types'
import ProjectMembers from '~/components/workspace/projects/ProjectMembers.vue'
import AddProjectMembers from '~/components/workspace/projects/AddProjectMembers.vue'
import ActionTooltip from '~/components/workspace/global/ActionTooltip.vue'
import ProjectTaskWrapper from '~/components/workspace/projects/ProjectTaskWrapper.vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const members = ref<IProjectMembers[]>([])
const isAddNewMember = ref(false)

const onAddMember = async (payload: IProjectMembers) => {
  const newMembers = [
    ...members.value,
    payload,
  ]
  isAddNewMember.value = true
  toast.promise(
    (async () => {
      const payload = {
        title: project?.value?.title,
        status: project?.value?.status,
        priority: project?.value?.priority,
        description: project?.value?.description,
        dueDate: project?.value?.due_date ? new Date(project?.value?.due_date) : undefined,
        members: newMembers,
      }
      const res = await $fetch(
        `/api/workspace/${project?.value?.workspace_id}/project/${project?.value?.id}/update`,
        {
          method: 'PATCH',
          body: payload,
        },
      )
      return res
    })(),
    {
      loading: 'Adding new project member..',
      success: async (data: { message: string }) => {
        members.value = newMembers
        isAddNewMember.value = false
        return data.message
      },

      error: (error: any) => {
        isAddNewMember.value = false
        const errorMessage = error.response
          ? error.response._data.statusMessage
          : error.message

        return errorMessage
      },
      position: 'top-center',
    },
  )
}

const onRemoveMember = async (payload: IProjectMembers) => {
  const newMembers = members.value.filter(member => member.member_id !== payload.member_id)
  isAddNewMember.value = true
  toast.promise(
    (async () => {
      const payload = {
        title: project?.value?.title,
        status: project?.value?.status,
        priority: project?.value?.priority,
        description: project?.value?.description,
        dueDate: project?.value?.due_date ? new Date(project?.value?.due_date) : undefined,
        members: newMembers,
      }
      const res = await $fetch(
        `/api/workspace/${project?.value?.workspace_id}/project/${project?.value?.id}/update`,
        {
          method: 'PATCH',
          body: payload,
        },
      )
      return res
    })(),
    {
      loading: 'Removing project member..',
      success: async (data: { message: string }) => {
        members.value = newMembers
        isAddNewMember.value = false
        return data.message
      },

      error: (error: any) => {
        isAddNewMember.value = false
        const errorMessage = error.response
          ? error.response._data.statusMessage
          : error.message

        return errorMessage
      },
      position: 'top-center',
    },
  )
}

const { data: project, status } = await useAsyncData(
  `project-${route.params.projectId}`,
  () => useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/project/${route.params.projectId}/info`),
)

watchEffect(async () => {
  if (status.value === 'success') {
    if (!project.value) {
      navigateTo('/workspace/projects/all')
      await refreshNuxtData([`sidebar_projects_${currentActiveWorkspace.value?.id}`, `board_view_projects_${currentActiveWorkspace.value?.id}`, `all_project_stat_${currentActiveWorkspace.value?.id}`, `mobile_sidebar_projects_${currentActiveWorkspace.value?.id}`])
    }
    else {
      workspaceStore?.onSetWorkspaceBreadcrumb({
        name: `${currentActiveWorkspace.value?.name}`,
        path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
        children: [
          {
            name: `Projects`,
            path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
            children: [
              {
                name: `${project.value?.title}`,
                path: `/workspace/projects/${project.value?.id}`,
                children: null,
              },
            ],
          },
        ],
      })
      members.value = project.value.members
    }
  }
})

useHead({
  titleTemplate: `${currentActiveWorkspace.value?.name} - Project | ${project.value?.title}`,
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Project | ${project.value?.title}` : 'Project',
  description:
    'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
})

const onAddNewTask = () => {
  if (project.value) {
    modalStore?.onOpen('addNewTask')
    modalStore?.setIsOpen(true)
    modalStore?.setModalData({
      project: {
        createdAt: new Date(project.value.created_at),
        updatedAt: new Date(project.value.updated_at),
        dueDate: project.value.due_date ? new Date(project.value.due_date) : null,
        workspaceId: project.value.workspace_id,
        members: members.value,
        id: project.value.id,
        title: project.value.title,
        description: project.value.description,
        status: project.value.status,
        priority: project.value.priority,
      },
    })
  }
}
</script>

<template>
  <section class="grid gap-5">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <ProjectContentEditable
        v-if="project"
        :project="{
          ...project,
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
          dueDate: project.due_date ? new Date(project.due_date) : null,
          workspaceId: project.workspace_id,
          members,
        }"
      />
      <div class="flex md:items-center flex-col md:flex-row md:justify-between xl:justify-start gap-2 sm:gap-x-10">
        <div
          v-if="project?.members"
          class="flex items-center justify-between sm:justify-start gap-2"
        >
          <ProjectMembers
            :members="members"
          />
          <ActionTooltip
            label="Add / Remove members"
            side="top"
          >
            <AddProjectMembers
              :on-remove-member="onRemoveMember"
              :on-add-member="onAddMember"
              :members="members"
              :is-add-new-member="isAddNewMember"
            />
          </ActionTooltip>
        </div>
        <ActionTooltip
          label="Add new task"
          side="top"
        >
          <Button
            class="cursor-pointer bg-brand text-white hover:bg-brand-secondary transition-all duration-500 ease-in-out sm:hover:scale-105 w-full sm:w-auto flex-shrink-0"
            @click="onAddNewTask"
          >
            <Icon
              name="hugeicons:task-add-01"
              class="size-4"
            />
            New Task
          </Button>
        </ActionTooltip>
      </div>
    </div>

    <ProjectTaskWrapper
      v-if="project"
      :project="{
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        priority: project.priority,
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at),
        dueDate: project.due_date ? new Date(project.due_date) : null,
        workspaceId: project.workspace_id,
        members,
      }"
      :workspace-id="project.workspace_id"
      :project-id="project.id"
    />
  </section>
</template>
