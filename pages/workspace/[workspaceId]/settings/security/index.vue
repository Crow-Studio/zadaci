<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import CurrentSessions from '~/components/workspace/settings/security/CurrentSessions.vue'
import MFA from '~/components/workspace/settings/security/MFA.vue'
import Password from '~/components/workspace/settings/security/Password.vue'

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
    ? `${currentActiveWorkspace.value?.name} - Settings General`
    : 'Settings General',
})

defineOgImageComponent('Zadaci', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Settings General` : 'Settings General',
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
          name: 'Settings',
          path: `/workspace/${currentActiveWorkspace.value?.id}/settings/general`,
          children: [
            {
              name: 'General',
              path: `/workspace/${currentActiveWorkspace.value?.id}/settings/general`,
              children: null,
            },
          ],
        },
      ],
    })
  }
})
</script>

<template>
  <section class="grid gap-4 mb-4">
    <div>
      <h1 class="text-xl font-medium">
        Security & Authentication
      </h1>
      <p class="max-w-xl text-balance text-muted-foreground">
        Our platform guarantees that your account is secured with measures in place.
      </p>
    </div>
    <div
      v-if="status ==='idle' || status === 'pending'"
      class="min-h-[70vh] grid place-content-center"
    >
      <div class="flex items-center gap-x-2 text-muted-foreground text-sm">
        <Loader2 class="animate-spin size-5" />
      </div>
    </div>
    <div
      v-else
      class="grid gap-3.5"
    >
      <Password />
      <CurrentSessions />
      <MFA />
    </div>
  </section>
</template>
