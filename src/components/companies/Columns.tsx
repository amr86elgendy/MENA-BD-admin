import type { ColumnDef } from '@tanstack/react-table'
// UI
import { DataTableColumnHeader } from './table/columnHeader'
import { DataTableRowActions } from './table/rowActions'
// Utils
import type { TCompany } from '@/types/company'

export const columns: ColumnDef<TCompany>[] = [
  {
    accessorKey: 'nameEn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name (en)" />
    ),
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {company.nameEn}
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
      const company = row.original
      return (
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {company.nameAr || '-'}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'industry',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="industry" />
    ),
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-purple-100 px-2 font-semibold leading-5 text-green-800">
        {row.original.industry}
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
