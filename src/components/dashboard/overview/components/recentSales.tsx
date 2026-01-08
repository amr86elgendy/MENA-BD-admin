import { getRouteApi, Link } from '@tanstack/react-router'
// UI
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// Utils
import { USER_ROLES } from '@/constants'
import type { TOrder } from '@/types/order'

const routeApi = getRouteApi('/_auth')

export function RecentSales({ recentSales }: { recentSales: TOrder[] }) {
  const { getMeData } = routeApi.useRouteContext()

  const superAdmin = getMeData.role === USER_ROLES.superAdmin.value

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row flex-nowrap items-end justify-between">
        <div className="space-y-2">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            A quick overview of the latest orders placed on the platform.
          </CardDescription>
        </div>

        <Button asChild variant="link" className="px-0">
          <Link to="/orders" className="underline">
            View all
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {recentSales.map((order) => {
          const totalOrderPrice = superAdmin
            ? order?.total
            : order?.orderItems.reduce(
                (acc, item) =>
                  item.company === getMeData.company?._id
                    ? acc + +item.totalProductPrice
                    : acc,
                0,
              )
          return (
            <div className="flex items-center" key={order._id}>
              {/* Avatar */}
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.user.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.user.email}
                </p>
              </div>
              <div className="ml-auto font-medium">EGP {totalOrderPrice}</div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
