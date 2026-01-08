import { useFormContext } from 'react-hook-form';
// UI
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import TiptapEditor from '@/lib/tiptap';

type NestedKeyOf<T> = T extends object
	? {
			[K in keyof T & string]: T[K] extends object
				? `${K}.${NestedKeyOf<T[K]>}`
				: K;
		}[keyof T & string]
	: never;

type Props<S> = {
	fieldTitle: string;
	nameInSchema: NestedKeyOf<S>;
	className?: string;
	dir?: 'rtl' | 'ltr';
};

export function CustomTiptapInput<S>({
	fieldTitle,
	nameInSchema,
	className,
	dir = 'ltr',
}: Props<S>) {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={nameInSchema}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel
						htmlFor={nameInSchema}
						className='text-xs'>
						{fieldTitle}
					</FormLabel>
					<FormControl>
						<TiptapEditor
							dir={dir}
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
