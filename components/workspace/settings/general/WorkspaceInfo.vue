<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import WorkspaceImage from './WorkspaceImage.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

const workspaceInfoSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s-'']+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      )
      .transform(name => name.trim()),
  }),
)

const workspaceStore = useWorkspaceStore()

const form = useForm({
  validationSchema: workspaceInfoSchema,
})

const activeWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const isUpdatingWorkspace = ref(false)
const isUploadingImage = ref(false)
const selectedWorkspaceImage = ref<string | null>(null)

const updateWorkspaceAvatar = (avatarStr: string | null): void => {
  selectedWorkspaceImage.value = avatarStr
}

const uploadImageToCloudinary = async (image: string): Promise<string | undefined> => {
  isUploadingImage.value = true
  try {
    const res = await $fetch('/api/workspace/upload', {
      method: 'POST',
      body: {
        image,
      },
    })

    return res.url
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
    return undefined
  }
  finally {
    isUploadingImage.value = false
  }
}

const onSubmit = form.handleSubmit(async (value) => {
  isUpdatingWorkspace.value = true
  try {
    let avatar: string = activeWorkspace.value ? activeWorkspace.value.imageUrl : ''
    if (selectedWorkspaceImage.value) {
      avatar = (await uploadImageToCloudinary(selectedWorkspaceImage.value)) || ''
    }

    const res = await $fetch(`/api/workspace/${activeWorkspace.value?.id}/details/update`, {
      method: 'POST',
      body: {
        name: value.name,
        image: avatar,
      },
    })

    form.resetForm()
    selectedWorkspaceImage.value = null
    workspaceStore.onSetActiveWorkspace(res.workspace!)
    form.setFieldValue('name', res.workspace?.name)
    await refreshNuxtData('workspaces')

    return toast.success(res.message, {
      position: 'top-center',
    })
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
    isUpdatingWorkspace.value = false
  }
})

onMounted(() => {
  if (activeWorkspace.value) {
    form.setFieldValue('name', activeWorkspace.value.name)
  }
})
</script>

<template>
  <div class="grid gap-5 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d]">
    <div>
      <h1 class="text-base font-medium">
        Workspace Details
      </h1>
      <p class="max-w-xl text-balance text-sm text-muted-foreground">
        Update your workspace info details.
      </p>
    </div>
    <form
      class="flex flex-col items-center gap-3 md:max-w-2xl md:flex-row md:gap-5"
      @submit="onSubmit"
    >
      <WorkspaceImage
        :is-updating-workspace="isUpdatingWorkspace"
        :update-workspace-avatar="updateWorkspaceAvatar"
        :avatar="activeWorkspace?.imageUrl!"
        :selected-workspace-image="selectedWorkspaceImage"
      />
      <div class="flex w-full flex-col gap-2 self-start md:flex-row md:items-center md:gap-3">
        <FormField
          v-slot="{ componentField }"
          name="name"
        >
          <FormItem class="w-full self-start md:max-w-xl xl:shrink-0">
            <FormLabel
              :class="cn(
                'text-sm font-medium',
                !form.controlledValues.value.name && 'after:ml-0.5 after:text-red-500 after:content-[\'*\']',
              )"
            >
              Name
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Acme Inc"
                v-bind="componentField"
                :disabled="form.isSubmitting && isUpdatingWorkspace"
                class="block w-full rounded-md border-[0.5px] border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-zinc-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button
          v-if="activeWorkspace?.name.trim() !==form.controlledValues.value.name?.trim() || selectedWorkspaceImage"
          :class="cn(
            'w-full md:w-fit shrink-0 border-0 bg-brand text-white hover:text-white hover:bg-brand-secondary dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground',
            form.errors.value.name ? 'self-center cursor-not-allowed' : 'self-end cursor-pointer',
          )"
          size="sm"
          variant="outline"
          type="submit"
          :disabled="!form.controlledValues.value || isUpdatingWorkspace || form.errors.value.name"
        >
          <Loader2
            v-if="isUpdatingWorkspace"
            class="size-4 animate-spin"
          />
          <Icon
            v-else
            name="solar:cloud-upload-outline"
            class="size-4"
          />
          Save
        </Button>
      </div>
    </form>
  </div>
</template>
