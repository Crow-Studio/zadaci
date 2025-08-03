<script setup lang="ts">
import { ServerCrash } from 'lucide-vue-next'
import SkeletonLoading from '../../global/SkeletonLoading.vue'
import { columns } from './columns'
import DataTable from './DataTable.vue'
// import DataTable from './DataTable.vue'

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const { data: workspace, status } = await useAsyncData('workspace_teammates', () => useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/teammates`), {
  watch: [() => currentActiveWorkspace.value?.id || ''],
})
</script>

<template>
  <div>
    <SkeletonLoading v-if="status ==='pending' || status ==='idle'" />
    <div
      v-else-if="status ==='error'"
      class="rounded-lg border"
    >
      <div class="flex items-center justify-center gap-1.5 p-5 text-destructive dark:text-primary">
        <ServerCrash class="size-5" />
        Failed to load members table data.
      </div>
    </div>
    <DataTable
      v-else-if="status ==='success' && workspace"
      :columns="columns"
      :data="workspace.members!.map(member => ({
        id: member.id,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
        userId: member.user_id,
        workspaceId: member.workspace_id,
        role: member.role,
        user: {
          id: member.user.id,
          email: member.user.email,
          username: member.user.username ?? null,
          emailVerified: member.user.email_verified,
          registered2FA: member.user.registered_2fa,
          profilePictureUrl: member.user.profile_picture_url ?? null,
        },
      }))"
    />
  </div>
</template>
