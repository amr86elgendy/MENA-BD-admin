import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { clientApi } from '../client'
import type { TOrder, TOrderParams } from '@/types/order'

// ####################### Get All Orders #######################
type GetOrdersReturnType = {
  currentPage: number
  lastPage: number
  orders: TOrder[]
  totalCount: number
}

const getAllOrders = async ({
  pageParam,
  ...rest
}: {
  pageParam: number
}): Promise<GetOrdersReturnType> => {
  const params = { page: pageParam, ...rest }
  const { data } = await clientApi({
    url: 'orders',
    method: 'GET',
    params,
  })
  return data
}

export const allOrdersQueryOptions = (props: Partial<TOrderParams>) =>
  infiniteQueryOptions({
    queryKey: ['get-all-orders', props],
    queryFn: ({ pageParam }) => getAllOrders({ pageParam, ...props }),
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: ({ currentPage, lastPage }) => {
      if (currentPage < lastPage) {
        return currentPage + 1
      } else {
        return undefined
      }
    },
  })

// ####################### Get Company Orders #######################
const getCompanyOrders = async ({
  pageParam,
  ...rest
}: {
  pageParam: number
}): Promise<GetOrdersReturnType> => {
  const params = { page: pageParam, ...rest }
  const { data } = await clientApi({
    url: 'orders/my-company-orders',
    method: 'GET',
    params,
  })
  return data
}

export const companyOrdersQueryOptions = (props: Partial<TOrderParams>) =>
  infiniteQueryOptions({
    queryKey: ['get-company-orders', props],
    queryFn: ({ pageParam }) => getCompanyOrders({ pageParam, ...props }),
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: ({ currentPage, lastPage }) => {
      if (currentPage < lastPage) {
        return currentPage + 1
      } else {
        return undefined
      }
    },
  })

// ####################### View Order #######################
type GetOrderReturnType = {
  order: TOrder
}
export const viewOrder = async ({
  id,
}: {
  id: string
}): Promise<GetOrderReturnType> => {
  const { data } = await clientApi({
    url: `orders/${id}`,
    method: 'GET',
  })
  return data
}

export function viewOrderQueryOptions(props: { id: string }) {
  return queryOptions({
    queryKey: ['single-order', props],
    queryFn: () => viewOrder(props),
    select: (data) => data.order,
  })
}

// ####################### Create Order #######################
const createOrder = async ({
  data: orderData,
}: {
  data: Record<string, any>
}) => {
  const { data } = await clientApi({
    url: `orders`,
    method: 'POST',
    data: orderData,
  })
  return data
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}

// ####################### Update Order #######################
const updateOrder = async ({
  data: orderData,
  id,
}: {
  data: Record<string, any>
  id: string | undefined
}) => {
  const { data } = await clientApi({
    url: `orders/${id}`,
    method: 'PATCH',
    data: orderData,
  })
  return data
}

export function useUpdateOrder() {
  return useMutation({
    mutationFn: updateOrder,
  })
}

// ####################### Delete Order #######################
const deleteOrder = async ({
  id,
}: {
  id: string | undefined
}): Promise<{ msg: string }> => {
  const { data } = await clientApi({
    url: `orders/${id}`,
    method: 'DELETE',
  })
  return data
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOrder,
    onSettled: () => {
      // parameters: data, error, variables, context
      queryClient.invalidateQueries({ queryKey: ['get-all-orders'] })
    },
  })
}
