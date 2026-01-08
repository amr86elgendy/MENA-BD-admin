import type { ColumnDef } from '@tanstack/react-table'
// UI
import { DataTableColumnHeader } from './table/columnHeader'
import { DataTableRowActions } from './table/rowActions'
import { Badge } from '@/components/ui/badge'
// Utils
import type { TCountry } from '@/types/country'

export const columns: ColumnDef<TCountry>[] = [
  {
    accessorKey: 'nameEn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name (en)" />
    ),
    cell: ({ row }) => {
      const country = row.original
      return (
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {country.nameEn}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nameAr',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name (ar)" />
    ),
    cell: ({ row }) => {
      const country = row.original
      return (
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {country.nameAr}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="code" />
    ),
    cell: ({ row }) => {
      const country = row.original
      return (
        <div className="text-sm font-medium text-gray-900">{country.code}</div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => {
      const country = row.original
      return (
        <Badge variant={country.isActive ? 'default' : 'secondary'}>
          {country.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
