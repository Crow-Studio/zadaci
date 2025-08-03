<script setup lang="ts" generic="TData extends WorkspaceInvite, TValue">
import type { Column, ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Loader } from 'lucide-vue-next'
import { MixerHorizontalIcon } from '@radix-icons/vue'
import { toast } from 'vue-sonner'
import DataTablePagination from './DataTablePagination.vue'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, valueUpdater } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { exportTableToCSV } from '~/lib/export'
import { status, roles, type WorkspaceInvite, type UserRole } from '~/types'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const workspaceStore = useWorkspaceStore()

const workspace = computed(() => {
  return workspaceStore?.activeWorkspace
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const action = ref<'export' | 'remove' | 'refresh' | 'resend' | null>(null)
const isLoading = ref<boolean>(false)

const startTransition = (callback: () => void) => {
  isLoading.value = true
  try {
    callback()
  }
  finally {
    setTimeout(() => {
      isLoading.value = false
    }, 0)
  }
}

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})

const getColumnLabel = (columnId: string) => {
  switch (columnId) {
    case 'email':
      return 'Invitee Email'
    case 'user':
      return 'Inviter'
    case 'expires_at':
      return 'Invite Expiry'
    default:
      return columnId
  }
}

const visibleColumns = computed(() => {
  return table.getAllColumns().filter(column => column.getCanHide())
})

const onExporting = () => {
  action.value = 'export'
  startTransition(() => {
    exportTableToCSV(table, {
      excludeColumns: ['select', 'actions'],
      onlySelected: false,
      filename: 'Workspace Invites',
    })
  })
}

const onRefreshData = async () => {
  isLoading.value = true
  try {
    action.value = 'refresh'
    await refreshNuxtData('workspace_team_invites')
  }
  finally {
    isLoading.value = false
  }
}

