import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
// UI
import { AppHeader } from '@/layout/Header'
import { AppSidebar } from '@/layout/Sidebar'
// Utils
import { refreshAccessTokenFn, getMeQueryOptions } from '@/apis/auth'
import { getIsAuthenticatedFromStore } from '@/store/auth'
import { useGlobalStore } from '@/store/global'
import { LoaderComponent } from '@/components/ui/loader'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const isAuthenticated = getIsAuthenticatedFromStore()
    const rememberMe = JSON.parse(localStorage.getItem('remember-me')!)

    // Early return if already authenticated
    if (isAuthenticated) {
      const getMeData = await queryClient.ensureQueryData(getMeQueryOptions())
      return { getMeData }
    }

    // Handle unauthenticated users
    if (!rememberMe) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Try to refresh token for remembered users
    try {
      await refreshAccessTokenFn()
      const getMeData = await queryClient.ensureQueryData(getMeQueryOptions())
      return { getMeData }
    } catch (error) {
      localStorage.removeItem('remember-me')
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthLayout,
  pendingComponent: LoaderComponent,
})

function AuthLayout() {
  const openSidebar = useGlobalStore((state) => state.openSidebar)
  console.log('AuthLayout render')
  return (
    <div className="">
      <AppSidebar />
      <div
        className={`absolute right-0 transition-all duration-500 ${
          openSidebar ? 'left-60' : 'left-0 sm:left-16'
        } `}
      >
        <AppHeader />
        <main className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
