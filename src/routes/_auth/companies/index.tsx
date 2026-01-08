import { useState } from 'react'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { PlusIcon, UploadIcon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/companies/table'
import { columns } from '@/components/companies/Columns'
import { LoaderComponent } from '@/components/ui/loader'
import { UploadDialog } from '@/components/companies/UploadDialog'
// Utils
import { getAllCompaniesQueryOptions } from '@/apis/companies'
import { getAllCountriesQueryOptions } from '@/apis/countries'

const companiesSearchParamsSchema = z
  .object({
    search: z.string(),
    countryCode: z.array(z.string()),
  })
  .partial()

export const Route = createFileRoute('/_auth/companies/')({
  staticData: {
    breadcrumb: 'Companies',
  },
  validateSearch: zodValidator(companiesSearchParamsSchema),
  loader: async ({ context: { queryClient }, location }) => {
    const searchParams = location.search as {
      search?: string
      countryCode?: string[]
    }

    return {
      companiesQueryData: await queryClient.ensureInfiniteQueryData(
        getAllCompaniesQueryOptions({
          search: searchParams.search,
          countryCode: searchParams.countryCode,
        }),
      ),
      countriesQueryData: await queryClient.ensureQueryData(
        getAllCountriesQueryOptions(),
      ),
    }
  },
  component: CompaniesListPage,
  pendingComponent: LoaderComponent,
})

function CompaniesListPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const searchParams = Route.useSearch()
  const companiesQuery = useSuspenseInfiniteQuery(
    getAllCompaniesQueryOptions({
      search: searchParams.search,
      countryCode: searchParams.countryCode,
    }),
  )
  const companies =
    companiesQuery.data.pages.flatMap((page) => page.companies) ?? []

  return (
    <section className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="font-bold capitalize tracking-tight">company list</h2>
        <div className="flex items-center space-x-4">
          <Button asChild size="lg">
            <Link to="/companies/create" className="space-x-2">
              <PlusIcon strokeWidth={3} />
              <span className="capitalize">create company</span>
            </Link>
          </Button>
          <Button
            size="lg"
            className="space-x-2 cursor-pointer"
            onClick={() => setUploadDialogOpen(true)}
          >
            <UploadIcon strokeWidth={3} />
            <span className="capitalize">upload companies</span>
          </Button>
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      <DataTable
        data={companies}
        columns={columns}
        isLoading={companiesQuery.isRefetching}
        fetchNextPage={companiesQuery.fetchNextPage}
        hasNextPage={companiesQuery.hasNextPage}
      />
    </section>
  )
}
