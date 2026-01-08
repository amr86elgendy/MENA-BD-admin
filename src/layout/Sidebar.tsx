import { Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, X } from 'lucide-react'
// Utils
import { useGlobalStore } from '@/store/global'
import { cn } from '@/lib/utils'
import { links } from '@/constants/navLinks'

export function AppSidebar() {
  const { pathname } = useLocation()

  const openSidebar = useGlobalStore((state) => state.openSidebar)
  const openSidebarMobile = useGlobalStore((state) => state.openSidebarMobile)
  const toggleSidebarMobile = useGlobalStore(
    (state) => state.toggleSidebarMobile,
  )

  return (
    <aside
      className={cn(
        'fixed bottom-0 left-0 top-0 z-30 flex overflow-hidden border-primary bg-primary transition-all duration-500 sm:-translate-x-0',
        openSidebar ? 'sm:w-60' : 'sm:w-16',
        openSidebarMobile ? 'w-full translate-x-0' : 'w-0 -translate-x-full',
      )}
    >
      <ul className="absolute left-0 top-0 w-full">
        <li className="mb-2 flex h-20 items-center justify-between text-white">
          <Link to="/" className="relative flex cursor-pointer">
            <span className="relative flex h-16 min-w-16 items-center justify-center">
              <LayoutDashboard color="white" fontSize={30} />
            </span>
            <span className="relative flex h-16 items-center whitespace-nowrap text-lg font-bold capitalize">
              MENA BD
            </span>
          </Link>
          <div
            className="mr-4 cursor-pointer text-white sm:hidden"
            onClick={toggleSidebarMobile}
          >
            <X fontSize={30} />
          </div>
        </li>
        {links
          .map((li, i) => (
            <li
              key={i}
              className={cn(
                'link group relative w-full rounded-bl-3xl rounded-tl-3xl text-white hover:bg-gray-50',
                pathname.split('/')[1] === li.url.substring(1) &&
                  'selected bg-gray-50',
              )}
              onClick={toggleSidebarMobile} // need to set a condition doing that only in mobilescreen
            >
              <Link
                to={li.url}
                className="relative flex w-full group-hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                <span className="relative flex h-14 min-w-16 items-center justify-center">
                  <li.icon fontSize={30} />
                </span>
                <span className="relative flex h-14 items-center whitespace-nowrap capitalize">
                  {li.title}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </aside>
  )
}
