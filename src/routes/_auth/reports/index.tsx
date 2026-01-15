import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { PlusIcon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/reports/table'
import { columns } from '@/components/reports/Columns'
import { LoaderComponent } from '@/components/ui/loader'
// Utils
import { getAllReportsQueryOptions } from '@/apis/reports'

const reportsSearchParamsSchema = z
  .object({
    search: z.string(),
    isActive: z.boolean(),
    countryCode: z.string(),
  })
  .partial()

export const Route = createFileRoute('/_auth/reports/')({
  staticData: {
    breadcrumb: 'Reports',
  },
  validateSearch: zodValidator(reportsSearchParamsSchema),
  loaderDeps: ({ search: { search, isActive, countryCode } }) => ({
    search,
    isActive,
    countryCode,
  }),
  loader: async ({
    context: { queryClient },
    deps: { search, isActive, countryCode },
  }) => {
    await queryClient.ensureQueryData(
      getAllReportsQueryOptions({
        search,
        isActive,
        countryCode,
      }),
    )
  },
  component: ReportsListPage,
  pendingComponent: LoaderComponent,
})

function ReportsListPage() {
  const { search, isActive, countryCode } = Route.useSearch()
  const reportsQuery = useSuspenseQuery(
    getAllReportsQueryOptions({
      search,
      isActive,
      countryCode,
    }),
  )

  return (
    <section className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="font-bold capitalize tracking-tight">reports list</h2>
        <Button asChild size="lg">
          <Link to="/reports/create" className="space-x-2">
            <PlusIcon strokeWidth={3} />
            <span className="capitalize">create report</span>
          </Link>
        </Button>
      </div>

      <DataTable
        data={reportsQuery.data.data}
        columns={columns}
        isLoading={reportsQuery.isRefetching}
      />
    </section>
  )
}
