import type { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
// UI
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// Utils
import { cn } from '@/lib/utils'

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
    }[keyof T & string]
  : never

type Props<S> = {
  fieldTitle: string
  nameInSchema: NestedKeyOf<S>
  optional?: boolean
  className?: string
} & InputHTMLAttributes<HTMLInputElement>

export function CustomInput<S>({
  fieldTitle,
  nameInSchema,
  className,
  optional,
  ...props
}: Props<S>) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={nameInSchema} className={cn('text-xs')}>
            {fieldTitle}{' '}
            {optional && (
              <span className="text-xs text-gray-500">(optional)</span>
            )}
          </FormLabel>

          <FormControl>
            <Input id={nameInSchema} {...props} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
