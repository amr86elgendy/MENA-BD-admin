import type { ColumnDef } from '@tanstack/react-table'
// UI
import { DataTableColumnHeader } from './table/columnHeader'
import { DataTableRowActions } from './table/rowActions'
import { Badge } from '@/components/ui/badge'
// Utils
import type { TReport } from '@/types/report'

export const columns: ColumnDef<TReport>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => {
      const report = row.original
      return (
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {report.name}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="description" />
    ),
    cell: ({ row }) => {
      const report = row.original
      return (
        <div className="line-clamp-2 max-w-md text-sm text-gray-600">
          {report.description}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="country" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.country.nameEn}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="price" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900">
        ${row.original.price}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'turnaround',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="turnaround" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.turnaround}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => {
      const report = row.original
      return (
        <Badge variant={report.isActive ? 'default' : 'secondary'}>
          {report.isActive ? 'Active' : 'Inactive'}
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
