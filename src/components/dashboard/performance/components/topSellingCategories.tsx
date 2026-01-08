import {
  Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import type { GetTopSellingCategoriesReturnType } from '@/apis/statistics';
import { cn } from '@/lib/utils';

export default function TopSellingCategories({
	categories,
}: GetTopSellingCategoriesReturnType) {
	return (
		<Card className='lg:col-span-3'>
			<CardHeader className='flex-row items-end justify-between'>
				<div className='space-y-1'>
					<CardTitle>Top selling Categories</CardTitle>
					<CardDescription>
						A snapshot of the most popular product categories based on recent
						sales, helping you identify trends and customer preferences.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{categories.map((cat, index) => {
					return (
						<div
							className='flex items-center gap-x-4 rounded border px-4 py-2'
							key={cat._id}>
							{/* Avatar */}

							<p className='line-clamp-1 text-sm font-medium leading-none'>
								{cat.category.name_en}
							</p>

							<div
								className={cn(
									'ml-auto flex-shrink-0 text-2xl font-semibold underline',
									{
										'text-3xl text-green-600': index === 0,
									}
								)}>
								{cat.totalSold}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
