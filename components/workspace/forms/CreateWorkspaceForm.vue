<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import FileUpload from '../global/FileUpload.vue'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { createWorkspaceSchema } from '~/types/forms/schema'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const isUploadingImg = ref(false)

const form = useForm({
  validationSchema: createWorkspaceSchema,
})

const isCreatingWorkspace = ref(false)

const isSubmitting = computed(() => {
  if (
    !form.controlledValues.value.name
    || form.errors.value.name
    || isCreatingWorkspace.value
  ) {
    return true
  }
  return false
})

const setIsUploadImg = (payload: boolean) => {
  isUploadingImg.value = payload
}

const onCreateWorkspace = form.handleSubmit(async (values) => {
  try {
    isCreatingWorkspace.value = true

    const image = values.image ? values.image : `https://avatar.vercel.sh/vercel.svg?text=${values.name.charAt(0).toUpperCase()}`

    const res = await $fetch('/api/workspace/create', {
      method: 'POST',
      body: {
        name: values.name,
        image,
      },
    })

    if (res.workspace) {
      workspaceStore.onSetActiveWorkspace({
        ...res.workspace,
        updatedAt: res.workspace.updated_at ?? '',
        imageUrl: res.workspace.image_url,
        inviteCode: res.workspace.invite_code,
        createdAt: res.workspace.created_at,
        userRole: res.workspace.user_role,
      })
      onClose()
      toast.success('Successfully created a new workspace!', {
        position: 'top-center',
      })
      await refreshNuxtData(['workspaces', 'mobile_workspaces'])
      return navigateTo(`/workspace/${res.workspace.id}/dashboard`)
    }
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isCreatingWorkspace.value = false
  }
})

const onClose = () => {
  modalStore?.onClose()
  modalStore?.setIsOpen(false)
}
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="onCreateWorkspace"
  >
    <FormField
      v-slot="{ componentField }"
      name="name"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-onboarding-text-300 text-sm font-medium">
          Name
        </FormLabel>
        <FormControl>
          <div
            :class="
              cn(
                'border rounded-md',
                form.errors.value.name && 'border-red-300',
              )
            "
          >
            <input
              type="text"
              placeholder="e.g Acme Inc"
              v-bind="componentField"
              class="placeholder:text-custom-text-400 border-custom-border-200 placeholder:text-onboarding-text-400 block h-[46px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:bg-none focus:outline-none active:bg-transparent"
            >
          </div>
        </FormControl>
        <div class="flex items-center gap-1 px-0.5 text-xs text-red-600">
          <Icon
            v-if="form.errors.value.name"
            name="lucide-circle-alert"
          />
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ value, handleChange }"
      name="image"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-onboarding-text-300 text-sm font-medium">
          Image
        </FormLabel>
        <FormControl>
          <FileUpload
            :value="value as string"
            :handle-change="handleChange"
            :is-upload-img="isUploadingImg"
            :set-is-upload-img="setIsUploadImg"
          />
          <div class="my-1.5 text-center text-xs text-muted-foreground">
            Don't think hard, a default image would be added for you.
          </div>
        </FormControl>
      </FormItem>
    </FormField>
    <div class="flex flex-col items-center gap-2">
      <button
        type="submit"
        :disabled="isSubmitting || isUploadingImg"
        :class="
          cn(
            'flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
            {
              'cursor-pointer bg-brand focus:bg-brand-secondary':
                form.controlledValues.value.name
                && !form.errors.value.name,
              'cursor-not-allowed bg-brand-secondary opacity-50':
                !form.controlledValues.value.name
                || form.errors.value.name
                || isCreatingWorkspace,
            },
          )
        "
      >
        <Loader
          v-if="isCreatingWorkspace"
          class="size-5 animate-spin"
        />
        Create Workspace
      </button>
      <Button
        type="button"
        :disabled="isCreatingWorkspace || isUploadingImg"
        variant="ghost"
        class="flex w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        @click="onClose"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
