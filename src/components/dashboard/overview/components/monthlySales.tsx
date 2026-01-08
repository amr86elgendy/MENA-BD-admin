import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

import { useGetMonthlySales } from '@/apis/statistics';
import { MONTHS } from '@/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export const description = 'A multiple bar chart';

const chartConfig = {
	totalSales: {
		label: 'Total Sales',
	},
	totalItems: {
		label: 'Total Items',
	},
} satisfies ChartConfig;

export function MonthlySales() {
	const [year, setYear] = useState(new Date().getFullYear());

	const desktopView = window.innerWidth > 768;

	const monthlySalesQuery = useGetMonthlySales({ year });

	const chartData = Object.keys(MONTHS).map(monthNum => {
		const salesData = monthlySalesQuery.data?.monthlySales.find(
			sale => sale.month.toString() === monthNum
		);

		return {
			month: MONTHS[Number(monthNum) as keyof typeof MONTHS],
			totalSales: salesData ? salesData.totalSales : 0,
		};
	});

	if (monthlySalesQuery.isError) return <div>error...</div>;

	return (
		<Card className='lg:col-span-7'>
			<CardHeader className='flex flex-row items-end justify-between'>
				<div className='space-y-2'>
					<CardTitle>Monthly Sales</CardTitle>
					<CardDescription>January - December {year}</CardDescription>
				</div>
				<div className='space-x-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='icon'
									variant='outline'
									onClick={() => setYear(prev => prev - 1)}>
									<ChevronLeftIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Previous Year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='icon'
									variant='outline'
									onClick={() => setYear(prev => prev + 1)}>
									<ChevronRightIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Next Year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					{monthlySalesQuery.isPending ? (
						<div>loading...</div>
					) : (
						<BarChart
							accessibilityLayer
							data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='month'
								tickLine={false}
								tickMargin={2}
								axisLine={false}
								tickFormatter={value => value.slice(0, 3)}
							/>
							{desktopView && (
								<YAxis
									stroke='#888888'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `$${value}`}
								/>
							)}
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator='dashed' />}
							/>
							<Bar
								dataKey='totalSales'
								radius={4}
							/>
							{/* <Bar
							dataKey='totalItems'
							// fill='red'
							radius={4}
						/> */}
						</BarChart>
					)}
				</ChartContainer>
			</CardContent>
			{/* <CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='flex gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='leading-none text-muted-foreground'>
					Showing total visitors for the last 6 months
				</div>
			</CardFooter> */}
		</Card>
	);
}
