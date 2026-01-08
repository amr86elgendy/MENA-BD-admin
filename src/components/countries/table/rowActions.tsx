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
import CountryAlert from '@/components/ui/alerts/CountryAlert'
// Utils
import type { TCountry } from '@/types/country'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps<TCountry>) {
  const country = row.original

  const [isCountryAlertOpened, setCountryAlert] = useState(false)

  function handleDelete() {
    setCountryAlert(true)
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
              to="/countries/edit/$countryId"
              params={{ countryId: country.id.toString() }}
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
      <CountryAlert
        id={country.id.toString()}
        isCountryAlertOpened={isCountryAlertOpened}
        setCountryAlert={setCountryAlert}
      />
    </>
  )
}
