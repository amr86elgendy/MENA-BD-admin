import { type ClassValue, clsx } from 'clsx';
import type { FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatPrice(price: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EGP',
	}).format(price);
}

export const getDirtyFields = <T extends FieldValues>(
	allFields: T,
	dirtyFields: Partial<Record<keyof T, any>>
): Partial<T> => {
	const changedFieldValues = Object.keys(dirtyFields).reduce(
		(acc, currentField) => {
			if (dirtyFields[currentField]) {
				return {
					...acc,
					[currentField]: allFields[currentField],
				};
			} else {
				return acc;
			}
		},
		{} as Partial<T>
	);

	return changedFieldValues;
};

export function unionOfLiterals<T extends string | number>(
	constants: readonly T[]
) {
	const literals = constants.map(x => z.literal(x)) as unknown as readonly [
		z.ZodLiteral<T>,
		z.ZodLiteral<T>,
		...z.ZodLiteral<T>[],
	];
	return z.union(literals);
}

export function filterTruthyValues<T extends Record<string, any>>(
	obj: T
): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([, value]) => Boolean(value))
	) as Partial<T>;
}
