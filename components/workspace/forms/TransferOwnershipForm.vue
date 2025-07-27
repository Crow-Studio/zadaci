<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Avatar, AvatarImage } from '~/components/ui/avatar'

interface Teammate {
  id: string
  username: string | null
  avatar: string | null
  email: string
}

const props = defineProps<{
  onClose: () => void
  teammates: Teammate[]
}>()

const isTransferringOwnership = ref(false)

const onTransferOwnership = async () => {
  try {
    isTransferringOwnership.value = true
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
    isTransferringOwnership.value = false
  }
}
</script>

<template>
  <div class="grid gap-2">
    <div class="space-y-2">
      <Label for="select-40">
        {{ props?.teammates.length > 1 ? 'Teammates' : 'Teammate' }}
      </Label>
      <Select
        :disabled="isTransferringOwnership"
        :default-value="props?.teammates[0]?.id"
      >
        <SelectTrigger
          id="select-40"
          class="h-auto ps-2 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
        >
          <SelectValue placeholder="Select a teammate" />
        </SelectTrigger>
        <SelectContent
          class="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
        >
          <SelectItem
            v-for="teammate in props?.teammates"
            :key="teammate.id"
            :value="teammate.id"
            class="**:data-desc:hidden"
          >
            <span class="flex items-center gap-2">
              <Avatar
                size-10
                rounded-full
                object-cover
              >
                <AvatarImage
                  :src="teammate.avatar!"
                  :alt="teammate.username!"
                />
              </Avatar>
              <span>
                <span class="block font-medium">{{ teammate.username }}</span>
                <span class="sr-only"> : </span>
                <span class="mt-0.5 block text-xs text-muted-foreground">{{ teammate.email }}</span>
              </span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="grid gap-1.5">
      <Button
        class="gap-.1.5 w-full bg-brand text-white hover:bg-brand-secondary"
        :disabled="isTransferringOwnership"
        @click="onTransferOwnership"
      >
        <Loader2
          v-if="isTransferringOwnership"
          class="size-5 animate-spin"
        />
        <Icon
          v-else
          name="hugeicons:square-arrow-data-transfer-horizontal"
          class="size-5"
        />
        Transfer ownership
      </Button>
      <Button
        type="button"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        :disabled="isTransferringOwnership"
        @click="props?.onClose"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
