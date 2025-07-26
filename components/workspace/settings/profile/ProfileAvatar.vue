<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<FileList | null>(null)
const fileName = ref<string | null>(null)
const previewUrl = ref<string | null>(null)

const props = defineProps<{
  updateWorkspaceAvatar: (avatarStr: string | null) => void
  isUpdatingWorkspace: boolean
  avatar: string
  selectedWorkspaceImage: string | null
}>()

watch(files, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    fileName.value = newFiles[0]?.name ?? null
    previewUrl.value = newFiles[0] ? URL.createObjectURL(newFiles[0]) : null
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        props.updateWorkspaceAvatar(reader.result)
      }
    }
    if (newFiles[0]) {
      reader.readAsDataURL(newFiles[0])
    }
  }
})

const handleRemove = () => {
  fileName.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
  props.updateWorkspaceAvatar(null)
}
</script>

<template>
  <div class="flex shrink-0 items-center space-y-1">
    <button type="button">
      <div class="flex flex-col items-center justify-between">
        <div class="relative">
          <div class="size-14 overflow-hidden">
            <img
              class="absolute inset-0 size-full rounded-full border border-purple-200 object-cover"
              :src="previewUrl ? previewUrl : props.avatar"
              alt="Preview of uploaded file"
            >
          </div>
          <Button
            v-if="props.selectedWorkspaceImage"
            :disabled="props.isUpdatingWorkspace"
            size="icon"
            variant="destructive"
            class="absolute -right-1 -top-1 size-6 rounded-full border-2 border-background"
            aria-label="Remove image"
            @click="handleRemove"
          >
            <X :size="16" />
          </Button>
        </div>
        <Label
          for="img_profile"
          class="cursor-pointer pt-1 text-sm font-medium hover:text-muted-foreground"
        >
          Choose image
          <input
            id="img_profile"
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            aria-label="Upload profile image"
            :disabled="props.isUpdatingWorkspace"
            @change="(e: Event) => (files = (e.target as HTMLInputElement).files)"
          >
        </Label>
      </div>
    </button>
  </div>
</template>
