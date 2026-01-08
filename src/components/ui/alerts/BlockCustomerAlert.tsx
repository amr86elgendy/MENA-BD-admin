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

import { useBlockUser } from '@/apis/customers'

export default function BlockCustomerAlert({
  id,
  blocked,
  isBlockCustomerAlertOpened,
  setBlockCustomerAlert,
}: {
  id: string
  blocked: boolean
  isBlockCustomerAlertOpened: boolean
  setBlockCustomerAlert: (x: boolean) => void
}) {
  const blockUser = useBlockUser()

  function handleBlock() {
    blockUser.mutate(
      { id, blocked: !blocked },
      {
        onSuccess: (data) => {
          setBlockCustomerAlert(false)
          toast.success(data.msg)
        },
      },
    )
  }

  return (
    <AlertDialog
      open={isBlockCustomerAlertOpened}
      onOpenChange={setBlockCustomerAlert}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Blocking a user restricts their access and communication with you.
            Ensure this action is necessary and justified.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={blockUser.isPending}
            onClick={handleBlock}
          >
            {blockUser.isPending ? (
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
