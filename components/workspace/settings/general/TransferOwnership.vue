<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import TransferOwnershipForm from '../../forms/TransferOwnershipForm.vue'
import { Button } from '~/components/ui/button'

const workspaceStore = useWorkspaceStore()
const modalStore = useModalStore()

const activeWorkspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const { data: teammates, status } = await useAsyncData('workspace_teammate_exclude_user', () => useRequestFetch()(`/api/workspace/${activeWorkspace.value?.id}/teammates/exclude-user`), {
  watch: [() => activeWorkspace.value?.id || ''],
})

const onHelpMeOut = () => {
  onClose()
  return navigateTo(`/workspace/${activeWorkspace.value?.id}/help-center`)
}

const onInviteTeammates = () => {
  onClose()
  return navigateTo(`/workspace/${activeWorkspace.value?.id}/settings/users`)
}

const onClose = () => {
  modalStore?.onClose()
  modalStore?.setIsOpen(false)
}
</script>

<template>
  <div>
    <div
      v-if="status ==='idle' || status ==='pending'"
      class="grid place-content-center"
    >
      <div class="flex flex-col items-center gap-1 text-sm">
        <Loader2 class="size-8 animate-spin" />
        <p>Loading data</p>
      </div>
    </div>
    <div
      v-else-if="status ==='error'"
      class="grid gap-3"
    >
      <p class="text-sm">
        An error occured while fetching workspace teammates data. Please close the dialog and re-open, if the issue persists seek support in the Help Center.
      </p>

      <div class="grid gap-2">
        <Button
          class="w-full bg-brand text-white hover:bg-brand-secondary"
          @click="onHelpMeOut"
        >
          Help Center
        </Button>
        <Button
          type="button"
          variant="ghost"
          class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
          @click="onClose"
        >
          Cancel
        </Button>
      </div>
    </div>
    <div v-else>
      <TransferOwnershipForm
        v-if="teammates && teammates.length > 0"
        :on-close="onClose"
        :teammates="teammates"
      />
      <div
        v-else
        class="grid gap-3"
      >
        <p class="text-sm">
          Currently there aren't any teammates in the workspace. Kindly invite atleast one to be able to complete workspace ownership transfer.
        </p>

        <div class="grid gap-2">
          <Button
            class="w-full bg-brand text-white hover:bg-brand-secondary cursor-pointer"
            @click="onInviteTeammates"
          >
            Invite Teammates
          </Button>
          <Button
            type="button"
            variant="ghost"
            class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all cursor-pointer"
            @click="onClose"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
