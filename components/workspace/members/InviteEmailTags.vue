<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Input } from '~/components/ui/input'
import { isValidEmail } from '~/lib/utils'

const props = defineProps<{
  isSendingInvites: boolean
  emailTags: string[]
  setEmailTags: (tags: string[]) => void
}>()

const inputValue = ref('')

const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key

  if (key === 'Enter') {
    const value = inputValue.value.trim()
    if (!value) {
      inputValue.value = ''
      return toast.error('Email is required!', { position: 'top-center' })
    }
  }

  if (['Enter', ',', ' '].includes(key)) {
    e.preventDefault()
    const value = inputValue.value.trim()

    if (!value) {
      inputValue.value = ''
      return toast.error('Email is required!', { position: 'top-center' })
    }

    if (!isValidEmail(value)) {
      inputValue.value = ''
      return toast.error('Invalid email format!', { position: 'top-center' })
    }

    if (props.emailTags.includes(value)) {
      inputValue.value = ''
      return toast.info(`${value} has already been added!`, {
        position: 'top-center',
      })
    }

    props.setEmailTags([...props.emailTags, value])
    inputValue.value = ''
  }
  else if (key === 'Backspace' && !inputValue.value && props.emailTags.length > 0) {
    props.setEmailTags(props.emailTags.slice(0, -1))
  }
}

const removeTag = (index: number) => {
  props.setEmailTags(props.emailTags.filter((_, i) => i !== index))
}
</script>

<template>
  <div class="min-h-32 w-full rounded-md border transition-colors focus-within:border-purple-400 dark:focus-within:border-primary">
    <div class="flex w-full flex-wrap">
      <div
        v-if="props.emailTags.length > 0"
        class="flex w-full flex-wrap gap-2 rounded-t-md bg-purple-50 p-2 dark:bg-muted"
      >
        <div
          v-for="(tag, index) in props.emailTags"
          :key="index"
          class="flex items-center text-sm text-purple-600 dark:text-primary"
        >
          <span>{{ tag }}</span>
          <button
            :disabled="props.isSendingInvites"
            class="ml-1 text-purple-400 hover:text-purple-600 dark:text-primary dark:hover:text-muted-foreground"
            @click="removeTag(index)"
          >
            <X class="size-3" />
          </button>
        </div>
      </div>
      <Input
        v-model="inputValue"
        :disabled="props.isSendingInvites"
        type="email"
        placeholder="enter email, press ',' or spacebar or enter key to add."
        class="w-full border-0 bg-transparent px-3 py-2 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        @keydown="handleKeyDown"
      />
    </div>
  </div>
</template>
