<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()
</script>

<template>
  <div>
    Tasks Calendar View {{ props?.projectId }}
  </div>
</template>
