<script setup lang="ts">
import { Button } from '~/components/ui/button'

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})
</script>

<template>
  <div
    class="grid min-h-[70vh] place-content-center"
  >
    <div class="flex w-full max-w-lg flex-col items-center gap-3 text-center">
      <SvgsZadaci class="size-16" />
      <div class="space-y-2">
        <h2 class="text-xl font-bold">
          You've stumbled on a resticted space
        </h2>
        <div class="text-sm text-muted-foreground">
          <p class="text-balance">
            There is nothing for you to see here, so let's get you back to where you came from.
          </p>
          <p class="text-balance">
            If you think this is a mistake, or need to gain access, <br> please <strong>contact your admin</strong> for assistance.
          </p>
        </div>
        <div>
          <Button class="group h-8 w-full max-w-xs bg-brand hover:bg-brand-secondary dark:text-primary">
            Request Access
            <Icon
              name="hugeicons:square-lock-password"
              class="size-5 transition-transform group-hover:scale-125"
            />
          </Button>
          <Button
            variant="outline"
            class="group mt-1.5 h-8 w-full max-w-xs"
            @click="navigateTo(`/workspace/${currentActiveWorkspace?.id}/dashboard`)"
          >
            Go to Dashboard
            <Icon
              name="solar:arrow-right-outline"
              class="size-5 -rotate-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
