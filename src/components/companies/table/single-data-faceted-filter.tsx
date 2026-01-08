import { CheckIcon, CirclePlusIcon } from 'lucide-react'
// UI
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { getRouteApi } from '@tanstack/react-router'
import type { TOrderParams } from '@/types/order'

interface DataTableFacetedFilterProps {
  param: keyof TOrderParams
  title?: string
  options: {
    label: string
    value: string | boolean
    icon?: React.ComponentType<{ className?: string }>
  }[]
}
const routeApi = getRouteApi('/_auth/orders/')
export default function SingleDataTableFacetedFilter({
  param,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const navigate = routeApi.useNavigate()
  const searchParams = routeApi.useSearch()
  const selectedValue = searchParams[param]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CirclePlusIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValue !== undefined && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {options.find((op) => op.value === selectedValue)?.label}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = searchParams[param] === option.value
                return (
                  <CommandItem
                    key={option.value.toString()}
                    value={option.value.toString()}
                    onSelect={() => {
                      if (isSelected) {
                        navigate({
                          to: '.',
                          search: (prev) => {
                            const newSearch = { ...prev }
                            delete newSearch[param]
                            return newSearch
                          },
                        })
                      } else {
                        navigate({
                          to: '.',
                          search: (prev) => ({
                            ...prev,
                            [param]: option.value,
                          }),
                        })
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-xs border border-primary',
                        isSelected
                          ? 'bg-primary'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon
                        className={cn('h-4 w-4  text-primary-foreground')}
                      />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValue !== undefined && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      navigate({
                        to: '.',
                        search: (prev) => {
                          const newSearch = { ...prev }
                          delete newSearch[param]
                          return newSearch
                        },
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
