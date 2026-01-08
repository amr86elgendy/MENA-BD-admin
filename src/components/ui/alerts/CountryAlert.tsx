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

import { useDeleteCountry } from '@/apis/countries'

export default function CountryAlert({
  id,
  isCountryAlertOpened,
  setCountryAlert,
}: {
  id: string
  isCountryAlertOpened: boolean
  setCountryAlert: (x: boolean) => void
}) {
  const deleteCountry = useDeleteCountry()

  function handleDelete() {
    deleteCountry.mutate(
      Number(id),
      {
        onSuccess: () => {
          setCountryAlert(false)
          toast.success('Country deleted successfully')
        },
      },
    )
  }

  return (
    <AlertDialog open={isCountryAlertOpened} onOpenChange={setCountryAlert}>
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
            disabled={deleteCountry.isPending}
            onClick={handleDelete}
          >
            {deleteCountry.isPending ? (
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

