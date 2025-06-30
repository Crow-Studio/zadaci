<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()
</script>

<template>
  <div>
    Tasks Table View {{ props?.projectId }}
  </div>
</template>
