import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Undo2Icon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomInput } from '@/components/controls/CustomInput'
import { CustomSelect } from '@/components/controls/CustomSelect'
import { CustomMultiSelect } from '@/components/controls/CustomMultiSelect'
import { CustomTiptapInput } from '@/components/controls/CustomTiptapInput'
// Utils
import { useCreateCompany } from '@/apis/companies'
import { companySchema } from '@/components/companies/schema'
import { getAllCountriesQueryOptions } from '@/apis/countries'
import { getAllReportsQueryOptions } from '@/apis/reports'

type CompanySchemaType = z.infer<typeof companySchema>

export const Route = createFileRoute('/_auth/companies/create')({
  loader: async ({ context: { queryClient } }) => {
    return {
      countriesQueryData: await queryClient.ensureQueryData(
        getAllCountriesQueryOptions(),
      ),
      reportsQueryData: await queryClient.ensureQueryData(
        getAllReportsQueryOptions({ isActive: true }),
      ),
    }
  },
  component: CreateCompanyForm,
})

function CreateCompanyForm() {
  const navigate = Route.useNavigate()
  const { countriesQueryData, reportsQueryData } = Route.useLoaderData()

  const createCompany = useCreateCompany()

  const countries = countriesQueryData?.data?.filter((c) => c.isActive) || []
  const reports = reportsQueryData?.data || []

  const form = useForm<CompanySchemaType>({
    defaultValues: {
      nameEn: '',
      nameAr: '',
      registrationNumber: '',
      legalForm: '',
      industry: '',
      foundedDate: '',
      size: '',
      address: '',
      city: '',
      countryCode: '',
      phone: '',
      email: '',
      website: '',
      description: '',
      services: [],
      reportIds: [] as string[],
    },
    resolver: zodResolver(companySchema),
  })

  const onSubmit = (values: CompanySchemaType) => {
    const data = {
      ...values,
      website: values.website || undefined,
      nameAr: values.nameAr || undefined,
      legalForm: values.legalForm || undefined,
      foundedDate: values.foundedDate || undefined,
      size: values.size || undefined,
      description: values.description || undefined,
      services:
        values.services && values.services.length > 0
          ? values.services
          : undefined,
      reportIds:
        values.reportIds && values.reportIds.length > 0
          ? values.reportIds.map((id) =>
              typeof id === 'string' ? Number(id) : id,
            )
          : undefined,
    }
    createCompany.mutate(data, {
      onSuccess: () => navigate({ to: '/companies' }),
    })
  }

  const reportOptions = reports.map((report) => ({
    id: report.id,
    name: report.name,
    value: String(report.id),
    label: `${report.name} (${report.country.nameEn}) - $${report.price}`,
  }))

  return (
    <section className="m-auto space-y-8 md:w-3/4">
      <Button
        asChild
        className="bg-gray-200 hover:bg-gray-300"
        variant="secondary"
      >
        <Link to="/companies">
          <Undo2Icon className="size-6" />
          <span className="capitalize">back to companies</span>
        </Link>
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Company Name */}
            <CustomInput<CompanySchemaType>
              fieldTitle="company name (en)"
              nameInSchema="nameEn"
            />
            <CustomInput<CompanySchemaType>
              fieldTitle="company name (ar)"
              nameInSchema="nameAr"
              optional
            />

            {/* Registration & Legal Form */}
            <CustomInput<CompanySchemaType>
              fieldTitle="registration number"
              nameInSchema="registrationNumber"
            />
            <CustomInput<CompanySchemaType>
              fieldTitle="legal form"
              nameInSchema="legalForm"
              optional
            />

            {/* Industry & Founded Date */}
            <CustomInput<CompanySchemaType>
              fieldTitle="industry"
              nameInSchema="industry"
            />
            <CustomInput<CompanySchemaType>
              fieldTitle="founded date"
              nameInSchema="foundedDate"
              type="date"
              optional
            />

            {/* Size & Country */}
            <CustomInput<CompanySchemaType>
              fieldTitle="size"
              nameInSchema="size"
              optional
            />
            <CustomSelect<CompanySchemaType>
              fieldTitle="country"
              nameInSchema="countryCode"
              options={countries}
              valueKey="code"
              labelKey="nameEn"
              placeholder="Select a country..."
            />

            {/* Address & City */}
            <CustomInput<CompanySchemaType>
              fieldTitle="address"
              nameInSchema="address"
              className="col-span-2"
            />
            <CustomInput<CompanySchemaType>
              fieldTitle="city"
              nameInSchema="city"
            />

            {/* Phone & Email */}
            <CustomInput<CompanySchemaType>
              fieldTitle="phone"
              nameInSchema="phone"
              type="tel"
            />
            <CustomInput<CompanySchemaType>
              fieldTitle="email"
              nameInSchema="email"
              type="email"
            />

            {/* Website */}
            <CustomInput<CompanySchemaType>
              fieldTitle="website"
              nameInSchema="website"
              type="url"
              optional
              className="col-span-2"
            />

            {/* Description */}
            <CustomTiptapInput<CompanySchemaType>
              fieldTitle="description (optional)"
              nameInSchema="description"
              className="col-span-2"
            />

            {/* Reports */}
            <CustomMultiSelect<CompanySchemaType>
              fieldTitle="Reports (optional)"
              nameInSchema="reportIds"
              options={reportOptions}
              valueKey="id"
              labelKey="label"
              className="col-span-2"
            />
          </div>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || createCompany.isPending}
          >
            {createCompany.isPending ? 'Creating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
