<script setup lang="ts">
import BoardProjectsView from './BoardProjectsView.vue'
// import ListProjectsView from './ListProjectsView.vue'
// import TableProjectsView from './TableProjectsView .vue'
// import CalendarProjectsView from './CalendarProjectsView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
  <Tabs
    default-value="board"
    class="w-full overflow-x-hidden md:col-span-2 xl:col-span-6"
  >
    <TabsList class="rounded-md p-1">
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
      <BoardProjectsView />
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
