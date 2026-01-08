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

import { useDeleteCompany } from '@/apis/companies'

export default function CompanyAlert({
  id,
  isCompanyAlertOpened,
  setCompanyAlert,
}: {
  id: string
  isCompanyAlertOpened: boolean
  setCompanyAlert: (x: boolean) => void
}) {
  const deleteCompany = useDeleteCompany()

  function handleDelete() {
    deleteCompany.mutate(
      Number(id),
      {
        onSuccess: () => {
          setCompanyAlert(false)
          toast.success('Company deleted successfully')
        },
      },
    )
  }

  return (
    <AlertDialog open={isCompanyAlertOpened} onOpenChange={setCompanyAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteCompany.isPending}
            onClick={handleDelete}
          >
            {deleteCompany.isPending ? (
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
