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

import { useDeleteVariant } from '@/apis/variants'

export default function VariantAlert({
  id,
  productId,
  isVariantAlertOpened,
  setVariantAlert,
}: {
  id: string
  productId: string
  isVariantAlertOpened: boolean
  setVariantAlert: (x: boolean) => void
}) {
  const deleteVariant = useDeleteVariant({ productId })

  function handleDelete() {
    deleteVariant.mutate(
      { id },
      {
        onSuccess: (data) => {
          setVariantAlert(false)
          toast.success(data.msg)
        },
      },
    )
  }

  return (
    <AlertDialog open={isVariantAlertOpened} onOpenChange={setVariantAlert}>
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
            disabled={deleteVariant.isPending}
            onClick={handleDelete}
          >
            {deleteVariant.isPending ? (
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
