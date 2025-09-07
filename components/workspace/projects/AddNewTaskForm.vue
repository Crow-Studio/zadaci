<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2, X } from 'lucide-vue-next'
import TasksAssignees from './tasks/TasksAssignees.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import DatePicker from '~/components/workspace/DatePicker.vue'
import { columns, newTaskSchema, priorityOptions, type DBProject, type ProjectMembers } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '~/components/ui/label'
import { Checkbox } from '~/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  onClose: () => void
  isAddNewTask: boolean
  onSetIsAddNewTask: (payload: boolean) => void
  project: DBProject | null
}>()

const form = useForm({
  validationSchema: newTaskSchema,
})

const assignees = ref<ProjectMembers[]>([])

const members = computed(() => {
  return props.project && props.project.members ? props.project.members : []
})

const onAddAssiginees = (payload: ProjectMembers) => {
  const newAssignees = [
    ...assignees.value,
    payload,
  ]
  assignees.value = newAssignees
}

const onRemoveAssignee = (payload: ProjectMembers) => {
  const newAssignees = assignees.value.filter(a => a.member_id !== payload.member_id)
  assignees.value = newAssignees
}

const subtasks = ref([{ name: '', is_completed: false }])

const onSubtaskInput = (index: number, event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const value = input.value.trim()

  if (event.key === 'Enter') {
    event.preventDefault()

    if (value === '') {
      toast.error('Subtask name cannot be empty.', {
        position: 'top-center',
      })
      return
    }

    // Only add a new input if it's the last one
    if (index === subtasks.value.length - 1) {
      subtasks.value.push({ name: '', is_completed: false })
    }
  }
}

const removeSubtask = (index: number) => {
  subtasks.value.splice(index, 1)
  if (subtasks.value.length === 0) {
    subtasks.value.push({ name: '', is_completed: false })
  }
}

watch(subtasks, (newVal) => {
  form.setFieldValue('subtasks', newVal)
}, { deep: true })

const onSubmit = form.handleSubmit(async (values) => {
  props?.onSetIsAddNewTask(true)
  try {
    if (!props.project) {
      return toast.error('Project information is missing!', {
        position: 'top-center',
      })
    }

    const newFormValues = {
      ...values,
      description: values.description ? values.description : '',
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      subtasks: values.subtasks ? values.subtasks.filter(task => task.name) : [],
      assignees: assignees.value,
    }

    const res = await $fetch(`/api/workspace/${props.project.workspaceId}/project/${props.project.id}/tasks/add`, {
      method: 'POST',
      body: newFormValues,
    })

    await refreshNuxtData([`all_project_task_stats_${props.project.id}`, `board_view_project_tasks_${props.project.id}`, `workspace_user_due_items_${props.project.workspaceId}`])
    form.resetForm()
    onCloseModal()

    toast.success(res.message, {
      position: 'top-center',
    })
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    props?.onSetIsAddNewTask(false)

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
})

const onCloseModal = () => {
  props?.onSetIsAddNewTask(false)
  props?.onClose()
}
</script>

<template>
  <form
    class="p-2 -mt-8 space-y-2"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      name="name"
    >
      <FormItem>
        <FormControl>
          <FormMessage />
          <Textarea
            placeholder="Task name"
            class="outline-none border-0 shadow-none focus-visible:ring-0 resize-none placeholder:text-xl !text-xl dark:bg-transparent"
            v-bind="componentField"
            @input="(e: Event) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }"
          />
        </FormControl>
      </FormItem>
    </FormField>
    <div class="px-2 grid gap-3.5">
      <FormField
        v-slot="{ componentField }"
        name="status"
      >
        <FormItem>
          <div class="grid grid-cols-2">
            <FormLabel>
              Status
            </FormLabel>
            <FormControl>
              <Select
                v-bind="componentField"
              >
                <SelectTrigger
                  class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-full"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent
                  class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2"
                >
                  <SelectItem
                    v-for="column in columns"
                    :key="column.name"
                    :value="column.name.toUpperCase()"
                  >
                    <Icon
                      :name="column.icon"
                      width="16"
                      height="16"
                      aria-hidden="true"
                    />
                    <span class="truncate">
                      {{ column.name }}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="dueDate"
      >
        <FormItem>
          <div class="grid grid-cols-2">
            <FormLabel>
              Due date
            </FormLabel>
            <FormControl>
              <DatePicker
                v-bind="componentField"
              />
            </FormControl>
          </div>
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="priority"
      >
        <FormItem>
          <div class="grid grid-cols-2">
            <FormLabel>
              Priority
            </FormLabel>
            <FormControl>
              <Select
                v-bind="componentField"
              >
                <SelectTrigger
                  class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-full"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent
                  class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2"
                >
                  <SelectItem
                    v-for="priority in priorityOptions"
                    :key="priority.name"
                    :value="priority.value"
                  >
                    <div
                      class="size-2 rounded-full"
                      :style="{
                        backgroundColor: priority.color,
                      }"
                    />
                    <span class="truncate">
                      {{ priority.name }}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="grid gap-2">
        <Label>Assignees</Label>
        <div class="grid gap-y-2">
          <div
            v-if="assignees.length > 0"
            class="flex items-center gap-x-2 w-full flex-wrap"
          >
            <div
              v-for="assignee in assignees"
              :key="assignee.member_id"
              class="relative"
            >
              <div class="size-10 overflow-hidden">
                <Avatar
                  class="size-full absolute inset-0 object-cover"
                >
                  <AvatarImage
                    :src="assignee.avatar!"
                    :alt="assignee.username"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <Button
                size="icon"
                variant="destructive"
                class="absolute cursor-pointer -right-1 -top-1 size-6 rounded-full border-2 border-background"
                aria-label="Remove teammate"
                @click="onRemoveAssignee(assignee)"
              >
                <X :size="16" />
              </Button>
            </div>
          </div>
          <TasksAssignees
            :assignees="assignees"
            :on-add-assiginees="onAddAssiginees"
            :on-remove-assignee="onRemoveAssignee"
            :members="members"
          />
        </div>
      </div>
      <FormField
        v-slot="{ componentField }"
        name="description"
      >
        <FormItem>
          <div class="grid gap-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                class="h-24 min-h-24 max-h-24 resize-none overflow-y-auto dark:border dark:border-ring"
              />
            </FormControl>
          </div>
        </FormItem>
      </FormField>
      <div class="grid gap-2">
        <Label>Subtasks</Label>
        <div
          v-for="(subtask, index) in subtasks"
          :key="index"
          class="flex items-center gap-x-2"
        >
          <Checkbox
            v-model:checked="subtask.is_completed"
            class="rounded size-5 border-zinc-300"
            @update:model-value="(value) => subtask.is_completed = value === true"
          />
          <Input
            v-model="subtask.name"
            class="outline-none border-0 shadow-none focus-visible:ring-0 flex-1 dark:bg-transparent"
            placeholder="Add subtask"
            @keydown.enter="onSubtaskInput(index, $event)"
          />
          <button
            v-if="subtasks.length - 1 !== index"
            type="button"
            class="text-red-500 hover:text-red-700"
            @click="removeSubtask(index)"
          >
            <Icon
              name="hugeicons:delete-02"
              class="size-4"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 p-2 left-0 right-0 backdrop-blur-xs">
      <Button
        :disabled="props.isAddNewTask"
        class="w-full capitalize cursor-pointer bg-brand hover:bg-brand-secondary text-white"
      >
        <Loader2
          v-if="props?.isAddNewTask"
          class="animate-spin size-5"
        />
        Add new task
      </Button>
    </div>
  </form>
</template>
