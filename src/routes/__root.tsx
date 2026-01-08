import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { Toaster } from '@/components/ui/sonner'
import { NotFound } from '@/components/ui/not-found'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  ),
  notFoundComponent: NotFound,
})
