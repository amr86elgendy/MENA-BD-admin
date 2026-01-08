import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
// Utils
import { cn } from '@/lib/utils'

type CalendarDate = React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  before: Date
  after: Date
}

export function CalendarDateRangePicker({
  date,
  setDate,
  className,
  before,
  after,
}: CalendarDate) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !date?.from && 'text-muted-foreground',
            )}
          >
            {date?.from ? (
              `${format(date.from, 'PPP')} to ${format(date.to ?? after, 'PPP')}`
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            disabled={{ before, after }}
            selected={date}
            onSelect={(date) => {
              console.log('Selected date:', date)

              setDate(date)
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// initialFocus
// mode='range'
// defaultMonth={date?.from}
// disabled={{ before, after }}
// selected={date}
// onSelect={setDate}
// numberOfMonths={2}
