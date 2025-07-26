<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import ProfileAvatar from './ProfileAvatar.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

const profileInfoSchema = toTypedSchema(
  z.object({
    first_name: z
      .string()
      .min(1, 'Firstname is required')
      .max(100, 'Firstname must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s-'']+$/,
        'Firstname can only contain letters, spaces, hyphens, and apostrophes',
      )
      .transform(name => name.trim()),
    last_name: z
      .string()
      .min(1, 'Lastname is required')
      .max(100, 'Lastname must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s-'']+$/,
        'Lastname can only contain letters, spaces, hyphens, and apostrophes',
      )
      .transform(name => name.trim()),
  }),
)

const { user, fetch: fetchUserSession } = useUserSession()

const form = useForm({
  validationSchema: profileInfoSchema,
})

const isUpdatingProfile = ref(false)
const isUploadingImage = ref(false)
const selectedProfileImage = ref<string | null>(null)

const updateProfileAvatar = (avatarStr: string | null): void => {
  selectedProfileImage.value = avatarStr
}

const uploadImageToCloudinary = async (image: string): Promise<string> => {
  isUploadingImage.value = true
  try {
    const res = await $fetch('/api/workspace/upload', {
      method: 'POST',
      body: { image },
    })

    return res.url
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    throw new Error(errorMessage)
  }
  finally {
    isUploadingImage.value = false
  }
}

const onSubmit = form.handleSubmit(async (value) => {
  isUpdatingProfile.value = true
  try {
    let avatar: string = user.value ? user.value.avatar : ''
    if (selectedProfileImage.value) {
      avatar = await uploadImageToCloudinary(selectedProfileImage.value)
    }

    const res = await $fetch(`/api/auth/user/profile/update`, {
      method: 'PATCH',
      body: {
        username: `${value.first_name} ${value.last_name}`,
        image: avatar,
      },
    })

    const newUsername = res.user?.name?.split(' ') as string[]

    form.resetForm()
    selectedProfileImage.value = null
    await fetchUserSession()
    form.setFieldValue('first_name', newUsername[0])
    form.setFieldValue('last_name', newUsername[1])

    return toast.success(res.message, {
      position: 'top-center',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

onMounted(() => {
  if (user.value) {
    const username = user.value?.username?.split(' ') as string[]
    form.setFieldValue('first_name', username[0])
    form.setFieldValue('last_name', username[1])
  }
})
</script>

<template>
  <div class="grid gap-5 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d]">
    <div>
      <h1 class="text-base font-medium">
        Profile Details
      </h1>
      <p class="max-w-xl text-balance text-sm text-muted-foreground">
        Update your profile info details.
      </p>
    </div>
    <form
      class="flex flex-col items-center gap-3 md:max-w-2xl md:flex-row md:gap-5"
      @submit="onSubmit"
    >
      <ProfileAvatar
        :is-updating-workspace="isUpdatingProfile"
        :update-workspace-avatar="updateProfileAvatar"
        :avatar="user?.avatar!"
        :selected-workspace-image="selectedProfileImage"
      />
      <div class="flex w-full flex-col gap-2 self-start md:flex-row md:items-start md:gap-3">
        <div class="flex flex-col gap-x-4 gap-y-2 md:w-full md:max-w-xl md:flex-row md:items-center">
          <FormField
            v-slot="{ componentField }"
            name="first_name"
          >
            <FormItem class="w-full">
              <FormLabel
                :class="cn(
                  'text-sm font-medium',
                  !form.controlledValues.value.first_name && 'after:ml-0.5 after:text-red-500 after:content-[\'*\']',
                )"
              >
                First name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Acme Inc"
                  v-bind="componentField"
                  :disabled="form.isSubmitting && isUpdatingProfile"
                  class="block w-full rounded-md border-[0.5px] border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-zinc-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="last_name"
          >
            <FormItem class="w-full">
              <FormLabel
                :class="cn(
                  'text-sm font-medium',
                  !form.controlledValues.value.last_name && 'after:ml-0.5 after:text-red-500 after:content-[\'*\']',
                )"
              >
                Last name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Acme Inc"
                  v-bind="componentField"
                  :disabled="form.isSubmitting && isUpdatingProfile"
                  class="block w-full rounded-md border-[0.5px] border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-zinc-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <Button
          v-if="(user?.username?.split(' ')[0]?.trim() !== form.controlledValues.value.first_name?.trim())
            || (user?.username?.split(' ')[1]?.trim() !== form.controlledValues.value.last_name?.trim())
            || selectedProfileImage"
          :class="cn(
            'w-full md:w-fit shrink-0 border-0 bg-brand text-white hover:text-white hover:bg-brand-secondary dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground',
            form.errors.value.first_name || form.errors.value.last_name ? 'cursor-not-allowed' : 'cursor-pointer',
            'self-end',
          )"
          size="sm"
          variant="outline"
          type="submit"
          :disabled="!form.controlledValues.value || isUpdatingProfile || form.errors.value.first_name || form.errors.value.last_name"
        >
          <Loader2
            v-if="isUpdatingProfile"
            class="size-4 animate-spin"
          />
          <Icon
            v-else
            name="solar:cloud-upload-outline"
            class="size-4"
          />
          Save
        </Button>
      </div>
    </form>
  </div>
</template>
