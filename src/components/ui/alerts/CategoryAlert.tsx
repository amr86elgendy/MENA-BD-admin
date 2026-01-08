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

import { useDeleteCategory } from '@/apis/categories'

export default function CategoryAlert({
  id,
  isCategoryAlertOpened,
  setCategoryAlert,
}: {
  id: string
  isCategoryAlertOpened: boolean
  setCategoryAlert: (x: boolean) => void
}) {
  const deleteCategory = useDeleteCategory()

  function handleDelete() {
    deleteCategory.mutate(
      { id },
      {
        onSuccess: (data) => {
          setCategoryAlert(false)
          toast.success(data.msg)
        },
      },
    )
  }

  return (
    <AlertDialog open={isCategoryAlertOpened} onOpenChange={setCategoryAlert}>
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
            disabled={deleteCategory.isPending}
            onClick={handleDelete}
          >
            {deleteCategory.isPending ? (
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
