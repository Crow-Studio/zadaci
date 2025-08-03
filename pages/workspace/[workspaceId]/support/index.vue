<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import SupportWrapper from '~/components/workspace/support/SupportWrapper.vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'workspace',
})

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

useHead({
  title: currentActiveWorkspace.value
    ? `${currentActiveWorkspace.value?.name} - Support`
    : 'Support',
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Support` : 'Support',
  description:
    'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
})

const { data: workspace, status } = await useAsyncData(() => useRequestFetch()(`/api/workspace/${currentActiveWorkspace?.value?.id}/details/user-exists`))

onBeforeMount(() => {
  if (!workspace.value) {
    navigateTo('/workspace/onboarding')
  }
})

onMounted(() => {
  if (!workspace.value) {
    workspaceStore?.onSetActiveWorkspace(null)
    navigateTo('/workspace/onboarding')
  }
  else {
    workspaceStore?.onSetWorkspaceBreadcrumb({
      name: `${currentActiveWorkspace.value?.name}`,
      path: `/workspace/${currentActiveWorkspace.value?.id}/dashboard`,
      children: [
        {
          name: 'Support',
          path: `/workspace/${currentActiveWorkspace.value?.id}/support`,
          children: null,
        },
      ],
    })
  }
})
</script>

<template>
  <section class="w-full overflow-hidden">
    <div
      v-if="status === 'idle' || status === 'pending'"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-base">
        <Loader2 class="animate-spin size-5" />
      </div>
    </div>
    <div
      v-else
      class="w-full"
    >
      <!-- todo: work on the my requests and submit a request feature -->
      <!-- <div class="flex items-center gap-x-3 justify-end mb-6">
        <Button
          variant="ghost"
          class="whitespace-nowrap"
        >
          My requests
        </Button>
        <Button class="inline-flex text-sm font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2 whitespace-nowrap group duration-300 ease-in-out">
          <Icon
            name="solar:help-outline"
            class="transition-transform group-hover:rotate-180"
            size="15"
          />
          Submit a request
        </Button>
      </div> -->
      <SupportWrapper />
    </div>
  </section>
</template>
