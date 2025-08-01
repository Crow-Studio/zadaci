<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import DeleteAccount from '~/components/workspace/settings/profile/DeleteAccount.vue'
import UserProfile from '~/components/workspace/settings/profile/UserProfile.vue'

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
    ? `${currentActiveWorkspace.value?.name} - Settings Profile`
    : 'Settings Profile',
})

defineOgImageComponent('Zadaci', {
  title: currentActiveWorkspace.value ? `${currentActiveWorkspace.value?.name} - Settings Profile` : 'Settings Profile',
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
              name: 'Profile',
              path: `/workspace/${currentActiveWorkspace.value?.id}/settings/profile`,
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
  <section class="space-y-4">
    <div>
      <h1 class="text-xl font-medium">
        Profile Settings
      </h1>
      <p class="max-w-2xl text-muted-foreground">
        Manage your details and preferences in your profile settings.
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
      class="space-y-3"
    >
      <UserProfile />
      <DeleteAccount />
    </div>
  </section>
</template>
