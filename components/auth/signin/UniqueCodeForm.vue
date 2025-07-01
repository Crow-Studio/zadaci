<script setup lang="ts">
import { AlertCircleIcon, Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { cn } from '~/lib/utils'
import { sendUniqueCodeSchema } from '~/types'

const oauthStore = useOauthStore()

const oauth = computed(() => {
  return oauthStore?.oauth
})

const props = defineProps<{
  onResetForm: (params: { mail: string, codeSent: boolean }) => void
}>()

const isSendingCode = ref(false)

const sendUniqueCodeForm = useForm({
  validationSchema: sendUniqueCodeSchema,
})

const onSendUniqueCode = sendUniqueCodeForm.handleSubmit(async (values) => {
  try {
    isSendingCode.value = true

    const res = await $fetch('/api/auth/signin/send-unique-code', {
      method: 'POST',
      body: {
        email: values.email,
      },
    })

    props?.onResetForm({
      mail: values.email,
      codeSent: true,
    })

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
    isSendingCode.value = false
  }
})
</script>

<template>
  <form
    class="mt-5 space-y-4"
    @submit.prevent="onSendUniqueCode"
  >
    <FormField
      v-slot="{ componentField }"
      name="email"
    >
      <FormItem class="space-y-1">
        <FormLabel class="text-sm font-medium">
          Email
        </FormLabel>
        <FormControl>
          <div
            :class="cn(
              'border rounded-md',
              sendUniqueCodeForm.errors.value.email && 'border-red-300',
            )"
          >
            <input
              type="text"
              placeholder="name@example.com"
              v-bind="componentField"
              :disabled="sendUniqueCodeForm.isSubmitting.value || oauth.isSigninWithOauth"
              class="block h-[46px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:bg-none focus:outline-none active:bg-transparent placeholder:text-muted-foreground"
            >
          </div>
        </FormControl>
        <div class="flex items-center gap-1 px-0.5 text-xs text-red-600">
          <AlertCircleIcon
            v-if="sendUniqueCodeForm.errors.value.email"
            class="size-5"
          />
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
    <button
      type="submit"
      :disabled="!!sendUniqueCodeForm.controlledValues.value.email === false || !!sendUniqueCodeForm.errors.value.email || !!isSendingCode || oauth.isSigninWithOauth"
      :class="cn(
        'flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
        {
          'cursor-pointer bg-brand focus:bg-brand-secondary': sendUniqueCodeForm.controlledValues.value.email && !sendUniqueCodeForm.errors.value.email,
          'cursor-not-allowed bg-brand-secondary': !sendUniqueCodeForm.controlledValues.value.email || sendUniqueCodeForm.errors.value.email || isSendingCode,
        },
      )"
    >
      <Loader
        v-if="isSendingCode"
        class="size-5 animate-spin"
      />
      Continue
    </button>
  </form>
</template>
