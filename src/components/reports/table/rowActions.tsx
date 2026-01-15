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
import ReportAlert from '@/components/ui/alerts/ReportAlert'
// Utils
import type { TReport } from '@/types/report'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps<TReport>) {
  const report = row.original

  const [isReportAlertOpened, setReportAlert] = useState(false)

  function handleDelete() {
    setReportAlert(true)
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
              to="/reports/edit/$reportId"
              params={{ reportId: report.id.toString() }}
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
      <ReportAlert
        id={report.id.toString()}
        isReportAlertOpened={isReportAlertOpened}
        setReportAlert={setReportAlert}
      />
    </>
  )
}
