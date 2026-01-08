import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { BadgeCheck, Ellipsis, SquarePen, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
// UI
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// Utils
import type { TUser } from '@/types/user'
import { useVerifyUser } from '@/apis/customers'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps<TUser>) {
  const user = row.original
  const verifyUser = useVerifyUser()
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)

  const handleVerify = async () => {
    try {
      await verifyUser.mutateAsync(user.id)
      setIsVerifyDialogOpen(false)
      toast.success(
        'User verified successfully. Password setup email has been sent.',
      )
    } catch (error: any) {
      console.error('Failed to verify user:', error)
      toast.error(error?.response?.data?.error || 'Failed to verify user')
    }
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
              to="/customers/edit/$customerId"
              params={{ customerId: String(user.id) }}
            >
              <SquarePen size={20} className="mr-2 text-slate-500" />
              <span className="capitalize">edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!user.isVerified && (
            <DropdownMenuItem
              onClick={() => setIsVerifyDialogOpen(true)}
              disabled={verifyUser.isPending}
            >
              <BadgeCheck size={20} className="mr-2 text-green-600" />
              <span className="capitalize">verify user</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Verify User Confirmation Dialog */}
      <AlertDialog
        open={isVerifyDialogOpen}
        onOpenChange={setIsVerifyDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify this user? This will:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Mark the user as verified</li>
                <li>Send a password setup email to {user.email}</li>
                <li>
                  Allow the user to set up their password and access their
                  account
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={verifyUser.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerify}
              disabled={verifyUser.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {verifyUser.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Verify User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
