<script setup lang="ts">
import { Button } from '~/components/ui/button'

const modalStore = useModalStore()

const onDeleteWorkspace = () => {
  modalStore?.onOpen('deleteWorkspace')
  modalStore?.setIsOpen(true)
}

const onTransferOnwership = () => {
  modalStore?.onOpen('transferOwnership')
  modalStore?.setIsOpen(true)
}
</script>

<template>
  <div class="flex flex-col gap-5 rounded-lg bg-rose-100 p-5 dark:bg-[#99004c] sm:items-center sm:justify-between lg:flex-row">
    <div class="self-start">
      <h1 class="text-base font-medium">
        Delete Workspace
      </h1>
      <p class="text-sm text-muted-foreground sm:max-w-xl sm:text-balance md:w-full lg:max-w-xl">
        Deleting a workspace cannot be undone. All data would be irretriveable.
      </p>
    </div>
    <div class="flex w-full flex-col gap-2 lg:w-fit lg:flex-row lg:items-center lg:self-start xl:gap-5">
      <Button
        variant="outline"
        class="w-full gap-1.5 border-0 bg-brand text-white hover:bg-brand-secondary hover:text-white lg:w-fit cursor-pointer"
        @click="onTransferOnwership"
      >
        <Icon
          name="hugeicons:square-arrow-data-transfer-horizontal"
          class="size-4"
        />
        Transfer ownership
      </Button>
      <Button
        variant="destructive"
        class="w-full gap-1.5 lg:w-fit cursor-pointer"
        @click="onDeleteWorkspace"
      >
        <Icon
          name="hugeicons:delete-02"
          class="size-4"
        />
        Delete Workspace
      </Button>
    </div>
  </div>
</template>
