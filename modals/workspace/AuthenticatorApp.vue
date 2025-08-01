<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
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
  PinInputSlot,
} from '~/components/ui/pin-input'
import { twoFactorSetupSchema } from '~/types'

const modalStore = useModalStore()
const { fetch: fetchUserSession } = useUserSession()

const isModalOpen = computed(() => {
  return modalStore?.type === 'setupAuthenticatorApp' && modalStore?.isOpen
})

const qrcode = computed(() => {
  return modalStore?.data?.qrcode
})

const encodedTOTPKey = computed(() => {
  return modalStore?.data?.encodedTOTPKey
})

const isTwoFactorSetup = ref(false)

const form = useForm({
  validationSchema: twoFactorSetupSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isTwoFactorSetup.value = true

    const res = await $fetch('/api/auth/user/2fa/totp/setup', {
      method: 'POST',
      body: {
        encodedKey: encodedTOTPKey.value,
        code: values.code.join(''),
      },
    })

    await fetchUserSession()
    onClose()

    toast.success(res.message, {
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
    isTwoFactorSetup.value = false
  }
})

function onClose() {
  form.resetForm()
  modalStore?.setIsOpen(false)
  modalStore?.onClose()
  modalStore?.setModalData({})
}
</script>

<template>
  <AlertDialog
    :open="isModalOpen"
    @update:open="onClose"
  >
    <AlertDialogContent class="dark:bg-[#1d1d1d]">
      <AlertDialogHeader class="flex items-center justify-center">
        <AlertDialogTitle>Set up Authenticator App</AlertDialogTitle>
        <AlertDialogDescription class="text-center">
          Open Authenticator app, choose <strong class="dark:text-primary">add account</strong>, scan
          the <strong class="dark:text-primary">QR Code</strong> below and paste the code from the
          Authenticator App on the <strong class="dark:text-primary">OTP Input fields</strong> below.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="space-y-2">
        <div
          style="width: 250px; height: 250px; margin: auto"
          v-html="qrcode"
        />
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
                      class="flex items-center justify-center gap-2 dark:text-black"
                      otp
                      type="text"
                      :name="componentField.name"
                      @update:model-value="(arrStr) => {
                        form.setFieldValue('code', arrStr.filter(Boolean))
                      }"
                    >
                      <PinInputGroup>
                        <PinInputSlot
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
            <div class="hidden">
              <p class="text-sm text-muted-foreground">
                Incase of difficulties in scanning the QR Code, you can copy the below setup key and set it manually.
              </p>
              <div class="rounded-md bg-[#f1f1f1] p-3 text-center">
                <p>
                  {{ encodedTOTPKey }}
                </p>
              </div>
            </div>
          </div>
          <div class="space-y-1.5">
            <Button
              :disabled="isTwoFactorSetup"
              type="submit"
              class="w-full gap-2 bg-brand hover:bg-brand-secondary dark:text-white"
            >
              <Loader
                v-if="isTwoFactorSetup"
                class="size-5 animate-spin"
              />
              Setup Authenticator
            </Button>
            <Button
              type="button"
              class="w-full"
              variant="outline"
              :disabled="isTwoFactorSetup"
              @click="onClose"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
