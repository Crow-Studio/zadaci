<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { twoFactorSetupSchema } from '~/types'
import { Button } from '~/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  PinInput,
  PinInputGroup,
} from '~/components/ui/pin-input'

const props = defineProps<{
  onClose(): void
}>()

const { fetch: fetchUserSession } = useUserSession()

const isTwoFactorSetup = ref(false)

const form = useForm({
  validationSchema: twoFactorSetupSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isTwoFactorSetup.value = true

    const res = await $fetch('/api/auth/user/2fa/totp/verify', {
      method: 'POST',
      body: {
        code: values.code.join(''),
      },
    })

    onCancel()

    toast.success(res.message, {
      position: 'top-center',
    })

    await fetchUserSession()

    return navigateTo('/workspace/dashboard')
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
    isTwoFactorSetup.value = false
  }
})

function onCancel() {
  form.resetForm()
  props?.onClose()
}
</script>

<template>
  <form
    class="space-y-2"
    @submit="onSubmit"
  >
    <div>
      <FormField
        v-slot="{ componentField, value }"
        name="code"
      >
        <FormItem>
          <div class="space-y-2">
            <FormLabel class="flex items-center justify-center text-base">
              Enter the generated code for verification
            </FormLabel>
            <FormControl>
              <PinInput
                id="pin-input"
                :model-value="value"
                placeholder="○"
                class="flex items-center justify-center gap-2"
                otp
                type="text"
                :name="componentField.name"
                @update:model-value="(arrStr) => {
                  form.setFieldValue('code', arrStr.filter(Boolean))
                }"
              >
                <PinInputGroup>
                  <PinInputInput
                    v-for="(id, index) in 6"
                    :key="id"
                    :index="index"
                  />
                </PinInputGroup>
              </PinInput>
            </FormControl>
            <div class="flex items-center justify-center gap-1 px-0.5 text-xs text-red-600">
              <Icon
                v-if="form.errors.value.code"
                name="lucide-circle-alert"
              />
              <FormMessage />
            </div>
          </div>
        </FormItem>
      </FormField>
    </div>
    <div class="space-y-1.5">
      <Button
        :disabled="isTwoFactorSetup"
        type="submit"
        class="w-full gap-2 bg-brand hover:bg-brand-secondary"
      >
        <Loader
          v-if="isTwoFactorSetup"
          class="size-5 animate-spin"
        />
        Authenticate
      </Button>
      <Button
        type="button"
        class="w-full"
        variant="outline"
        :disabled="isTwoFactorSetup"
        @click="onCancel"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
