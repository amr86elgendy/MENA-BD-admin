import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Undo2Icon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomInput } from '@/components/controls/CustomInput'
import { CustomSelect } from '@/components/controls/CustomSelect'
// Utils
import { getUserByIdQueryOptions, useUpdateUser } from '@/apis/customers'
import { USER_ROLES } from '@/constants'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN']),
})

type UserSchemaType = z.infer<typeof userSchema>

export const Route = createFileRoute('/_auth/customers/edit/$customerId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { customerId } = params
    await queryClient.ensureQueryData(
      getUserByIdQueryOptions(Number(customerId)),
    )
  },
  component: EditCustomerPage,
})

function EditCustomerPage() {
  const { customerId } = Route.useParams()
  const navigate = Route.useNavigate()

  const updateUser = useUpdateUser()

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

  const onSubmit = (values: UserSchemaType) => {
    updateUser.mutate(
      {
        data: values,
        id: customerId,
      },
      {
        onSuccess: () => {
          toast.success('Customer updated successfully')
          navigate({ to: '/customers' })
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.error || 'Failed to update customer',
          )
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

      <div className="space-y-6">
        {/* Header with Customer Info */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Customer</h2>
            <p className="text-muted-foreground">
              Customer ID: #{user.id} • {user.email}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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
            </div>

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
      </div>
    </section>
  )
}
