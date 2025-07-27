<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { deleteWorkspaceSchema } from '~/types/forms/schema'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const form = useForm({
  validationSchema: deleteWorkspaceSchema,
})

const isDeletingWorkspace = ref(false)

const isSubmitting = computed(() => {
  if (
    !form.controlledValues.value.name
    || form.errors.value.name
    || isDeletingWorkspace.value
  ) {
    return true
  }
  return false
})

const onDeleteWorkspace = form.handleSubmit(async (value) => {
  try {
    isDeletingWorkspace.value = true

    const res = await $fetch(`/api/workspace/${workspace.value?.id}/delete`, {
      method: 'DELETE',
      body: {
        name: value.name,
      },
    })

    toast.success(res.message, {
      position: 'top-center',
    })

    onClose()

    if (res.workspace) {
      workspaceStore.onSetActiveWorkspace(res.workspace)
      await refreshNuxtData('workspaces')
      return navigateTo(`/workspace/${res.workspace.id}/dashboard`)
    }

    workspaceStore.onSetActiveWorkspace(null)
    await refreshNuxtData('user_workspaces')
    return navigateTo(`/workspace/onboarding`)
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
    isDeletingWorkspace.value = false
  }
})

const onClose = () => {
  modalStore?.onClose()
  modalStore?.setIsOpen(false)
  form.resetForm()
}

const onTransferOnwership = () => {
  modalStore?.onOpen('transferOwnership')
  modalStore?.setIsOpen(true)
  form.resetForm()
}
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="onDeleteWorkspace"
  >
    <FormField
      v-slot="{ componentField }"
      name="name"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-sm font-medium">
          To confirm, type <span class="font-semibold text-destructive dark:text-white">{{ workspace?.name }} </span> in the below input.
        </FormLabel>
        <FormControl>
          <div
            :class="cn(
              'border rounded-md',
              form.errors.value.name && 'border-red-300',
            )"
          >
            <input
              type="text"
              autocomplete="off"
              :placeholder="`type ${workspace?.name}`"
              v-bind="componentField"
              class="block h-[46px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:bg-none focus:outline-none active:bg-transparent"
            >
          </div>
        </FormControl>
        <div
          v-if="form.controlledValues.value.name?.trim() || form.errors.value.name"
          class="flex items-center gap-1 px-0.5 text-xs text-red-600"
        >
          <Icon
            v-if="form.errors.value.name || form.controlledValues.value.name?.trim() !== workspace?.name?.trim()"
            name="lucide-circle-alert"
          />
          <span v-if="form.errors.value.name">
            {{ form.errors.value.name }}
          </span>
          <span v-else-if="form.controlledValues.value.name?.trim() && form.controlledValues.value.name?.trim() !== workspace?.name?.trim()">
            Name doesn't match
          </span>
        </div>
      </FormItem>
    </FormField>
    <div class="flex flex-col items-center gap-2">
      <button
        type="submit"
        :disabled="isSubmitting || (form.controlledValues.value.name ?? '').trim() !== (workspace?.name ?? '').trim()"
        :class="
          cn(
            'flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
            {
              'cursor-pointer bg-brand focus:bg-brand-secondary':
                form.controlledValues.value.name
                && !form.errors.value.name,
              'cursor-not-allowed bg-brand-secondary':
                !form.controlledValues.value.name
                || form.errors.value.name
                || isDeletingWorkspace || form.controlledValues.value.name.trim() !== workspace?.name.trim(),
            },
          )
        "
      >
        <Loader
          v-if="isDeletingWorkspace"
          class="size-5 animate-spin"
        />
        Continue
      </button>
      <Button
        variant="outline"
        class="w-full cursor-pointer"
        :disabled="isDeletingWorkspace"
        type="button"
        @click="onTransferOnwership"
      >
        Transfer ownership
      </Button>
      <Button
        type="button"
        :disabled="isDeletingWorkspace"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all cursor-pointer"
        @click="onClose"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
