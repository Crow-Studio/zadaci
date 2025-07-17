<script setup lang="ts">
import Signout from '~/modals/global/Signout.vue'
import AddNewProject from '~/modals/workspace/AddNewProject.vue'
import AddNewTask from '~/modals/workspace/AddNewTask.vue'
import MobileSidebar from '~/modals/workspace/MobileSidebar.vue'
import EditProjectTask from '~/modals/workspace/EditProjectTask.vue'
import EditProject from '~/modals/workspace/EditProject.vue'
import CreateWorkspace from '~/modals/workspace/CreateWorkspace.vue'
import DeleteProject from '~/modals/workspace/DeleteProject.vue'
</script>

<template>
  <div>
    <Signout />
    <MobileSidebar />
    <AddNewProject />
    <AddNewTask />
    <EditProjectTask />
    <EditProject />
    <CreateWorkspace />
    <DeleteProject />
    <AddNewMyTask />
  </div>
</template>
