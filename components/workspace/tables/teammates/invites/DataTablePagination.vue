<script setup lang="ts">
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-icons/vue'
import type { Table } from '@tanstack/vue-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

// Define generic type parameter for the Table
interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

const props = defineProps<DataTablePaginationProps<any>>()

// Type-safe wrapper functions
const handlePageSizeChange = (value: unknown) => {
  const pageSize = value as string | number | null
  if (pageSize !== null) {
    props.table.setPageSize(Number(pageSize))
  }
}

const getPageSize = () => {
  return `${props.table.getState().pagination.pageSize}`
}

const getCurrentPage = () => {
  return props.table.getState().pagination.pageIndex + 1
}
</script>

<template>
  <div class="max-full flex w-full flex-col gap-1 px-2 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex flex-col gap-y-2 xl:flex-row xl:items-center xl:justify-between xl:gap-0 xl:space-x-6">
      <div class="flex items-center justify-between space-x-2 xl:justify-start">
        <p class="text-sm font-medium">
          Rows per page
        </p>
        <Select
          :model-value="getPageSize()"
          @update:model-value="handlePageSizeChange"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="getPageSize()" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="hidden w-[100px] items-center text-sm font-medium xl:flex xl:justify-center">
        Page {{ getCurrentPage() }} of
        {{ table.getPageCount() }}
      </div>
      <div class="hidden items-center space-x-2 xl:flex">
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeftIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRightIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <DoubleArrowRightIcon class="size-4" />
        </Button>
      </div>
      <div class="flex items-center justify-between xl:hidden">
        <div class="flex w-[100px] items-center text-sm font-medium lg:justify-center">
          Page {{ getCurrentPage() }} of
          {{ table.getPageCount() }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            class="hidden size-8 p-0 lg:flex"
            :disabled="!table.getCanPreviousPage()"
            @click="table.setPageIndex(0)"
          >
            <span class="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon class="size-4" />
          </Button>
          <Button
            variant="outline"
            class="size-8 p-0"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            <span class="sr-only">Go to previous page</span>
            <ChevronLeftIcon class="size-4" />
          </Button>
          <Button
            variant="outline"
            class="size-8 p-0"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            <span class="sr-only">Go to next page</span>
            <ChevronRightIcon class="size-4" />
          </Button>
          <Button
            variant="outline"
            class="hidden size-8 p-0 lg:flex"
            :disabled="!table.getCanNextPage()"
            @click="table.setPageIndex(table.getPageCount() - 1)"
          >
            <span class="sr-only">Go to last page</span>
            <DoubleArrowRightIcon class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
