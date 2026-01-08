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
import { CustomSelect } from '@/components/controls/CustomSelect'
import { CustomTiptapInput } from '@/components/controls/CustomTiptapInput'
// Utils
import { useUpdateCompany, getCompanyByIdQueryOptions } from '@/apis/companies'
import { companySchema } from '@/components/companies/schema'
import { getAllCountriesQueryOptions } from '@/apis/countries'

type CompanySchemaType = z.infer<typeof companySchema>

export const Route = createFileRoute('/_auth/companies/edit/$companyId')(
  {
    loader: async ({ params, context: { queryClient } }) => {
      const { companyId } = params
      await Promise.all([
        queryClient.ensureQueryData(getCompanyByIdQueryOptions(Number(companyId))),
        queryClient.ensureQueryData(getAllCountriesQueryOptions()),
      ])
    },
    component: EditCompanyForm,
  },
)

function EditCompanyForm() {
  const { companyId } = Route.useParams()

  const navigate = Route.useNavigate()

  const updateCompany = useUpdateCompany()

  const viewCompanyQuery = useSuspenseQuery(
    getCompanyByIdQueryOptions(Number(companyId)),
  )

  const company = viewCompanyQuery.data

  // Get pre-fetched countries from loader
  const { data: countriesData } = useSuspenseQuery(
    getAllCountriesQueryOptions(),
  )
  const countries = countriesData?.data?.filter((c) => c.isActive) || []

  const form = useForm<CompanySchemaType>({
    defaultValues: {
      nameEn: company.nameEn,
      nameAr: company.nameAr || '',
      registrationNumber: company.registrationNumber,
      legalForm: company.legalForm || '',
      industry: company.industry,
      foundedDate: company.foundedDate || '',
      size: company.size || '',
      address: company.address,
      city: company.city,
      countryCode: company.countryCode,
      phone: company.phone,
      email: company.email,
      website: company.website || '',
      description: company.description || '',
      services: company.services || [],
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
      services: values.services && values.services.length > 0 ? values.services : undefined,
    }
    updateCompany.mutate(
      {
        data,
        id: Number(companyId),
      },
      {
        onSuccess: () => navigate({ to: '/companies' }),
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
          </div>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || updateCompany.isPending}
          >
            {updateCompany.isPending ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
