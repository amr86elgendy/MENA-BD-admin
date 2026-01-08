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
  _id: string
  name_en: string
}

type Props<S> = {
  fieldTitle: string
  nameInSchema: NestedKeyOf<S>
  options?: Option[]
  className?: string
}

export function CustomMultiSelect<S>({
  fieldTitle,
  nameInSchema,
  options,
  className,
}: Props<S>) {
  const form = useFormContext()

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
              options?.map((c) => ({
                label: c.name_en,
                value: c._id,
              })) ?? []
            }
            onValueChange={field.onChange}
            defaultValue={field.value}
            variant="inverted"
            maxCount={3}
            className={className}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
