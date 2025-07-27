<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import Password from '../global/Password.vue'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { setupPasswordSchema } from '~/types/forms/schema'

const modalStore = useModalStore()

const form = useForm({
  validationSchema: setupPasswordSchema,
})

const isSettingupPassowrd = ref(false)

const isSubmitting = computed(() => {
  if (
    !form.controlledValues.value.password
    || form.errors.value.password
    || isSettingupPassowrd.value
  ) {
    return true
  }
  return false
})

const onSetupPassword = form.handleSubmit(async (value) => {
  try {
    isSettingupPassowrd.value = true

    const res = await $fetch('/api/auth/user/password/setup', {
      method: 'POST',
      body: {
        password: value.password,
      },
    })

    toast.success(res.message, {
      position: 'top-center',
    })

    await refreshNuxtData('user_password_setting')
    onClose()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isSettingupPassowrd.value = false
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
    @submit.prevent="onSetupPassword"
  >
    <FormField
      v-slot="{ value, handleChange, setErrors }"
      name="password"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-onboarding-text-300 text-sm font-medium">
          Password
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
            v-if="form.errors.value.password"
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
                && !form.errors.value.password,
              'cursor-not-allowed bg-[#9e8cce]':
                !form.controlledValues.value.password
                || form.errors.value.password
                || isSettingupPassowrd,
            },
          )
        "
      >
        <Loader
          v-if="isSettingupPassowrd"
          class="size-5 animate-spin"
        />
        Setup Password
      </button>
      <Button
        type="button"
        :disabled="isSettingupPassowrd"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        @click="onClose"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
