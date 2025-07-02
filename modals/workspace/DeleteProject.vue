<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Loader } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

const modalStore = useModalStore()

const isDeletingProject = ref(false)

const isModalOpen = computed(() => {
  return modalStore?.type === 'deleteProject' && modalStore?.isOpen
})

const project = computed(() => {
  return modalStore?.data.project
})

async function onDeleteProject() {
  isDeletingProject.value = true
  try {
    const res = await $fetch(`/api/workspace/${project.value?.workspaceId}/project/${project.value?.id}/delete`, {
      method: 'DELETE',
    })

    await refreshNuxtData([`sidebar_projects_${project.value?.workspaceId}`, `board_view_projects_${project.value?.workspaceId}`, `all_project_stats_${project.value?.workspaceId}`, `mobile_sidebar_projects_${project.value?.workspaceId}`])
    onClose()

    toast.success(res.message, {
      position: 'top-center',
    })
    onClose()
  }

  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isDeletingProject.value = false
  }
}

function onClose() {
  modalStore?.setIsOpen(false)
  modalStore?.onClose()
}
</script>

<template>
  <Dialog
    :open="isDeletingProject || isModalOpen"
    @update:open="onClose"
  >
    <DialogContent class="dark:bg-[#1d1d1d]">
      <DialogHeader class="items-center">
        <DialogDescription class="text-rose-500">
          <Icon
            name="heroicons:trash"
            class="mx-auto"
            size="80"
          />
        </DialogDescription>
        <DialogTitle class="text-center capitalize text-2xl">
          Delete <span class="text-rose-500">{{ project?.title }}</span> project! <br> Are you sure?
        </DialogTitle>
      </DialogHeader>
      <div class="space-y-2">
        <Button
          :disabled="isDeletingProject"
          class="w-full cursor-pointer"
          variant="destructive"
          @click="onDeleteProject"
        >
          <Loader
            v-if="isDeletingProject"
            class="h-auto w-5 animate-spin"
          />
          Continue
        </Button>
        <Button
          :disabled="isDeletingProject"
          class="w-full cursor-pointer"
          variant="outline"
          @click="onClose"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
