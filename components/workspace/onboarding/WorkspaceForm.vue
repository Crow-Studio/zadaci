<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import WorkspaceAvatar from './WorkspaceAvatar.vue'
import { onboardingWorkspaceSchema } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  onSetCurrentStep: (step: number) => void
}>()

const workspaceStore = useWorkspaceStore()

const form = useForm({
  validationSchema: onboardingWorkspaceSchema,
})

const isCreateWorkspace = ref(false)
const isUploadingImage = ref(false)
const selectedWorkspaceAvatar = ref<string | null>(null)
const workspaceImage = ref('https://res.cloudinary.com/dfa1yoc1v/image/upload/v1743189693/avatars/thumbs-1743189589089_sfuswl.svg')

const updateWorkspaceAvatar = (avatarStr: string) => {
  selectedWorkspaceAvatar.value = avatarStr
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
  isCreateWorkspace.value = true
  try {
    if (selectedWorkspaceAvatar.value) {
      workspaceImage.value = (await uploadImageToCloudinary(selectedWorkspaceAvatar.value)) || ''
    }

    const res = await $fetch('/api/workspace/create', {
      method: 'POST',
      body: {
        name: value.name,
        image: workspaceImage.value,
      },
    })

    if (res.workspace) {
      workspaceStore?.onSetOnboardingWorkspaceId(res.workspace.id)
      props.onSetCurrentStep(3)
    }
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
    isCreateWorkspace.value = false
  }
})
</script>

<template>
  <form
    class="mx-auto mt-2 w-full space-y-4 sm:w-96"
    @submit="onSubmit"
  >
    <WorkspaceAvatar
      :is-create-workspace="isCreateWorkspace"
      :update-workspace-avatar="updateWorkspaceAvatar"
    />
    <FormField
      v-slot="{ componentField }"
      name="name"
    >
      <FormItem class="">
        <FormLabel class="text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']">
          Name your workspace
        </FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Something familiar and recognizable is always best."
            v-bind="componentField"
            :disabled="form.isSubmitting && isCreateWorkspace"
            class="placeholder:text-custom-text-400 border-onboarding-border-100 block w-full rounded-md border-[0.5px] bg-transparent px-3 py-2 text-sm focus:outline-none"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <button
      type="submit"
      class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:bg-brand-secondary focus:bg-brand-secondary cursor-pointer"
    >
      <Loader2
        v-if="isCreateWorkspace"
        class="size-5 animate-spin"
      />
      Create workspace
    </button>
  </form>
</template>
