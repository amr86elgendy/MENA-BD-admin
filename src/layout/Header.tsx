import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  AlignLeft,
  CircleUser,
  LogOutIcon,
  UserRoundPlusIcon,
  BoltIcon,
} from 'lucide-react'
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
// Utils
import { useLogout } from '@/apis/auth'
import { USER_ROLES } from '@/constants'
import { useGlobalStore } from '@/store/global'

const route = getRouteApi('/_auth')

export function AppHeader() {
  const { getMeData } = route.useRouteContext()
  const navigate = route.useNavigate()

  const [fixedNav, setFixedNav] = useState(false)
  const toggleSidebar = useGlobalStore((state) => state.toggleSidebar)
  const toggleSidebarMobile = useGlobalStore(
    (state) => state.toggleSidebarMobile,
  )

  const handlefixedNav = () =>
    window.scrollY === 0 ? setFixedNav(false) : setFixedNav(true)

  useEffect(() => {
    window.addEventListener('scroll', () => handlefixedNav)
    return () => window.removeEventListener('scroll', handlefixedNav)
  }, [])

  const logoutMutation = useLogout()

  return (
    <nav
      className={`sticky left-0 right-0 top-0 z-50 flex h-20 items-center gap-x-8 border-b px-8 py-3 backdrop-blur backdrop-filter transition-shadow duration-200 ${
        fixedNav ? 'shadow-nav' : 'shadow-card'
      }`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div
        className="flex cursor-pointer items-center text-primary sm:hidden"
        onClick={toggleSidebarMobile}
      >
        <AlignLeft size={30} className="text-primary" />
      </div>
      <div
        className="hidden cursor-pointer text-primary md:inline-flex"
        onClick={toggleSidebar}
      >
        <AlignLeft size={25} />
      </div>
      {/* <BreadcrumbNav /> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full ml-auto"
          >
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="">
          <DropdownMenuItem
            className="flex gap-x-4"
            onClick={() => navigate({ to: '/my-profile' })}
          >
            <UserRoundPlusIcon size={18} />
            My account
          </DropdownMenuItem>
          {getMeData.role === USER_ROLES.admin.value && (
            <DropdownMenuItem
              className="flex gap-x-4"
              onClick={() => navigate({ to: '/company-profile' })}
            >
              <BoltIcon size={18} />
              My company profile
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-x-4"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOutIcon size={18} /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
