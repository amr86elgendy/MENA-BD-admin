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

import { useDeleteImage } from '@/apis/images'

export default function ImageAlert({
  id,
  isImageAlertOpened,
  setImageAlert,
}: {
  id: string
  isImageAlertOpened: boolean
  setImageAlert: (x: boolean) => void
}) {
  const deleteImage = useDeleteImage()

  function handleDelete() {
    deleteImage.mutate(
      { id },
      {
        onSuccess: (data) => {
          setImageAlert(false)
          toast.success(data.msg)
        },
      },
    )
  }

  return (
    <AlertDialog open={isImageAlertOpened} onOpenChange={setImageAlert}>
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
            disabled={deleteImage.isPending}
            onClick={handleDelete}
          >
            {deleteImage.isPending ? (
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
