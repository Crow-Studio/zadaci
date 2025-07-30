<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { Loader2, Plus, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { motion, AnimatePresence } from 'motion-v'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'

const workspaceStore = useWorkspaceStore()

const workspaceId = computed(() => workspaceStore?.onboardingWorkspaceId)

const teammates = ref([{ id: Date.now(), email: '', role: 'employee' }])
const isSendingInvites = ref(false)

const randomEmails = [
  'alex@example.com',
  'sophia@example.com',
  'mike@workmail.com',
  'emma@company.io',
  'john.doe@biz.net',
  'lucas@startup.dev',
  'chris@agency.com',
  'natalie@freelance.me',
]

const getRandomEmail = () =>
  randomEmails[Math.floor(Math.random() * randomEmails.length)]

const addUser = async () => {
  const newTeammate = { id: Date.now(), email: '', role: 'EMPLOYEE' }
  teammates.value.push(newTeammate)
  await nextTick()
}

const removeUser = (index: number, id: number) => {
  teammates.value = teammates.value.filter(teammate => teammate.id !== id)
}

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isUserSelected = computed(() =>
  teammates.value.length > 0
  && teammates.value.every(teammate => isValidEmail(teammate.email)),
)

const onSendInvites = async () => {
  isSendingInvites.value = true
  try {
    const res = await $fetch(
      `/api/workspace/${workspaceId.value}/teammates/team-invite/send`,
      {
        method: 'POST',
        body: { teammates: teammates.value },
      },
    )

    toast.success(res.message, { position: 'top-center' })
    return navigateTo(`/workspace/${workspaceId.value}/dashboard`)
  }
  catch (error: any) {
    const errorMessage = error.response ? error.response._data.message : error.message
    toast.error(errorMessage, { position: 'top-center' })
  }
  finally {
    isSendingInvites.value = false
  }
}

const onDoItLater = async () => {
  await refreshNuxtData(['user_workspaces'])
  return navigateTo(`/workspace/${workspaceId.value}/dashboard`)
}
</script>

<template>
  <div class="grid w-full max-w-xl gap-3">
    <div class="grid grid-cols-2 gap-3">
      <Label>Email</Label>
      <Label>Role</Label>
    </div>

    <div class="grid gap-1">
      <AnimatePresence>
        <template
          v-for="(teammate, index) in teammates"
          :key="teammate.id"
        >
          <motion.div
            :initial="{ opacity: 0, x: 30 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -30 }"
            :transition="{ duration: 0.4 }"
            class="grid grid-cols-2 items-center gap-3 group"
          >
            <Input
              v-model="teammate.email"
              type="text"
              :placeholder="getRandomEmail()"
              :disabled="isSendingInvites"
              class="placeholder:text-custom-text-400 border-onboarding-border-100 block w-full rounded-md border-[0.5px] bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <div class="relative flex items-center">
              <Select
                v-model="teammate.role"
                :disabled="isSendingInvites"
              >
                <SelectTrigger
                  id="select-36"
                  class="outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 w-full"
                >
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUEST">
                    Guest
                  </SelectItem>
                  <SelectItem value="MEMBER">
                    Member
                  </SelectItem>
                  <SelectItem value="OWNER">
                    Owner
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                v-if="teammates.length > 1"
                variant="ghost"
                size="icon"
                class="absolute -right-12 size-8 rounded-full border text-destructive hover:text-rose-400"
                @click="removeUser(index, teammate.id)"
              >
                <X class="size-4" />
              </Button>
            </div>
          </motion.div>
        </template>
      </AnimatePresence>
    </div>

    <Button
      variant="ghost"
      class="w-fit text-brand hover:text-brand-secondary cursor-pointer"
      @click="addUser"
    >
      <Plus />
      Add another
    </Button>

    <div class="text-center text-sm text-muted-foreground">
      <p>
        <span class="font-semibold">Owner</span> – Full control over workspace settings and members.
      </p>
      <p>
        <span class="font-semibold">Member</span> – Can manage projects, tasks, and team members.
      </p>
      <p>
        <span class="font-semibold">Guest</span> – Can view assigned tasks.
      </p>
    </div>

    <div class="flex flex-col items-center gap-1">
      <Button
        :disabled="!isUserSelected || isSendingInvites"
        :class="
          cn(
            'flex max-w-sm w-full items-center justify-center gap-1.5 whitespace-nowrap rounded px-5 py-2 text-sm font-medium text-white transition-all',
            !isUserSelected || isSendingInvites
              ? 'cursor-not-allowed bg-brand-secondary'
              : 'cursor-pointer bg-brand focus:bg-brand-secondary hover:bg-brand-secondary',
          )
        "
        @click="onSendInvites"
      >
        <Loader2
          v-if="isSendingInvites"
          class="size-5 animate-spin"
        />
        Send invites
      </Button>

      <Button
        :disabled="isSendingInvites"
        variant="link"
        class="w-full max-w-sm cursor-pointer"
        @click="onDoItLater"
      >
        I'll do it later
      </Button>
    </div>
  </div>
</template>
