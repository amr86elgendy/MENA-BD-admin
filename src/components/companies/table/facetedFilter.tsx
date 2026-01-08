import { getRouteApi } from '@tanstack/react-router'
import { CheckIcon, CirclePlusIcon } from 'lucide-react'
// UI
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
// Utils
import { cn } from '@/lib/utils'
import type { TCompaniesParams } from '@/types/company'

type ArrayProperties<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Array<any> ? K : never
  }[keyof T]
>

interface DataTableFacetedFilterProps {
  param: keyof ArrayProperties<TCompaniesParams>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

const routeApi = getRouteApi('/_auth/companies/')

export function DataTableFacetedFilter({
  param,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const navigate = routeApi.useNavigate()
  const searchParams = routeApi.useSearch()
  const selectedValues = searchParams[param] ?? []

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CirclePlusIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[300px] p-0" align="start">
        <Command
          filter={(value, search) => {
            const name = options.find(
              (o) => o.value.toString() === value.toString(),
            )?.label
            if (
              name &&
              name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
            )
              return 1
            return 0
          }}
        >
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.find(
                  (el) => el === option.value,
                )
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      navigate({
                        to: '.',
                        search: (prev) => {
                          const values = prev[param] || []
                          const newValues = isSelected
                            ? values.filter((v) => v !== option.value)
                            : values.includes(option.value)
                              ? values
                              : [...values, option.value]

                          return {
                            ...prev,
                            [param]:
                              newValues.length > 0 ? newValues : undefined,
                          }
                        },
                      })
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues && selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      navigate({
                        to: '.',
                        search: (prev) => ({
                          ...prev,
                          [param]: [],
                        }),
                      })
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
