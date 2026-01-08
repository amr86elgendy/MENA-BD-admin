import { useFormContext } from 'react-hook-form'
// UI
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
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
  description?: string
}

export function CustomSwitch<S>({
  fieldTitle,
  nameInSchema,
  className,
  optional,
  description,
}: Props<S>) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-center justify-between rounded-lg border p-4',
            className,
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {fieldTitle}{' '}
              {optional && (
                <span className="text-xs text-gray-500">(optional)</span>
              )}
            </FormLabel>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={form.formState.isSubmitting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
