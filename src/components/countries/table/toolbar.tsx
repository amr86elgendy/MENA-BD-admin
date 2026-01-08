import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './viewOption'
import { DataTableFacetedFilter } from './facetedFilter'
// Utils
import useDebounce from '@/hooks/useDebounceValue'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const routeApi = getRouteApi('/_auth/countries/')

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const searchParams = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  // Debounce search input
  const [debouncedSearch, searchValue, setSearchValue] = useDebounce<string>(
    searchParams.search ?? '',
    500,
  )

  useEffect(() => {
    if (debouncedSearch) {
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          search: debouncedSearch,
        }),
        replace: true,
      })
    } else {
      navigate({
        to: '.',
        search: (prev) => {
          const { search, ...rest } = prev
          return rest
        },
        replace: true,
      })
    }
  }, [debouncedSearch, navigate])

  useEffect(() => {
    if (!searchParams.search) {
      setSearchValue('')
    }
  }, [searchParams.search, setSearchValue])

  const isFiltered = searchParams.search || searchParams.isActive !== undefined

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search countries..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DataTableFacetedFilter
          param="isActive"
          title="Status"
          options={[
            { label: 'Active', value: true },
            { label: 'Inactive', value: false },
          ]}
        />

        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => {
              navigate({
                to: '.',
                search: {},
                replace: true,
              })
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
