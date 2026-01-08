import { useFormContext } from 'react-hook-form'
// UI
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
    }[keyof T & string]
  : never

type Option = {
  id?: string | number
  name_en?: string
  nameEn?: string
  name_ar?: string
  nameAr?: string
  code?: string
  [key: string]: any
}

type Props<S> = {
  fieldTitle: string
  nameInSchema: NestedKeyOf<S>
  options?: Option[]
  className?: string
  valueKey?: string
  labelKey?: string
  placeholder?: string
}

export function CustomSelect<S>({
  fieldTitle,
  nameInSchema,
  options,
  className,
  valueKey,
  labelKey,
  placeholder = 'Select...',
}: Props<S>) {
  const form = useFormContext()

  // Determine value and label keys with fallbacks for backward compatibility
  const getValue = (item: Option): string => {
    if (valueKey) return String(item[valueKey] ?? '')
    if (item._id) return String(item._id)
    if (item.id) return String(item.id)
    if (item.code) return item.code
    return ''
  }

  const getLabel = (item: Option): string => {
    if (labelKey) return String(item[labelKey] ?? '')
    if (item.nameEn) return item.nameEn
    if (item.nameAr) return item.nameAr
    if (item.code) return item.code
    return ''
  }

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema} className="text-xs">
            {fieldTitle}
          </FormLabel>

          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger id={nameInSchema} className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options?.map((item, index) => {
                const value = getValue(item)
                const label = getLabel(item)
                return (
                  <SelectItem
                    key={`${nameInSchema}_${value}_${index}`}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
