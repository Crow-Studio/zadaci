import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { formatDistance, isPast } from 'date-fns'
import Inviter from './Inviter.vue'
import Role from './Role.vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableActions from './DataTableActions.vue'
import { Checkbox } from '~/components/ui/checkbox'
import type { WorkspaceInvite } from '~/types'

export const columns: ColumnDef<WorkspaceInvite>[] = [
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
      h(DataTableColumnHeader, { column, title: 'Inviter' }),
    cell: ({ row }) => h(Inviter, { class: 'lowercase', row }),
    filterFn: (row, _, filterValue: string) => {
      const username = row.original.user?.username?.toLowerCase() ?? ''
      return username.includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Invitee Email' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('email')),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Role' }),
    cell: ({ row }) => h(Role, { class: 'lowercase', row }),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.original.status
      return h(
        'div',
        {
          class: status === 'PENDING'
            ? 'font-medium text-yellow-600'
            : 'font-medium text-rose-600',
        },
        status,
      )
    },
  },
  {
    accessorKey: 'expires_at',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Invite Expiry' }),
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt

      const cleanTimestamp = expiresAt.replace(' EAT', '') // Remove the EAT timezone name
      const parsed = new Date(cleanTimestamp)

      const expiry = isPast(parsed)
        ? 'expired'
        : formatDistance(parsed, new Date(), {
            addSuffix: true,
          })

      return h('div', { class: 'font-medium' }, expiry)
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableActions, { class: 'lowercase', row }),
  },
]
