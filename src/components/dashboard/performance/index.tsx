import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';

import { TabsContent } from '@/components/ui/tabs';

import {
	useGetTopSellingCategories,
	useGetTopSellingProducts,
} from '@/apis/statistics';
import TopSellingProducts from './components/topSellingProducts';
import TopSellingCategories from './components/topSellingCategories';

export default function PerformanceTab({
	date,
}: {
	date: DateRange | undefined;
}) {
	const topSellingProducts = useGetTopSellingProducts({
		period: {
			from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
			to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
		},
	});
	const topSellingCategories = useGetTopSellingCategories({
		period: {
			from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
			to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
		},
	});

	return (
		<TabsContent
			value='performance'
			className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-7'>
				{topSellingProducts.isPending ? (
					<div>loading screen..</div>
				) : topSellingProducts.isError ? (
					<div>error screen...</div>
				) : (
					<TopSellingProducts products={topSellingProducts.data.products} />
				)}
				
				{topSellingCategories.isPending ? (
					<div>loading screen..</div>
				) : topSellingCategories.isError ? (
					<div>error screen...</div>
				) : (
					<TopSellingCategories
						categories={topSellingCategories.data.categories}
					/>
				)}
			</div>
		</TabsContent>
	);
}
