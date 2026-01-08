import { useQuery } from '@tanstack/react-query'
import { clientApi } from '../client'
import { type TOrder } from '@/types/order'
import { type TVariant } from '@/types/variant'
import { type TCategory } from '@/types/category'
import { MONTHS } from '@/constants'

// ####################### Get Total Sales #######################
type Period = { from: string | undefined; to: string | undefined }

type GetTotalSalesReturnType = {
  totalSales: number
  totalOrders: number
  totalProductsSold: number
  averageOrderValue: number
  recentSales: TOrder[]
}

const getTotalSales = async (params: {
  period?: Period
}): Promise<GetTotalSalesReturnType> => {
  const { data } = await clientApi({
    url: 'statistics/total-sales',
    method: 'GET',
    params,
  })
  return data
}

export function useGetTotalSales(props: { period?: Period }) {
  return useQuery({
    queryKey: ['get-total-sales', props],
    queryFn: () => getTotalSales(props),
  })
}

// ####################### Get Company Orders #######################
type GetMonthlySalesReturnType = {
  monthlySales: {
    totalOrders: number
    totalItems: number
    totalSales: number
    month: keyof typeof MONTHS
  }[]
}

const getMonthlySales = async ({
  year,
}: {
  year: number
}): Promise<GetMonthlySalesReturnType> => {
  const { data } = await clientApi({
    url: `statistics/monthly-sales/${year}`,
    method: 'GET',
  })
  return data
}

export function useGetMonthlySales(props: { year: number }) {
  return useQuery({
    queryKey: ['get-monthly-sales', props],
    queryFn: () => getMonthlySales(props),
    placeholderData: (prevData) => prevData,
  })
}

// ####################### Get Top Selling Products #######################
export type GetTopSellingProductsReturnType = {
  products: {
    _id: string
    company: string
    variant: TVariant
    totalSold: number
  }[]
}

const getTopSellingProducts = async (params: {
  period?: Period
}): Promise<GetTopSellingProductsReturnType> => {
  const { data } = await clientApi({
    url: 'statistics/top-selling-products',
    method: 'GET',
    params,
  })
  return data
}

export function useGetTopSellingProducts(props: { period?: Period }) {
  return useQuery({
    queryKey: ['get-top-selling-products', props],
    queryFn: () => getTopSellingProducts(props),
  })
}

// ####################### Get Top Selling Categories #######################
export type GetTopSellingCategoriesReturnType = {
  categories: { _id: string; category: TCategory; totalSold: number }[]
}

const getTopSellingCategories = async (params: {
  period?: Period
}): Promise<GetTopSellingCategoriesReturnType> => {
  const { data } = await clientApi({
    url: 'statistics/top-selling-categories',
    method: 'GET',
    params,
  })
  return data
}

export function useGetTopSellingCategories(props: { period?: Period }) {
  return useQuery({
    queryKey: ['get-top-selling-categories', props],
    queryFn: () => getTopSellingCategories(props),
  })
}

// ####################### Get Top Area Sales #######################
export type GetTopAreaSalesReturnType = {
  areaSales: { area: string; totalOrders: number }[]
}

const getTopAreaSales = async (params: {
  period?: Period
}): Promise<GetTopAreaSalesReturnType> => {
  const { data } = await clientApi({
    url: 'statistics/top-area-sales',
    method: 'GET',
    params,
  })
  return data
}

export function useGetTopAreaSales(props: { period?: Period }) {
  return useQuery({
    queryKey: ['get-top-area-sales', props],
    queryFn: () => getTopAreaSales(props),
  })
}
