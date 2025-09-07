<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 sm:items-center sm:justify-between">
      <div class="space-y-2">
        <div class="h-6 w-64 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
        <div class="h-4 w-40 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
      </div>
      <div class="h-10 w-full sm:w-28 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10">
      <div class="sm:col-span-1 lg:col-span-2 space-y-3">
        <div class="grid grid-col-2 lg:grid-cols-4 gap-5">
          <div
            v-for="i in 4"
            :key="i"
            class="h-24 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]"
          />
        </div>
        <div class="h-6 w-80 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
        <div class="h-40 sm:h-80 rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
      </div>
      <div class="col-span-1 space-y-5">
        <div class="h-[10rem] sm:h-[13.7rem] w-full rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
        <div class="h-[10rem] sm:h-[13.7rem] w-full rounded-md animate-pulse bg-[#fafafa] dark:bg-[#1d1d1d]" />
      </div>
    </div>
  </div>
</template>
