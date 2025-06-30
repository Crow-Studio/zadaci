<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import DatePicker from '~/components/workspace/DatePicker.vue'
import { columns, newProjectSchema, priorityOptions } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const props = defineProps<{
  onClose: () => void
  isAddNewProject: boolean
  onSetIsAddNewProject: (payload: boolean) => void
}>()

const form = useForm({
  validationSchema: newProjectSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  props?.onSetIsAddNewProject(true)
  try {
    const newFormValues = {
      ...values,
      description: values.description ? values.description : '',
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
    }

    const res = await $fetch('/api/workspace/project/new', {
      method: 'POST',
      body: newFormValues,
    })

    await refreshNuxtData(['sidebar_projects', 'board_view_projects', 'all_project_stats', 'mobile_sidebar_projects'])
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
