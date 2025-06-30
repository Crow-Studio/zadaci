<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()
</script>

<template>
  <div>
    Tasks List View {{ props?.projectId }}
  </div>
</template>
