import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import {
	ActivityIcon,
	BringToFrontIcon,
	DollarSignIcon,
	ListOrderedIcon,
} from 'lucide-react';
// UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { MonthlySales } from './components/monthlySales';
import { RecentSales } from './components/recentSales';
import AreaSales from './components/areaSales';
// Utils
import { useGetTotalSales } from '@/apis/statistics';

export default function OverviewTab({ date }: { date: DateRange | undefined }) {
	const period = {
		from: date?.from ? format(date?.from, 'yyyy-MM-dd') : undefined,
		to: date?.to ? format(date?.to, 'yyyy-MM-dd') : undefined,
	};
	const totalSalesQuery = useGetTotalSales({ period });

	const statistics = [
		{
			title: 'total sales',
			value: `EGP ${totalSalesQuery.data?.totalSales.toLocaleString()}`,
			icon: DollarSignIcon,
		},
		{
			title: 'total products sold',
			value: totalSalesQuery.data?.totalProductsSold.toLocaleString(),
			icon: BringToFrontIcon,
		},
		{
			title: 'total orders',
			value: totalSalesQuery.data?.totalOrders.toLocaleString(),
			icon: ListOrderedIcon,
		},
		{
			title: 'average order value',
			value: `EGP ${totalSalesQuery.data?.averageOrderValue.toFixed(2).toLocaleString()}`,
			icon: ActivityIcon,
		},
	];

	return (
		<TabsContent
			value='overview'
			className='space-y-4'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{statistics.map(stat => (
					<Card key={stat.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium capitalize'>
								{stat.title}
							</CardTitle>
							<stat.icon
								className='text-gray-400'
								size={20}
							/>
						</CardHeader>
						<CardContent>
							{totalSalesQuery.isPending ? (
								<Skeleton className='mt-2 h-4 w-1/4' />
							) : (
								<div className='text-2xl font-bold'>{stat.value}</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>
			<div className='grid gap-4 lg:grid-cols-7'>
				<AreaSales period={period} />

				<RecentSales recentSales={totalSalesQuery.data?.recentSales ?? []} />

				<MonthlySales />
			</div>
		</TabsContent>
	);
}
