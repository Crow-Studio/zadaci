<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import EditTaskForm from '~/components/workspace/projects/tasks/EditTaskForm.vue'
import { cn } from '~/lib/utils'
import { columns } from '~/types'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const isModalOpen = computed(() => {
  return modalStore?.type === 'editProjectTask' && modalStore?.isOpen
})

const task = computed(() => {
  return workspaceStore?.task
})

const isUpdateTask = ref(false)

const onSetIsUpdateTask = (payload: boolean) => {
  isUpdateTask.value = payload
}

const onClose = () => {
  if (!isUpdateTask.value) {
    modalStore?.setIsOpen(false)
    modalStore?.onClose()
    modalStore?.setModalData({})
    workspaceStore?.onSetTask(null)
  }
}
</script>

<template>
  <Sheet
    :open="isModalOpen"
    @update:open="onClose"
  >
    <SheetContent class="dark:bg-[#1d1d1d]">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-x-2 text-xl capitalize">
          <Avatar class="size-10 rounded-md">
            <AvatarImage
              :src="`https://avatar.vercel.sh/vercel.svg?text=${task?.project?.title?.charAt(0)}`"
              :alt="task?.project?.title"
            />
            <AvatarFallback>
              {{ task?.project?.title?.slice(0, 2).toUpperCase() || 'PR' }}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>
              {{ task?.project.title }}
            </p>
            <div class="text-sm text-muted-foreground flex items-center gap-x-3">
              <div class="flex items-center gap-x-1.5 text-primary">
                <Icon
                  :name="task?.project?.priority
                    ? (columns.find(f => f.name.toUpperCase() === task?.project?.status)?.icon || 'hugeicons:ai-idea')
                    : 'hugeicons:ai-idea'"
                  class="flex-shrink-0 size-4"
                />
                <p>{{ task?.project?.status }}</p>
              </div>
              <div class="bg-primary size-1 rounded-full" />
              <div class="flex items-center gap-x-2">
                <p>Priority:</p>
                <Badge
                  :class="cn(
                    'rounded text-xs gap-x-1 flex',
                    task?.project?.priority === 'MEDIUM' && 'bg-amber-100 dark:bg-amber-100 text-amber-500',
                    task?.project?.priority === 'LOW' && 'bg-purple-100 dark:bg-purple-100 text-purple-500',
                    task?.project?.priority === 'HIGH' && 'bg-rose-100 dark:bg-rose-100 text-rose-500',
                    task?.project?.priority === 'NONE' && 'bg-zinc-100 dark:bg-zinc-100 text-zinc-500',
                  )"
                >
                  <div
                    :class="cn(
                      'rounded-full size-1.5 shrink-0',
                      task?.project?.priority === 'MEDIUM' && 'bg-amber-500',
                      task?.project?.priority === 'LOW' && 'bg-purple-500',
                      task?.project?.priority === 'HIGH' && 'bg-rose-500',
                      task?.project?.priority === 'NONE' && 'bg-zinc-500',
                    )"
                  />
                  {{ task?.project?.priority }}
                </Badge>
              </div>
            </div>
          </div>
        </SheetTitle>
        <SheetDescription class="sr-only">
          Project title
        </SheetDescription>
      </SheetHeader>
      <EditTaskForm
        :on-set-is-update-task="onSetIsUpdateTask"
        :is-update-task="isUpdateTask"
        :on-close="onClose"
        :project-id="task?.project.id!"
        :task="task?.data!"
      />
    </SheetContent>
  </Sheet>
</template>
