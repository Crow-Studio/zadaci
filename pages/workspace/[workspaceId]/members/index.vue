<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import AccessDenied from '~/components/workspace/global/AccessDenied.vue'
import MembersTabs from '~/components/workspace/members/MembersTabs.vue'

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
    ? `${currentActiveWorkspace.value?.name} - Members`
    : 'Members',
})

defineOgImageComponent('UseOdama', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Members` : 'Members',
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
          name: 'Members',
          path: `/workspace/${currentActiveWorkspace.value?.id}/members`,
          children: null,
        },
      ],
    })
  }
})
</script>

<template>
  <section>
    <div
      v-if="currentActiveWorkspace?.userRole ==='OWNER'"
      class="grid gap-4"
    >
      <div>
        <h1 class="text-xl font-medium">
          Members Management
        </h1>
        <p class="max-w-2xl text-muted-foreground">
          Manage your team members and their account permissions access in the workspace.
        </p>
      </div>
      <div
        v-if="status ==='idle' || status ==='pending'"
        class="grid min-h-[50vh] place-content-center"
      >
        <div
          class="flex flex-col items-center gap-1"
        >
          <Loader2 class="size-8 animate-spin" />
          <p class="animate-pulse">
            Loading...
          </p>
        </div>
      </div>
      <MembersTabs v-else />
    </div>
    <AccessDenied v-else />
  </section>
</template>
