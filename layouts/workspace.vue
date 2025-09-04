<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import FAB from '~/components/workspace/FAB.vue'
import Sidebar from '~/components/workspace/navigations/Sidebar.vue'
import WorkspaceHeader from '~/components/workspace/navigations/WorkspaceHeader.vue'
import WorkspaceProvider from '~/providers/WorkspaceProvider.vue'

useHead({
  meta: [
    { property: 'og:title', content: `Zadaci` },
    {
      name: 'description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    {
      property: 'og:description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    { property: 'og:url', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
    { name: 'twitter:title', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
    {
      name: 'twitter:description',
      content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.',
    },
    { name: 'twitter:site', content: 'Zadaci is an all-in-one project management platform built to help you and your team get things done faster.' },
  ],
  title: `Zadaci`,
})

const workspaceStore = useWorkspaceStore()

const isOpenSidebar = computed(() => {
  return workspaceStore?.isOpenSidebar
})
</script>

<template>
  <main class="min-h-screen flex flex-col">
    <NuxtLoadingIndicator />

    <div class="flex flex-1">
      <Sidebar />
      <div
        class="flex-1 relative flex flex-col size-full gap-1 px-5 transition-all duration-300"
        :class="{ 'pl-[0rem]': !isOpenSidebar, 'pl-[0rem] md:pl-[18rem]': isOpenSidebar }"
      >
        <WorkspaceHeader />

        <div class="overflow-y-auto flex-1">
          <div class="px-2 sm:px-3">
            <slot />
          </div>
        </div>
      </div>
      <FAB />
    </div>

    <Toaster
      :rich-colors="true"
      :close-button="true"
    />
    <WorkspaceProvider />
  </main>
</template>
