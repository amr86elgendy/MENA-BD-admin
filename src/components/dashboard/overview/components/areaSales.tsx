import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';
import { TrendingUpIcon } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useGetTopAreaSales } from '@/apis/statistics';

const chartConfig = {
	area: {
		label: 'Area',
	},
	totalOrders: {
		label: 'Total Orders',
	},
} satisfies ChartConfig;

export default function AreaSales({
	period,
}: {
	period: { from: string | undefined; to: string | undefined };
}) {
	const areaQuery = useGetTopAreaSales({ period });
	const chartData = areaQuery.data?.areaSales ?? [];
	return (
		<Card className='border lg:col-span-4'>
			<CardHeader className='flex-row items-end justify-between'>
				<div className='space-y-2'>
					<CardTitle>Top Sales By Area</CardTitle>
					<CardDescription className='flex gap-x-2'>
						<TrendingUpIcon />
						<span>
							showcasing product performance and sales trends across different
							locations.
						</span>
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{
							right: 25,
						}}>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey='area'
							type='category'
							hide
						/>
						<XAxis
							dataKey='totalOrders'
							type='number'
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='line' />}
						/>
						<Bar
							dataKey='totalOrders'
							layout='vertical'
							fill='#0f1729'
							barSize={50}
							radius={4}>
							<LabelList
								dataKey='area'
								position='insideLeft'
								offset={8}
								className='fill-white'
								fontSize={16}
							/>
							<LabelList
								dataKey='totalOrders'
								position='right'
								offset={8}
								className='fill-black'
								fontSize={20}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
