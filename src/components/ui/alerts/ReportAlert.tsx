import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { useDeleteReport } from '@/apis/reports'

export default function ReportAlert({
  id,
  isReportAlertOpened,
  setReportAlert,
}: {
  id: string
  isReportAlertOpened: boolean
  setReportAlert: (x: boolean) => void
}) {
  const deleteReport = useDeleteReport()

  function handleDelete() {
    deleteReport.mutate(Number(id), {
      onSuccess: () => {
        setReportAlert(false)
        toast.success('Report deleted successfully')
      },
    })
  }

  return (
    <AlertDialog open={isReportAlertOpened} onOpenChange={setReportAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            report from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteReport.isPending}
            onClick={handleDelete}
          >
            {deleteReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
