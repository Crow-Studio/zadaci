<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import Password from './Password.vue'
import UserAvatar from './UserAvatar.vue'
import { onboardingProfileSchema } from '~/types'
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

const isUpdatingProfile = ref(false)
const isUploadingImage = ref(false)
const password = ref('')
const selectedAvatar = ref<string | null>(null)

const updatePassword = (passStr: string) => {
  password.value = passStr
}

const form = useForm({
  validationSchema: onboardingProfileSchema,
})

const updateUserAvatar = (avatarStr: string) => {
  selectedAvatar.value = avatarStr
}

const { user, fetch: fetchUserSession } = useUserSession()

onMounted(() => {
  if (user.value && user.value.username) {
    form.setFieldValue('first_name', user.value.username?.split(' ')[0])
    form.setFieldValue('last_name', user.value.username?.split(' ')[1])
  }
})

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

const onSubmit = form.handleSubmit(async (values) => {
  isUpdatingProfile.value = true
  try {
    let avatar: string = user.value ? user.value.avatar : ''

    if (selectedAvatar.value) {
      avatar = (await uploadImageToCloudinary(selectedAvatar.value)) || ''
    }

    await $fetch('/api/workspace/user/update', {
      method: 'POST',
      body: {
        username: `${values.first_name} ${values.last_name}`,
        avatar,
        password: password.value,
      },
    })

    await fetchUserSession()
    props.onSetCurrentStep(2)
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
    isUpdatingProfile.value = false
  }
})
</script>

<template>
  <form
    class="mx-auto mt-2 w-full space-y-4 sm:w-96"
    @submit="onSubmit"
  >
    <UserAvatar
      :is-updating-profile="isUpdatingProfile"
      :update-user-avatar="updateUserAvatar"
    />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        v-slot="{ componentField }"
        name="first_name"
      >
        <FormItem class="self-start">
          <FormLabel class="text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']">
            Firstname
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="John"
              v-bind="componentField"
              :disabled="form.isSubmitting && isUpdatingProfile"
              class="placeholder:text-custom-text-400 border-onboarding-border-100 block w-full rounded-md border-[0.5px] bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="last_name"
      >
        <FormItem class="self-start">
          <FormLabel class="text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']">
            Lastname
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Doe"
              :disabled="form.isSubmitting && isUpdatingProfile"
              v-bind="componentField"
              class="placeholder:text-custom-text-400 border-onboarding-border-100 block w-full rounded-md border-[0.5px] bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <Password
      :is-updating-profile="isUpdatingProfile"
      :update-password="updatePassword"
    />
    <button
      type="submit"
      :disabled="isUpdatingProfile"
      class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:bg-brand-secondary focus:bg-brand-secondary cursor-pointer"
    >
      <Loader2
        v-if="isUpdatingProfile"
        class="size-5 animate-spin"
      />
      Continue
    </button>
  </form>
</template>
