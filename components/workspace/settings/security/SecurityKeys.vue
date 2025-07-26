<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'

const props = defineProps<{
  status: AsyncDataRequestStatus
  encodedCredentialUserId: string
  encodedCredentialIds: string[]
}>()
</script>

<template>
  <div class="rounded-xl border p-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-medium">
          Security Keys {{ props.status }}
        </h2>
        <p class="max-w-full text-balance text-sm text-muted-foreground">
          You can use a small device that plugs into your computer or phone. Just tap it when asked — that’s it!
        </p>
      </div>
    </div>
    <div>
      {{ props?.encodedCredentialIds }} {{ props?.encodedCredentialUserId }}
    </div>
  </div>
</template>
