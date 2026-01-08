import {
  Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import type { GetTopSellingProductsReturnType } from '@/apis/statistics';
import { cn } from '@/lib/utils';

export default function TopSellingProducts({
	products,
}: GetTopSellingProductsReturnType) {
	return (
		<Card className='lg:col-span-4'>
			<CardHeader className='flex-row items-end justify-between'>
				<div className='space-y-1'>
					<CardTitle>Top selling Products</CardTitle>
					<CardDescription>
						A curated list showcasing the most popular items based on recent
						sales data.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{products.map((product, index) => {
					return (
						<div
							className='flex items-center gap-x-4 rounded border px-4 py-2'
							key={product._id}>
							{/* Avatar */}
							<img
								className='h-20 w-20 flex-shrink-0 rounded-full object-contain'
								src={product.variant.images[0].url}
								alt={product.variant.images[0].name}
							/>
							<div className='space-y-2'>
								<p className='line-clamp-1 text-sm font-medium leading-none'>
									{product.variant.name_en}
								</p>
								<p className='text-sm'>
									Unit Count:{' '}
									<span className='font-medium'>
										{product.variant.unitCount}
									</span>
								</p>
								<p className='text-sm'>
									price:{' '}
									<span className='font-medium'>{product.variant.price}</span>
								</p>

								{product.variant.flavor_en && (
									<p className='text-sm'>
										Flavor:{' '}
										<span className='font-medium'>
											{product.variant.flavor_en}
										</span>
									</p>
								)}
							</div>

							<div
								className={cn(
									'ml-auto flex-shrink-0 text-2xl font-semibold underline',
									{
										'text-3xl text-green-600': index === 0,
									}
								)}>
								{product.totalSold}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
