import { useState } from 'react'
import type { Row } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { Ellipsis, SquarePen, Trash2 } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CompanyAlert from '@/components/ui/alerts/CompanyAlert'
// Utils
import type { TCompany } from '@/types/company'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps<TCompany>) {
  const company = row.original

  const [isCompanyAlertOpened, setCompanyAlert] = useState(false)

  function handleDelete() {
    setCompanyAlert(true)
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              to="/companies/edit/$companyId"
              params={{ companyId: company.id.toString() }}
              className="flex items-center"
            >
              <SquarePen size={20} className="mr-2 text-slate-500" />
              <span className="capitalize">edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/5 focus:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 size={20} className="mr-2" />
            <span className="capitalize">delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CompanyAlert
        id={company.id.toString()}
        isCompanyAlertOpened={isCompanyAlertOpened}
        setCompanyAlert={setCompanyAlert}
      />
    </>
  )
}
