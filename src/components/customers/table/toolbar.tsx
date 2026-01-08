import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './viewOption'
import SingleDataTableFacetedFilter from './single-data-faceted-filter'
// Utils
import { USER_ROLES } from '@/constants'
import useDebounce from '@/hooks/useDebounceValue'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const routeApi = getRouteApi('/_auth/customers/')
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const searchParams = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [debouncedSearch, searchValue, setSearchValue] = useDebounce<string>(
    searchParams.search ?? '',
    500,
  )

  useEffect(() => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
      }),
      replace: true,
    })
  }, [debouncedSearch, navigate])

  useEffect(() => {
    if (!searchParams.search) {
      setSearchValue('')
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter customers..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <SingleDataTableFacetedFilter
            param="role"
            title="role"
            options={Object.values(USER_ROLES)}
          />
        )}
        {table.getColumn('isVerified') && (
          <SingleDataTableFacetedFilter
            param="isVerified"
            title="verified"
            options={[
              {
                label: 'verified',
                value: true,
              },
              {
                label: 'not verified',
                value: false,
              },
            ]}
          />
        )}
        {Object.keys(searchParams).length > 0 && (
          <Button
            variant="ghost"
            onClick={() =>
              navigate({
                to: '.',
              })
            }
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
