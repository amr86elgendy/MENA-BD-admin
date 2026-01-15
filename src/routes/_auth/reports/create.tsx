import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Undo2Icon } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
// UI
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomInput } from '@/components/controls/CustomInput'
import { CustomSwitch } from '@/components/controls/CustomSwitch'
import { CustomSelect } from '@/components/controls/CustomSelect'
// Utils
import { useCreateReport } from '@/apis/reports'
import { reportSchema } from '@/components/reports/schema'
import { getAllCountriesQueryOptions } from '@/apis/countries'

type ReportSchemaType = z.infer<typeof reportSchema>

export const Route = createFileRoute('/_auth/reports/create')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      getAllCountriesQueryOptions({ isActive: true }),
    )
  },
  component: CreateReportForm,
})

function CreateReportForm() {
  const navigate = Route.useNavigate()

  const createReport = useCreateReport()

  const { data: countriesData } = useSuspenseQuery(
    getAllCountriesQueryOptions({ isActive: true }),
  )

  const form = useForm<ReportSchemaType>({
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      turnaround: '',
      price: 0,
      countryCode: '',
    },
    resolver: zodResolver(reportSchema) as any,
  })

  const onSubmit = (values: ReportSchemaType) => {
    createReport.mutate(values, {
      onSuccess: () => navigate({ to: '/reports' }),
    })
  }

  const countryOptions =
    countriesData?.data.map((country) => ({
      label: country.nameEn,
      value: country.code,
    })) || []

  return (
    <section className="m-auto space-y-8 md:w-3/4">
      <Button
        asChild
        className="bg-gray-200 hover:bg-gray-300"
        variant="secondary"
      >
        <Link to="/reports">
          <Undo2Icon className="size-6" />
          <span className="capitalize">back to reports</span>
        </Link>
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <CustomInput<ReportSchemaType>
              fieldTitle="Report Name"
              nameInSchema="name"
              placeholder="e.g., Business Activities Report"
            />

            <CustomSelect<ReportSchemaType>
              fieldTitle="Country"
              nameInSchema="countryCode"
              options={countryOptions}
              placeholder="Select a country"
              valueKey="value"
              labelKey="label"
            />
          </div>

          <CustomInput<ReportSchemaType>
            fieldTitle="Description"
            nameInSchema="description"
            placeholder="Detailed description of the report"
          />

          <div className="grid grid-cols-2 gap-8">
            <CustomInput<ReportSchemaType>
              fieldTitle="Turnaround Time"
              nameInSchema="turnaround"
              placeholder="e.g., 2-3 days, 5-7 days"
            />

            <CustomInput<ReportSchemaType>
              fieldTitle="Price"
              nameInSchema="price"
              type="number"
              placeholder="0"
            />
          </div>

          <CustomSwitch<ReportSchemaType>
            fieldTitle="Active Status"
            nameInSchema="isActive"
            description="Enable or disable this report"
          />

          <Button
            type="submit"
            disabled={!form.formState.isDirty || createReport.isPending}
          >
            {createReport.isPending ? 'Creating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
