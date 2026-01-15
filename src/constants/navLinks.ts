import {
  Building2Icon,
  GlobeIcon,
  HomeIcon,
  UsersIcon,
  FileTextIcon,
  type LucideIcon,
} from 'lucide-react'

type TSidebarLink = {
  title: string
  url: string
  icon: LucideIcon
}

export const links: TSidebarLink[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: HomeIcon,
  },
  // {
  //   title: 'Orders',
  //   url: '/orders',
  //   icon: ShoppingCartIcon,
  // },
  // {
  //   title: 'Products',
  //   url: '/products',
  //   icon: PackageIcon,
  // },
  // {
  //   title: 'Categories',
  //   url: '/categories',
  //   icon: Layers3Icon,
  // },
  {
    title: 'Companies',
    url: '/companies',
    icon: Building2Icon,
  },
  {
    title: 'Countries',
    url: '/countries',
    icon: GlobeIcon,
  },
  {
    title: 'customers',
    url: '/customers',
    icon: UsersIcon,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileTextIcon,
  },
]
