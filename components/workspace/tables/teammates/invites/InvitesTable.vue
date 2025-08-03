<script setup lang="ts">
import { ServerCrash } from 'lucide-vue-next'
import { columns } from './columns'
import DataTable from './DataTable.vue'
import SkeletonLoading from '~/components/workspace/global/SkeletonLoading.vue'

const workspaceStore = useWorkspaceStore()

const currentActiveWorkspace = computed(() => {
  return workspaceStore.activeWorkspace
})

const { data: rawInvites, status } = await useAsyncData('workspace_team_invites', () => useRequestFetch()(`/api/workspace/${currentActiveWorkspace.value?.id}/teammates/team-invite/sent`), {
  watch: [() => currentActiveWorkspace.value?.id || ''],
})

const invites = computed(() =>
  (rawInvites.value ?? []).map((invite: any) => ({
    id: invite.id,
    status: invite.status,
    email: invite.email,
    workspaceId: invite.workspace_id,
    createdAt: invite.created_at,
    updatedAt: invite.updated_at,
    expiresAt: invite.expires_at,
    role: invite.role,
    invitedBy: invite.invited_by,
    user: invite.user,
  })),
)
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
      v-else-if="status ==='success' && invites"
      :columns="columns"
      :data="invites"
    />
  </div>
</template>
