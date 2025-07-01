<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2, X } from 'lucide-vue-next'
import AddAssignee from '../global/AddAssignee.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import DatePicker from '~/components/workspace/DatePicker.vue'
import type { Teammate } from '~/types'
import { columns, newProjectSchema, priorityOptions } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '~/components/ui/label'

const props = defineProps<{
  onClose: () => void
  isAddNewProject: boolean
  onSetIsAddNewProject: (payload: boolean) => void
}>()

const workspaceStore = useWorkspaceStore()

const activeWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const form = useForm({
  validationSchema: newProjectSchema,
})

const assignees = ref<Teammate[]>([])

const onAddAssiginees = (payload: Teammate) => {
  const newAssignees = [
    ...assignees.value,
    payload,
  ]
  assignees.value = newAssignees
}

const onRemoveAssignee = (payload: Teammate) => {
  const newAssignees = assignees.value.filter(a => a.id !== payload.id)
  assignees.value = newAssignees
}

const onSubmit = form.handleSubmit(async (values) => {
  props?.onSetIsAddNewProject(true)
  try {
    if (assignees.value.length <= 0) {
      props?.onSetIsAddNewProject(false)
      return toast.error('Atleast one assignee is required!', {
        position: 'top-center',
      })
    }
    const newFormValues = {
      ...values,
      description: values.description ? values.description : '',
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      assignees: assignees.value,
    }

    const res = await $fetch(`/api/workspace/${activeWorkspace.value?.id}/project/new`, {
      method: 'POST',
      body: newFormValues,
    })

    await refreshNuxtData([`sidebar_projects_${activeWorkspace.value?.id}`, `board_view_projects_${activeWorkspace.value?.id}`, `all_project_stats_${activeWorkspace.value?.id}`, `mobile_sidebar_projects_${activeWorkspace.value?.id}`])
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

    props?.onSetIsAddNewProject(false)

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
})

const onCloseModal = () => {
  props?.onSetIsAddNewProject(false)
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
      name="title"
    >
      <FormItem>
        <FormControl>
          <FormMessage />
          <Textarea
            placeholder="Project title"
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
    <div class="px-2 grid gap-3">
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
        <Label>Assignee</Label>
        <div class="grid gap-y-2">
          <div
            v-if="assignees.length > 0"
            class="flex items-center gap-x-2 w-full flex-wrap"
          >
            <div
              v-for="teammate in assignees"
              :key="teammate.id"
              class="relative"
            >
              <div class="size-10 overflow-hidden">
                <Avatar
                  class="size-full absolute inset-0 object-cover"
                >
                  <AvatarImage
                    :src="teammate.avatar!"
                    :alt="teammate.username"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <Button
                size="icon"
                variant="destructive"
                class="absolute cursor-pointer -right-1 -top-1 size-6 rounded-full border-2 border-background"
                aria-label="Remove teammate"
                @click="onRemoveAssignee(teammate)"
              >
                <X :size="16" />
              </Button>
            </div>
          </div>
          <AddAssignee
            :assignees="assignees"
            :on-add-assiginees="onAddAssiginees"
            :on-remove-assignee="onRemoveAssignee"
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
    </div>

    <div class="absolute bottom-0 p-2 left-0 right-0 backdrop-blur-xs">
      <Button
        :disabled="props.isAddNewProject"
        class="w-full capitalize cursor-pointer bg-brand hover:bg-brand-secondary text-white"
      >
        <Loader2
          v-if="props?.isAddNewProject"
          class="animate-spin size-5"
        />
        Add new project
      </Button>
    </div>
  </form>
</template>
