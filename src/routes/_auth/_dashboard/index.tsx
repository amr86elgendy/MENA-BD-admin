import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
// UI
import { getAllCompaniesQueryOptions } from '@/apis/companies'
import { getAllUsersQueryOptions } from '@/apis/users'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/_dashboard/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getAllUsersQueryOptions()),
      queryClient.ensureInfiniteQueryData(
        getAllCompaniesQueryOptions({ limit: 1 }),
      ),
    ])
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { data: users } = useSuspenseQuery(getAllUsersQueryOptions())

  const companiesQuery = useSuspenseInfiniteQuery(
    getAllCompaniesQueryOptions({ limit: 1 }),
  )
  const totalCompanies = companiesQuery.data.pages[0]?.totalCount || 0

  return (
    <section className="space-y-4">
      <h2 className="font-bold capitalize tracking-tight">dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
            <p className="text-sm text-gray-600 mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalCompanies}
            </div>
            <p className="text-sm text-gray-600 mt-1">Companies in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users?.filter((u) => u.isVerified).length || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Verified accounts</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
