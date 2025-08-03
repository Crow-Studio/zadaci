<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import InviteEmailTags from '../members/InviteEmailTags.vue'

const props = defineProps<{
  onClose: () => void
  workspaceId: string
}>()

const emailTags = ref<string[]>([])
const isSendingInvites = ref(false)

const onSetEmailTags = (tags: string[]) => {
  emailTags.value = tags
}

const onSendInvite = async () => {
  isSendingInvites.value = true
  try {
    const teammates = emailTags.value.map((email) => {
      return {
        role: 'MEMBER',
        email,
      }
    })
    const res = await $fetch(`/api/workspace/${props.workspaceId}/teammates/team-invite/send`, {
      method: 'POST',
      body: {
        teammates,
      },
    })

    await refreshNuxtData('workspace_team_invites')
    props.onClose()

    toast.success(res.message, {
      position: 'top-center',
    })
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
    isSendingInvites.value = false
  }
}
</script>

<template>
  <div className="space-y-3">
    <div class="grid gap-2">
      <p class="text-center text-sm text-muted-foreground">
        New members will have <strong>member</strong> role permissions in the workspace, but you can change this
        later in the <strong>members</strong> page.
      </p>
      <InviteEmailTags
        :email-tags="emailTags"
        :is-sending-invites="isSendingInvites"
        :set-email-tags="onSetEmailTags"
      />
    </div>
    <div class="grid gap-2">
      <Button
        :disabled="isSendingInvites || emailTags.length <= 0"
        class="flex w-full gap-2 bg-brand hover:bg-brand-secondary dark:bg-primary dark:hover:bg-zinc-300"
        @click="onSendInvite"
      >
        <Loader
          v-if="isSendingInvites"
          class="size-5 animate-spin"
        />
        <Icon
          v-else
          name="solar:mailbox-outline"
          class-name="size-5"
        />
        Send invite
      </Button>
      <Button
        type="button"
        :disabled="isSendingInvites"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        @click="props?.onClose"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
