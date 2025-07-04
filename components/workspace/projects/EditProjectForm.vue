<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2, X } from 'lucide-vue-next'
import isEqual from 'lodash/isEqual'
import AddAssignee from '../global/AddAssignee.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import DatePicker from '~/components/workspace/DatePicker.vue'
import { columns, newProjectSchema, priorityOptions, type DBProject, type ProjectMembers } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { formatDateForPicker } from '~/lib/utils'

const props = defineProps<{
  onClose: () => void
  isUpdateProject: boolean
  onSetIsUpdateProject: (payload: boolean) => void
  project: DBProject
}>()

const modalStore = useModalStore()

const form = useForm({
  validationSchema: newProjectSchema,
})

const assignees = useState('assignees_project', () => {
  return props?.project
    ? props?.project.members.map(member => ({
        member_id: member.member_id,
        avatar: member.avatar,
        email: member.email,
        username: member.username,
      }))
    : []
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

const initialProject = ref<{
  title: string
  status: string
  priority: string
  description: string
  dueDate: string | undefined
  members: ProjectMembers[]
}>({
  title: '',
  status: '',
  priority: '',
  description: '',
  dueDate: undefined,
  members: [],
})

const isDeletingProject = ref(false)

const isFormChanged = computed(() => {
  const current = {
    title: form.values.title,
    status: form.values.status,
    priority: form.values.priority,
    description: form.values.description,
    dueDate: form.values.dueDate,
    members: assignees.value,
  }
  return !isEqual(initialProject.value, current)
})

const onSubmit = form.handleSubmit(async (values) => {
  props?.onSetIsUpdateProject(true)
  try {
    const newFormValues = {
      ...values,
      description: values.description ? values.description : '',
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      members: assignees.value,
    }

    const res = await $fetch(`/api/workspace/${props?.project.workspaceId}/project/${props?.project.id}/update`, {
      method: 'PATCH',
      body: newFormValues,
    })

    await refreshNuxtData([`sidebar_projects_${props?.project.workspaceId}`, `board_view_projects_${props?.project.workspaceId}`, `all_project_stats_${props?.project.workspaceId}`, `mobile_sidebar_projects_${props?.project.workspaceId}`])
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

    props?.onSetIsUpdateProject(false)

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
})

onMounted(() => {
  form.setFieldValue('title', props?.project?.title || '')
  form.setFieldValue('status', props?.project?.status || '')
  form.setFieldValue('priority', props?.project?.priority || 'LOW')
  form.setFieldValue('description', props?.project?.description || '')

  form.setFieldValue('dueDate', formatDateForPicker(props?.project?.dueDate))

  initialProject.value = {
    title: props?.project?.title || '',
    status: props?.project?.status || '',
    priority: props?.project?.priority || 'LOW',
    description: props?.project?.description || '',
    dueDate: formatDateForPicker(props?.project?.dueDate),
    members: assignees.value,
  }
})

const onDeleteProject = async () => {
  modalStore?.onOpen('deleteProject')
  modalStore?.setIsOpen(true)
  modalStore?.setModalData({
    project: props?.project,
  })
}

const onCloseModal = () => {
  props?.onSetIsUpdateProject(false)
  props?.onClose()
}

const navigateToProject = (path: string) => {
  navigateTo(path)
  props?.onSetIsUpdateProject(false)
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
        <Label>Members</Label>
        <div class="grid gap-y-2">
          <div
            v-if="assignees.length > 0"
            class="flex items-center gap-x-2 w-full flex-wrap"
          >
            <div
              v-for="teammate in assignees"
              :key="teammate.member_id"
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

    <div class="absolute bottom-0 p-2 left-0 right-0 backdrop-blur-xs grid gap-1.5">
      <Button
        :disabled="props.isUpdateProject || !isFormChanged || isDeletingProject"
        class="w-full capitalize bg-brand hover:bg-brand-secondary text-white cursor-pointer"
      >
        <Loader2
          v-if="props?.isUpdateProject"
          class="animate-spin size-5"
        />
        <Icon
          v-else
          name="solar:folder-check-outline"
          class="size-5"
        />
        Update project
      </Button>
      <Button
        variant="destructive"
        :disabled="props.isUpdateProject || isDeletingProject"
        class="w-full cursor-pointer"
        type="button"
        @click="onDeleteProject"
      >
        <Loader2
          v-if="isDeletingProject"
          class="animate-spin size-5"
        />
        <Icon
          v-else
          name="heroicons:trash"
          class="size-5"
        />
        Delete project
      </Button>
      <Button
        variant="outline"
        class="w-full cursor-pointer"
        type="button"
        :disabled="props.isUpdateProject || isDeletingProject"
        @click="navigateToProject(`/workspace/${props?.project.workspaceId}/projects/${props?.project.id}`)"
      >
        <Icon
          name="solar:folder-with-files-outline"
          class="size-5"
        />
        View project
      </Button>
    </div>
  </form>
</template>
