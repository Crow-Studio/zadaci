<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import RoleForm from './RoleForm.vue'
import { Button } from '~/components/ui/button'
import type { ChangeTeammateRole } from '~/types'

const props = defineProps<{
  onClose: () => void
  workspaceId: string
  teammates: ChangeTeammateRole[]
}>()

const isChangingRole = ref(false)

const teammates = computed(() => {
  return props.teammates
})

const onChangeRole = async () => {
  try {
    isChangingRole.value = true

    const newTeammates = teammates.value.map(t => ({
      id: t.id,
      role: t.role,
    }))

    const res = await $fetch(`/api/workspace/${props.workspaceId}/teammates/change-role`, {
      method: 'PATCH',
      body: {
        teammates: newTeammates,
      },
    })

    await refreshNuxtData('workspace_teammates')
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
    isChangingRole.value = false
  }
}
</script>

<template>
  <div className="space-y-3">
    <div class="w-full">
      <div class="grid grid-cols-2 gap-3">
        <p>{{ props?.teammates.length > 1 ? 'Members' : 'Member' }}</p>
        <p>Role</p>
      </div>
      <div class="grid gap-1.5">
        <RoleForm
          v-for="teammate in props?.teammates"
          :key="teammate.id"
          :is-changing-role="isChangingRole"
          :teammate="teammate"
          :teammates="props?.teammates"
        />
      </div>
    </div>
    <div class="grid gap-2">
      <Button
        :disabled="isChangingRole"
        class="flex w-full gap-2 bg-brand hover:bg-brand-secondary dark:bg-primary dark:hover:bg-zinc-300"
        @click="onChangeRole"
      >
        <Loader
          v-if="isChangingRole"
          class="size-5 animate-spin"
        />
        <Icon
          v-else
          name="hugeicons:user-edit-01"
          class-name="size-5"
        />
        Change {{ props.teammates.length > 1 ? 'Roles' : 'Role' }}
      </Button>
      <Button
        type="button"
        :disabled="isChangingRole"
        variant="ghost"
        class="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium transition-all"
        @click="props?.onClose"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
