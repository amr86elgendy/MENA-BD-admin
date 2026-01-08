import type { ColumnDef } from '@tanstack/react-table'
import { BadgeCheck, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
// UI
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from './table/columnHeader'
import { DataTableRowActions } from './table/rowActions'
// Utils
import type { TUser } from '@/types/user'
import { USER_ROLES } from '@/constants'

export const columns: ColumnDef<TUser>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="space-y-1">
          <div className="line-clamp-1 text-sm font-medium">
            {customer.name}
          </div>
          <span className="text-xs text-muted-foreground">
            ID: {customer.id}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.email}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="role" />
    ),
    cell: ({ row }) => {
      const role = Object.values(USER_ROLES).find(
        (r) => r.value === row.original.role,
      )
      return (
        <Badge variant="secondary">{role?.label || row.original.role}</Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isVerified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="verified" />
    ),
    cell: ({ row }) => {
      const isVerified = row.original.isVerified
      return (
        <div className="flex items-center justify-center">
          {isVerified ? (
            <BadgeCheck className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="created at" />
    ),
    cell: ({ row }) => {
      const formattedDate = formatDistanceToNow(
        new Date(row.original.createdAt),
        {
          addSuffix: true,
        },
      )
      return (
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
