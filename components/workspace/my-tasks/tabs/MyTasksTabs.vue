<script setup lang="ts">
import MyTasksBoardsView from './MyTasksBoardsView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  workspaceId: string
}>()
</script>

<template>
  <Tabs
    default-value="board"
    class="w-full overflow-x-hidden"
  >
    <TabsList class="rounded-md p-1 w-full md:w-fit">
      <TabsTrigger
        value="board"
        class="data-[state=active]:bg-brand dark:data-[state=active]:bg-brand data-[state=active]:text-white data-[state=inactive]:text-muted-foreground cursor-pointer rounded"
      >
        <Icon
          name="solar:notification-unread-lines-outline"
          class="size-5"
        />
        Board
      </TabsTrigger>
      <TabsTrigger
        value="list"
        class="data-[state=active]:bg-brand dark:data-[state=active]:bg-brand data-[state=active]:text-white data-[state=inactive]:text-muted-foreground cursor-pointer rounded"
      >
        <Icon
          name="hugeicons:left-to-right-list-dash"
          class="size-5"
        />
        List
      </TabsTrigger>
      <TabsTrigger
        value="table"
        class="data-[state=active]:bg-brand dark:data-[state=active]:bg-brand data-[state=active]:text-white data-[state=inactive]:text-muted-foreground cursor-pointer rounded"
      >
        <Icon
          name="hugeicons:layout-table-02"
          class="size-5"
        />
        Table
      </TabsTrigger>
      <TabsTrigger
        value="calendar"
        class="data-[state=active]:bg-brand dark:data-[state=active]:bg-brand data-[state=active]:text-white data-[state=inactive]:text-muted-foreground cursor-pointer rounded"
      >
        <Icon
          name="hugeicons:calendar-02"
          class="size-5"
        />
        Calendar
      </TabsTrigger>
    </TabsList>
    <TabsContent value="board">
      <MyTasksBoardsView :workspace-id="props?.workspaceId" />
    </TabsContent>
    <TabsContent value="list">
      <!-- <ListProjectsView /> -->
    </TabsContent>
    <TabsContent value="table">
      <!-- <TableProjectsView /> -->
    </TabsContent>
    <TabsContent value="calendar">
      <!-- <CalendarProjectsView /> -->
    </TabsContent>
  </Tabs>
</template>
