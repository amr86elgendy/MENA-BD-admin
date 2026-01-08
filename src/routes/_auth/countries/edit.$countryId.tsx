import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Undo2Icon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomInput } from '@/components/controls/CustomInput'
import { CustomSwitch } from '@/components/controls/CustomSwitch'
// Utils
import { useUpdateCountry, getCountryByIdQueryOptions } from '@/apis/countries'
import { countrySchema } from '@/components/countries/schema'

type CountrySchemaType = z.infer<typeof countrySchema>

export const Route = createFileRoute('/_auth/countries/edit/$countryId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { countryId } = params
    queryClient.ensureQueryData(getCountryByIdQueryOptions(Number(countryId)))
  },
  component: EditCountryForm,
})

function EditCountryForm() {
  const { countryId } = Route.useParams()

  const navigate = Route.useNavigate()

  const updateCountry = useUpdateCountry()

  const viewCountryQuery = useSuspenseQuery(
    getCountryByIdQueryOptions(Number(countryId)),
  )

  const country = viewCountryQuery.data

  const form = useForm<CountrySchemaType>({
    defaultValues: {
      code: country.code,
      nameEn: country.nameEn,
      nameAr: country.nameAr,
      isActive: country.isActive,
    },
    resolver: zodResolver(countrySchema),
  })

  const onSubmit = (values: CountrySchemaType) => {
    updateCountry.mutate(
      {
        data: values,
        id: Number(countryId),
      },
      {
        onSuccess: () => navigate({ to: '/countries' }),
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
        <Link to="/countries">
          <Undo2Icon className="size-6" />
          <span className="capitalize">back to countries</span>
        </Link>
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <CustomInput<CountrySchemaType>
              fieldTitle="country name (ar)"
              nameInSchema="nameAr"
            />

            <CustomInput<CountrySchemaType>
              fieldTitle="country name (en)"
              nameInSchema="nameEn"
            />

            <CustomInput<CountrySchemaType>
              fieldTitle="country code (ISO 3166-1 alpha-2)"
              nameInSchema="code"
              maxLength={2}
              placeholder="e.g., AE, SA"
            />
          </div>

          <CustomSwitch<CountrySchemaType>
            fieldTitle="Active Status"
            nameInSchema="isActive"
            description="Enable or disable this country"
          />

          <Button
            type="submit"
            disabled={!form.formState.isDirty || updateCountry.isPending}
          >
            {updateCountry.isPending ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
