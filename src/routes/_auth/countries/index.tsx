import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { PlusIcon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/countries/table'
import { columns } from '@/components/countries/Columns'
import { LoaderComponent } from '@/components/ui/loader'
// Utils
import { getAllCountriesQueryOptions } from '@/apis/countries'

const countriesSearchParamsSchema = z
  .object({
    search: z.string(),
    isActive: z.boolean(),
  })
  .partial()

export const Route = createFileRoute('/_auth/countries/')({
  staticData: {
    breadcrumb: 'Countries',
  },
  validateSearch: zodValidator(countriesSearchParamsSchema),
  loaderDeps: ({ search: { search, isActive } }) => ({
    search,
    isActive,
  }),
  loader: async ({ context: { queryClient }, deps: { search, isActive } }) => {
    await queryClient.ensureQueryData(
      getAllCountriesQueryOptions({
        search,
        isActive,
      }),
    )
  },
  component: CountriesListPage,
  pendingComponent: LoaderComponent,
})

function CountriesListPage() {
  const { search, isActive } = Route.useSearch()
  const countriesQuery = useSuspenseQuery(
    getAllCountriesQueryOptions({
      search,
      isActive,
    }),
  )

  return (
    <section className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="font-bold capitalize tracking-tight">country list</h2>
        <Button asChild size="lg">
          <Link to="/countries/create" className="space-x-2">
            <PlusIcon strokeWidth={3} />
            <span className="capitalize">create country</span>
          </Link>
        </Button>
      </div>

      <DataTable
        data={countriesQuery.data.data}
        columns={columns}
        isLoading={countriesQuery.isRefetching}
      />
    </section>
  )
}