const onResendInvite = async () => {
  isLoading.value = true
  let teammates: { email: string
    role: UserRole }[] = []
  const rows = table.getFilteredSelectedRowModel().rows
  const workspaceId = workspace.value?.id as string

  if (rows.length > 0) {
    teammates = rows.map((item) => {
      const original = item.original as WorkspaceInvite
      return {
        email: original.email,
        role: original.role,
      }
    })
  }

  try {
    action.value = 'resend'

    toast.promise(
      (async () => {
        const res = await $fetch(
          `/api/workspace/${workspaceId}/teammates/team-invite/resend`,
          {
            method: 'PATCH',
            body: {
              teammates,
            },
          },
        )
        return res
      })(),
      {
        loading: 'Resending invite...',
        success: async (data: { message: string }) => {
          await refreshNuxtData('workspace_team_invites')

          isLoading.value = false
          action.value = null

          return data.message
        },
        error: (error: any) => {
          const errorMessage = error.response
            ? error.response._data.statusMessage
            : error.message

          isLoading.value = false
          action.value = null

          return errorMessage
        },
        position: 'top-center',
      },
    )
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    isLoading.value = false
    action.value = null

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
}

const onRemove = async () => {
  isLoading.value = true
  let emails: string[] = []
  const rows = table.getFilteredSelectedRowModel().rows
  const workspaceId = workspace.value?.id as string

  if (rows.length > 0) {
    emails = rows.map((item) => {
      const original = item.original as WorkspaceInvite
      return original.email
    })
  }

  try {
    action.value = 'remove'

    toast.promise(
      (async () => {
        const res = await $fetch(
          `/api/workspace/${workspaceId}/teammates/team-invite/remove`,
          {
            method: 'DELETE',
            body: {
              emails,
            },
          },
        )
        return res
      })(),
      {
        loading: 'Removing invite...',
        success: async (data: { message: string }) => {
          await refreshNuxtData('workspace_team_invites')
          isLoading.value = false
          action.value = null

          return data.message
        },
        error: (error: any) => {
          const errorMessage = error.response
            ? error.response._data.statusMessage
            : error.message

          isLoading.value = false
          action.value = null

          return errorMessage
        },
        position: 'top-center',
      },
    )
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message
    isLoading.value = false
    action.value = null

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="space-y-3">
      <div class="flex flex-col gap-2">
        <Input
          class="max-w-xl dark:bg-[#1d1d1d] dark:hover:bg-muted"
          placeholder="Filter invitee email.."
          :model-value="table.getColumn('email')?.getFilterValue() as string"
          @update:model-value="table.getColumn('email')?.setFilterValue($event)"
        />
        <div class="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex items-center gap-2">
            <DataTableFacetedFilter
              v-if="table.getColumn('role')"
              :column="table.getColumn('role') as unknown as Column<WorkspaceInvite, any>"
              title="Role"
              :options="roles"
            />
            <DataTableFacetedFilter
              v-if="table.getColumn('status')"
              :column="table.getColumn('status') as unknown as Column<WorkspaceInvite, any>"
              title="Status"
              :options="status"
            />
          </div>
          <div class="flex flex-col gap-y-2 xl:flex-row xl:items-center xl:gap-3 xl:self-start">
            <div class="flex items-center gap-3">
              <Button
                v-if="table.getFilteredSelectedRowModel().rows.length > 0"
                aria-label="Delete Rows"
                class="flex h-8 bg-brand hover:bg-brand-secondary dark:bg-primary"
                :disabled="isLoading"
                @click="onResendInvite"
              >
                <Loader
                  v-if="isLoading && action === 'resend'"
                  class="size-4 animate-spin"
                />
                <Icon
                  v-else
                  name="solar:mailbox-outline"
                  class="size-4"
                />
                Resend {{ table.getFilteredSelectedRowModel().rows.length > 1 ? 'invitees' : 'invitee' }} ({{ table.getFilteredSelectedRowModel().rows.length }})
              </Button>
              <Button
                v-if="table.getFilteredSelectedRowModel().rows.length > 0"
                aria-label="Delete Rows"
                variant="destructive"
                class="h-8 dark:bg-[#1d1d1d] dark:hover:bg-muted lg:flex"
                :disabled="isLoading"
                @click="onRemove"
              >
                <Loader
                  v-if="isLoading && action === 'remove'"
                  class="size-4 animate-spin"
                />
                <Icon
                  v-else
                  name="solar:trash-bin-minimalistic-linear"
                  class="size-4"
                />
                Remove {{ table.getFilteredSelectedRowModel().rows.length > 1 ? 'invitees' : 'invitee' }}  ({{ table.getFilteredSelectedRowModel().rows.length }})
              </Button>
            </div>
            <div class="flex items-center gap-3">
              <Button
                aria-label="Refresh Data"
                variant="outline"
                class="h-8 dark:bg-[#1d1d1d] dark:hover:bg-muted"
                :disabled="isLoading"
                @click="onRefreshData"
              >
                <Icon
                  name="solar:refresh-linear"
                  :class="cn(
                    'size-4',
                    isLoading && action === 'refresh' && 'animate-spin',
                  )"
                />
              </Button>
              <Button
                aria-label="Export Data"
                variant="outline"
                class="h-8 dark:bg-[#1d1d1d] dark:hover:bg-muted"
                :disabled="isLoading"
                @click="onExporting"
              >
                <Loader
                  v-if="isLoading && action === 'export'"
                  class="size-4"
                />
                <Icon
                  v-else
                  name="solar:download-minimalistic-bold"
                  class="size-4"
                />
                <span class="hidden md:block">Export</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    aria-label="Toggle columns"
                    variant="outline"
                    class="flex h-8 dark:bg-[#1d1d1d] dark:hover:bg-muted"
                  >
                    <MixerHorizontalIcon class="size-4" />
                    <span class="hidden md:block">View</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    v-for="column in visibleColumns"
                    :key="column.id"
                    class="capitalize"
                    :model-value="column.getIsVisible()"
                    @update:model-value="(value) => column.toggleVisibility(!!value)"
                  >
                    {{ getColumnLabel(column.id) }}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-sm rounded-md border dark:bg-[#1d1d1d] sm:w-full sm:max-w-full">
        <Table>
          <TableHeader>
            <TableRow
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
              >
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell
                  :colspan="columns.length"
                  class="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>
    <DataTablePagination :table="table" />
  </div>
</template>
