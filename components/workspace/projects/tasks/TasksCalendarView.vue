<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()

console.log(props)
</script>

<template>
  <div class="grid place-content-center min-h-[50vh]">
    <div class="flex items-center flex-col">
      <Icon
        name="hugeicons:coming-soon-02"
        size="50"
      />
      <div class="max-w-md text-center">
        <h2 class="text-lg capitalize">
          Coming soon
        </h2>
        <p class="text-sm text-balance text-muted-foreground">
          We're cooking up something special behind the scenes! Our team is working hard to bring this feature to life. Keep an eye on the What's New page, once it’s ready, you’ll be the first to know!
        </p>
      </div>
    </div>
  </div>
</template>
