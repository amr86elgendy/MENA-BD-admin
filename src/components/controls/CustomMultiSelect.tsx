import { useFormContext } from 'react-hook-form'
// UI
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends Array<any>
        ? K
        : T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
    }[keyof T & string]
  : never

type Option = {
  _id?: string
  id?: string | number
  name_en?: string
  name?: string
  label?: string
  value?: string | number
  [key: string]: any
}

type Props<S> = {
  fieldTitle: string
  nameInSchema: NestedKeyOf<S>
  options?: Option[]
  className?: string
  valueKey?: string
  labelKey?: string
  maxCount?: number
}

export function CustomMultiSelect<S>({
  fieldTitle,
  nameInSchema,
  options,
  className,
  valueKey,
  labelKey,
  maxCount,
}: Props<S>) {
  const form = useFormContext()

  // Determine value and label keys with fallbacks
  const getValue = (item: Option): string => {
    if (valueKey) return String(item[valueKey] ?? '')
    if (item.value !== undefined) return String(item.value)
    if (item.id !== undefined) return String(item.id)
    if (item._id) return String(item._id)
    return ''
  }

  const getLabel = (item: Option): string => {
    if (labelKey) return String(item[labelKey] ?? '')
    if (item.label) return item.label
    if (item.name) return item.name
    if (item.name_en) return item.name_en
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
          <MultiSelect
            options={
              options?.map((item) => ({
                label: getLabel(item),
                value: getValue(item),
              })) ?? []
            }
            onValueChange={field.onChange}
            defaultValue={field.value}
            variant="inverted"
            maxCount={maxCount}
            className={className}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
