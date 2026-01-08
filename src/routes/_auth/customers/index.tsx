import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { LoaderIcon } from 'lucide-react'
// UI
import { DataTable } from '@/components/customers/table'
import { columns } from '@/components/customers/Columns'
import { LoaderComponent } from '@/components/ui/loader'
// Utils
import { unionOfLiterals } from '@/lib/utils'
import { USER_ROLES } from '@/constants'
import { getCustomersQueryOptions } from '@/apis/customers'

const customersSearchParamsSchema = z
  .object({
    search: z.string(),
    role: unionOfLiterals(
      Object.values(USER_ROLES).map((status) => status.value),
    ),
    isVerified: z.boolean(),
  })
  .partial()

export const Route = createFileRoute('/_auth/customers/')({
  validateSearch: zodValidator(customersSearchParamsSchema),
  loader: async ({ context: { queryClient }, location }) => {
    queryClient.ensureInfiniteQueryData(
      getCustomersQueryOptions(location.search),
    )
  },
  component: CustomersListPage,
  errorComponent: () => <div>Error loading customers</div>,
  pendingComponent: () => LoaderComponent,
})

function CustomersListPage() {
  const searchParams = Route.useSearch()
  const customersQuery = useSuspenseInfiniteQuery(
    getCustomersQueryOptions(searchParams),
  )
  const customers =
    customersQuery.data.pages.flatMap((page) => page.users) ?? []
  return (
    <section className="h-full flex-1 flex-col space-y-8 md:flex">
      <h2 className="font-bold capitalize tracking-tight">customer list</h2>

      <DataTable
        data={customers}
        columns={columns}
        isLoading={customersQuery.isRefetching}
        fetchNextPage={customersQuery.fetchNextPage}
        hasNextPage={customersQuery.hasNextPage}
      />
      {customersQuery.hasNextPage && customersQuery.isFetchingNextPage && (
        <div className="flex items-center justify-center">
          {<LoaderIcon className="animate-spin" size={30} />}
        </div>
      )}
    </section>
  )
}
