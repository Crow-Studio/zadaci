import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { format } from 'date-fns'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import Role from './Role.vue'
import Teammate from './Teammate.vue'
import DataTableActions from './DataTableActions.vue'
import { Checkbox } from '~/components/ui/checkbox'
import type { TeammatesWithProfile } from '~/types'

export const columns: ColumnDef<TeammatesWithProfile>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'translate-y-0.5',
    }),
    cell: ({ row }) => h(Checkbox, { 'modelValue': row.getIsSelected(), 'onUpdate:modelValue': value => row.toggleSelected(!!value), 'ariaLabel': 'Select row', 'class': 'translate-y-0.5' }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Member' }),
    cell: ({ row }) => h(Teammate, { class: 'lowercase', row }),
    filterFn: (row, _, filterValue: string) => {
      const username = row.original.user?.username?.toLowerCase() ?? ''
      return username.includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Role' }),
    cell: ({ row }) => h(Role, { class: 'lowercase', row }),
  },
  {
    id: 'registered2FA',
    accessorFn: row => row.user?.registered2FA,
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '2FA Auth' }),
    cell: ({ row }) => {
      const is2FA = row.original.user?.registered2FA
      return h(
        'div',
        {
          class: is2FA
            ? 'font-medium text-green-600'
            : 'font-medium text-yellow-600',
        },
        is2FA ? 'Enabled' : 'Disabled',
      )
    },
    filterFn: (row, _, filterValue: string[]) => {
      const is2FA = row.getValue<boolean>('registered2FA')
      return filterValue.includes(is2FA ? 'enabled' : 'disabled')
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Joined Date' }),
    cell: ({ row }) => {
      const createdAt = format(row.original.createdAt, 'PPPP')

      return h('div', { class: 'font-medium' }, createdAt)
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableActions, { class: 'lowercase', row }),
  },
]
