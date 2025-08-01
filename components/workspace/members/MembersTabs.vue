<script setup lang="ts">
import InvitesTable from '../tables/teammates/invites/InvitesTable.vue'
import TeammatesTable from '~/components/workspace/tables/teammates/TeammatesTable.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
</script>

<template>
  <Tabs
    default-value="teammates"
    class="w-full"
  >
    <TabsList class="w-fit rounded-none bg-transparent p-0">
      <TabsTrigger
        value="teammates"
        class="rounded-none py-2.5 text-base data-[state=active]:border-b-2 data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-b-brand data-[state=active]:font-semibold data-[state=active]:text-brand data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none data-[state=active]:outline-none data-[state=inactive]:outline-none data-[state=active]:ring-0 data-[state=inactive]:ring-0 data-[state=active]:ring-offset-0 data-[state=active]:dark:border-b-primary dark:data-[state=active]:bg-[#1d1d1d] data-[state=active]:dark:text-white"
      >
        Teammates
      </TabsTrigger>
      <TabsTrigger
        value="invites"
        class="rounded-none py-2.5 text-base data-[state=active]:border-b-2 data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-b-brand data-[state=active]:font-semibold data-[state=active]:text-brand data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none data-[state=active]:outline-none data-[state=inactive]:outline-none data-[state=active]:ring-0 data-[state=inactive]:ring-0 data-[state=active]:ring-offset-0 data-[state=active]:dark:border-b-primary dark:data-[state=active]:bg-[#1d1d1d] data-[state=active]:dark:text-white"
      >
        Invites
      </TabsTrigger>
    </TabsList>
    <TabsContent
      value="teammates"
      class="my-5"
    >
      <TeammatesTable />
    </TabsContent>
    <TabsContent
      value="invites"
      class="my-5"
    >
      <InvitesTable />
    </TabsContent>
  </Tabs>
</template>
