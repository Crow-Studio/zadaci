<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import ResendCodeButton from '../ResendCodeButton.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { cn } from '~/lib/utils'
import { signinFormSchema } from '~/types'

const props = defineProps<{
  email: string
  onResetForm: (params: { mail: string, codeSent: boolean }) => void
}>()

const isSigningUp = ref(false)
const apiUrl = ref('/api/auth/signup/send-unique-code')

const { fetch: refreshSession } = useUserSession()

const form = useForm({
  validationSchema: signinFormSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isSigningUp.value = true

    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: props.email,
        code: values.code,
      },
    })

    props?.onResetForm({
      mail: '',
      codeSent: false,
    })

    toast.success(res.message, {
      position: 'top-center',
    })

    await refreshSession()
    return navigateTo('/workspace/onboarding')
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
    isSigningUp.value = false
  }
})

function onClear() {
  props?.onResetForm({
    mail: '',
    codeSent: false,
  })
  form.resetForm()
  const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
  const codeInput = document.querySelector('input[name="code"]') as HTMLInputElement

  if (emailInput) {
    emailInput.value = ''
  }
  else if (codeInput) {
    codeInput.value = ''
  }
}
</script>

<template>
  <form
    class=" space-y-2"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-1">
      <div class="space-y-1">
        <label class="text-sm block font-medium">Email</label>
        <div
          :class="cn(
            'border rounded-md relative flex items-center',
            form.errors.value.code && 'border-red-300',
          )"
        >
          <input
            name="email"
            type="text"
            placeholder="name@example.com"
            :value="props.email"
            disabled
            class="block h-[46px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:outline-none"
          >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute right-3 size-5 rounded-full bg-background hover:cursor-pointer"
            @click="onClear"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
      </div>
      <FormField
        v-slot="{ componentField }"
        name="code"
      >
        <FormItem>
          <FormLabel class="text-sm font-medium">
            Code
          </FormLabel>
          <FormControl>
            <div
              :class="cn(
                'border rounded-md',
                form.errors.value.code && 'border-red-300',
              )"
            >
              <input
                type="text"
                autocomplete="off"
                placeholder="gets-sets-flys"
                v-bind="componentField"
                class="block h-[46px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:bg-none focus:outline-none active:bg-transparent"
              >
            </div>
          </FormControl>
          <div class="flex items-center gap-1 px-0.5 text-xs text-red-600">
            <Icon
              v-if="form.errors.value.code"
              name="lucide lucide-circle-alert"
            />
            <FormMessage />
          </div>
          <div class="flex w-full items-center justify-between pt-1">
            <p class="flex items-center gap-1 text-xs font-medium text-green-700">
              <Icon
                name="lucide lucide-circle-check"
              />
              Paste the code sent to your email
            </p>
            <ResendCodeButton
              :email="props?.email"
              :api-url="apiUrl"
            />
          </div>
        </FormItem>
      </FormField>
    </div>
    <button
      type="submit"
      :disabled="!!form.controlledValues.value.code === false || !!form.errors.value.code || !!isSigningUp"
      :class="cn(
        'flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
        {
          'cursor-pointer bg-brand focus:bg-brand-secondary': !form.errors.value.code && form.controlledValues.value.code,
          'cursor-not-allowed bg-brand-secondary': !form.controlledValues.value.code || form.errors.value.code || isSigningUp,

        },
      )"
    >
      <Loader
        v-if="isSigningUp"
        class="size-5 animate-spin"
      />
      Continue
    </button>
  </form>
</template>
