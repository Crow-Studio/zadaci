<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Label } from '~/components/ui/label'

const props = defineProps<{
  handleChange: (e: Event | unknown, shouldValidate?: boolean) => void
  value: string | undefined
  isUploadImg: boolean
  setIsUploadImg: (payload: boolean) => void
}>()

const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]

  const reader = new FileReader()

  reader.onload = async () => {
    const result = reader.result
    if (!result) return

    const imgString = typeof result === 'string' ? result : result.toString()
    try {
      props?.setIsUploadImg(true)
      const res = await $fetch('/api/workspace/upload', {
        method: 'POST',
        body: {
          image: imgString,
        },
      })
      props?.handleChange(res.url)
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
      props?.setIsUploadImg(false)
    }
  }

  reader.readAsDataURL(file)
}

const clearImage = () => {
  props?.handleChange('')
}
</script>

<template>
  <div>
    <div
      v-if="props?.isUploadImg"
      className="size-20 mx-auto border-peer-primary rounded-full bg-slate-200 animate-pulse"
    />
    <div
      v-else-if="props.value"
      class="relative mx-auto size-20"
    >
      <Avatar class="h-20 w-auto border-2 border-muted-foreground">
        <AvatarImage
          :src="props.value"
          alt="uploaded-img"
        />
        <AvatarFallback class="flex flex-col items-center">
          PS
        </AvatarFallback>
      </Avatar>
      <button
        class="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm hover:bg-rose-400"
        @click="clearImage"
      >
        <X class="size-4" />
      </button>
    </div>
    <div
      v-else
      class="col-span-full"
    >
      <Label
        for="imageUrl"
        class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 p-3 hover:cursor-pointer dark:border-gray-500"
      >
        <div class="text-center">
          <svg
            class="mx-auto size-6 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>

          <div class="mt-4 flex items-center justify-center text-sm leading-6">
            <div
              class-name="relative cursor-pointer rounded-md bg-white dark:bg-transparent font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-600 dark:focus:rin-0 focus-within:ring-offset-2 hover:text-gray-500 dark:text-white"
            >
              <span>Click to upload a file</span>
              <input
                id="imageUrl"
                name="imageUrl"
                type="file"
                class="sr-only"
                accept="image/png, image/jpeg"
                @change="handleImageUpload"
              >
            </div>
          </div>
          <p class="text-xs leading-5 text-muted-foreground">
            PNG or JPG
          </p>
        </div>
      </Label>
    </div>
  </div>
</template>
