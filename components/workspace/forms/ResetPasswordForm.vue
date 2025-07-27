<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import Password from '../global/Password.vue'
import OldPassword from '../global/OldPassword.vue'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { resetPasswordSchema } from '~/types/forms/schema'

const modalStore = useModalStore()

const form = useForm({
  validationSchema: resetPasswordSchema,
})

const isResettingPassword = ref(false)

const isSubmitting = computed(() => {
  if (
    !form.controlledValues.value.password
    || form.errors.value.password
    || !form.controlledValues.value.newPassword
    || form.errors.value.newPassword
    || isResettingPassword.value
  ) {
    return true
  }
  return false
})

const onResetPassword = form.handleSubmit(async (value) => {
  try {
    isResettingPassword.value = true

    const res = await $fetch('/api/auth/user/password/reset', {
      method: 'POST',
      body: {
        password: value.password,
        newPassword: value.newPassword,
      },
    })

    toast.success(res.message, {
      position: 'top-center',
    })

    await refreshNuxtData('user_password_setting')
    onClose()
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
    isResettingPassword.value = false
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
    @submit.prevent="onResetPassword"
  >
    <FormField
      v-slot="{ value, handleChange }"
      name="password"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-onboarding-text-300 text-sm font-medium">
          Current Password
        </FormLabel>
        <FormControl>
          <OldPassword
            :value="value as string"
            :handle-change="handleChange"
          />
        </FormControl>
        <div class="flex items-center gap-1 px-0.5 text-xs text-red-600">
          <Icon
            v-if="form.errors.value.password"
            name="lucide-circle-alert"
          />
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ value, handleChange, setErrors }"
      name="newPassword"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-onboarding-text-300 text-sm font-medium">
          New Password
        </FormLabel>
        <FormControl>
          <Password
            :value="value as string"
            :handle-change="handleChange"
            :set-errors="setErrors"
          />
        </FormControl>
        <div class="flex items-center gap-1 px-0.5 text-xs text-red-600">
          <Icon
            v-if="form.errors.value.newPassword"
            name="lucide-circle-alert"
          />
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
    <div class="flex flex-col items-center gap-2">
      <button
        type="submit"
        :disabled="isSubmitting"
        :class="
          cn(
            'flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
            {
              'cursor-pointer bg-brand focus:bg-brand-secondary':
                form.controlledValues.value.password
                && !form.errors.value.password
                && form.controlledValues.value.newPassword
                && !form.errors.value.newPassword,
              'cursor-not-allowed bg-[#9e8cce]':
                !form.controlledValues.value.password
                || form.errors.value.password
                || !form.controlledValues.value.newPassword
                || form.errors.value.newPassword
                || isResettingPassword,
            },
          )
        "
      >
        <Loader
          v-if="isResettingPassword"
          class="size-5 animate-spin"
        />
        Setup Password
      </button>
      <Button
        type="button"
        :disabled="isResettingPassword"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        @click="onClose"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
