<script setup lang="ts">
import TasksBoardsView from './TasksBoardsView.vue'
import TasksCalendarView from './TasksCalendarView.vue'
import TasksListView from './TasksListView.vue'
import TasksTableView from './TasksTableView.vue'
import type { IProject } from '~/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  project: IProject
}>()
</script>

<template>
  <Tabs
    default-value="board"
    class="w-full overflow-x-hidden md:col-span-2 xl:col-span-6"
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
      <TasksBoardsView
        :project="props?.project"
      />
    </TabsContent>
    <TabsContent value="list">
      <TasksListView :project-id="props?.project.id" />
    </TabsContent>
    <TabsContent value="table">
      <TasksTableView :project-id="props?.project.id" />
    </TabsContent>
    <TabsContent value="calendar">
      <TasksCalendarView :project-id="props?.project.id" />
    </TabsContent>
  </Tabs>
</template>
