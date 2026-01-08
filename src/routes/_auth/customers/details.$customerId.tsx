import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Undo2Icon,
  BadgeCheck,
  XCircle,
  Mail,
  User,
  Shield,
  Loader2,
} from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomInput } from '@/components/controls/CustomInput'
import { CustomSelect } from '@/components/controls/CustomSelect'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import {
  getUserByIdQueryOptions,
  useUpdateUser,
  useVerifyUser,
} from '@/apis/customers'
import { USER_ROLES } from '@/constants'
import { formatDistanceToNow } from 'date-fns'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN']),
})

type UserSchemaType = z.infer<typeof userSchema>

export const Route = createFileRoute('/_auth/customers/details/$customerId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { customerId } = params
    await queryClient.ensureQueryData(
      getUserByIdQueryOptions(Number(customerId)),
    )
  },
  component: CustomerDetailsPage,
})

function CustomerDetailsPage() {
  const { customerId } = Route.useParams()
  const navigate = Route.useNavigate()
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)

  const updateUser = useUpdateUser()
  const verifyUser = useVerifyUser()

  const userQuery = useSuspenseQuery(
    getUserByIdQueryOptions(Number(customerId)),
  )
  const user = userQuery.data

  const form = useForm<UserSchemaType>({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    resolver: zodResolver(userSchema),
  })

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

  const onSubmit = (values: UserSchemaType) => {
    updateUser.mutate(
      {
        data: values,
        id: customerId,
      },
      {
        onSuccess: () => {
          navigate({ to: '/customers' })
        },
      },
    )
  }

  return (
    <section className="m-auto space-y-8 md:w-3/4">
      <Button
        asChild
        className="bg-gray-200 hover:bg-gray-300"
        variant="secondary"
      >
        <Link to="/customers">
          <Undo2Icon className="size-6" />
          <span className="capitalize">back to customers</span>
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Customer Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  View customer details and status
                </CardDescription>
              </div>
              <Badge
                variant={user.isVerified ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {user.isVerified ? (
                  <>
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Not Verified
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {Object.values(USER_ROLES).find(
                      (r) => r.value === user.role,
                    )?.label || user.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer ID
                </p>
                <p className="text-lg font-semibold">#{user.id}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(user.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {!user.isVerified && (
              <>
                <Separator />
                <Button
                  onClick={() => setIsVerifyDialogOpen(true)}
                  disabled={verifyUser.isPending}
                  className="w-full"
                >
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Verify User
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Customer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Customer</CardTitle>
            <CardDescription>Update customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <CustomInput<UserSchemaType>
                  fieldTitle="name"
                  nameInSchema="name"
                />

                <CustomInput<UserSchemaType>
                  fieldTitle="email"
                  nameInSchema="email"
                  type="email"
                />

                <CustomSelect<UserSchemaType>
                  fieldTitle="role"
                  nameInSchema="role"
                  options={Object.values(USER_ROLES)}
                  valueKey="value"
                  labelKey="label"
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: '/customers' })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!form.formState.isDirty || updateUser.isPending}
                    className="flex-1"
                  >
                    {updateUser.isPending ? 'Updating...' : 'Update Customer'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

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
    </section>
  )
}
