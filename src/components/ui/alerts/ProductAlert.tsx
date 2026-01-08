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

import { useDeleteProduct } from '@/apis/products'

export default function ProductAlert({
  id,
  isProductAlertOpened,
  setProductAlert,
}: {
  id: string
  isProductAlertOpened: boolean
  setProductAlert: (x: boolean) => void
}) {
  const deleteProduct = useDeleteProduct()

  function handleDelete() {
    deleteProduct.mutate(
      { id },
      {
        onSuccess: (data) => {
          setProductAlert(false)
          toast.success(data.msg)
        },
      },
    )
  }

  return (
    <AlertDialog open={isProductAlertOpened} onOpenChange={setProductAlert}>
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
            disabled={deleteProduct.isPending}
            onClick={handleDelete}
          >
            {deleteProduct.isPending ? (
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
