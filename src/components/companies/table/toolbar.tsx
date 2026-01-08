import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
// UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './viewOption'
import { DataTableFacetedFilter } from './facetedFilter'
// Utils
import useDebounce from '@/hooks/useDebounceValue'
import { getAllCountriesQueryOptions } from '@/apis/countries'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const routeApi = getRouteApi('/_auth/companies/')

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const searchParams = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  // Get countries for the filter dropdown
  const { data: countriesData } = useSuspenseQuery(
    getAllCountriesQueryOptions(),
  )
  const countries = countriesData?.data?.filter((c) => c.isActive) || []

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
      })
    } else {
      navigate({
        to: '.',
        search: (prev) => {
          const { search, ...rest } = prev
          return rest
        },
      })
    }
  }, [debouncedSearch, navigate])

  useEffect(() => {
    if (!searchParams.search) {
      setSearchValue('')
    }
  }, [searchParams.search, setSearchValue])

  const isFiltered = searchParams.search || searchParams.countryCode

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search companies..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DataTableFacetedFilter
          param="countryCode"
          title="Country"
          options={countries.map((country) => ({
            label: country.nameEn,
            value: country.code,
          }))}
        />

        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => {
              navigate({
                to: '.',
                search: {},
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
