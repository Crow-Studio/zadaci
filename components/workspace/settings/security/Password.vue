<script setup lang="ts">
import { Loader2, ServerCrash } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const modalStore = useModalStore()

const { data, status } = await useAsyncData('user_password_setting', () => useRequestFetch()(`/api/auth/user/password`))

const onSetupPassword = () => {
  modalStore?.onOpen('setupPassword')
  modalStore?.setIsOpen(true)
}

const onResetPassword = () => {
  modalStore?.onOpen('resetPassword')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d] sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-base font-medium">
        Password
      </h1>
      <p class="max-w-xl text-balance text-sm text-muted-foreground">
        Setup a password to protect your account.
      </p>
    </div>
    <div>
      <p
        v-if="status ==='idle' || status ==='pending'"
        class="flex animate-pulse items-center gap-1 text-sm"
      >
        <Loader2 class="size-5 animate-spin" />
        Checking...
      </p>
      <p
        v-else-if="status ==='error'"
        class="flex animate-pulse items-center gap-1 text-sm text-destructive dark:text-primary"
      >
        <ServerCrash class="size-5" />
        Server Error
      </p>
      <div v-else>
        <Button
          v-if="data && data.isPasswordSet"
          variant="outline"
          class="w-full border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground sm:h-8 sm:w-fit"
          @click="onResetPassword"
        >
          <Icon
            name="hugeicons:square-lock-01"
            class="size-5"
          />
          Reset password
        </Button>
        <Button
          v-else
          variant="outline"
          class="w-full border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white dark:border dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground sm:h-8 sm:w-fit"
          @click="onSetupPassword"
        >
          <Icon
            name="hugeicons:square-lock-add-01"
            class="size-4"
          />
          Setup password
        </Button>
      </div>
    </div>
  </div>
</template>
