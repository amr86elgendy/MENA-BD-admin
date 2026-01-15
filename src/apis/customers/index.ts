import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { clientApi } from '../client'
import type { TUser } from '@/types/user'

// ####################### Get Users #######################
type GetUsersReturnType = {
  currentPage: number
  lastPage: number
  users: TUser[]
  totalCount: number
}

const getCustomers = async ({
  pageParam,
  ...rest
}: {
  pageParam: number
} & {
  search?: string
  isVerified?: boolean
  role?: string
}): Promise<GetUsersReturnType> => {
  const params: Record<string, any> = { page: pageParam, limit: 10 }
  if (rest.search) params.search = rest.search
  if (rest.isVerified !== undefined) params.isVerified = rest.isVerified
  if (rest.role) params.role = rest.role

  const { data } = await clientApi({
    url: 'admin/users',
    method: 'GET',
    params,
  })

  return {
    currentPage: data.pagination.page,
    lastPage: data.pagination.totalPages,
    users: data.data,
    totalCount: data.pagination.total,
  }
}

export function getCustomersQueryOptions(props?: any) {
  return infiniteQueryOptions({
    queryKey: ['get-customers', props],
    queryFn: ({ pageParam }) => getCustomers({ pageParam, ...props }),
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
}

// ####################### View User #######################
export const getUserById = async (id: number): Promise<TUser> => {
  const { data } = await clientApi({
    url: `admin/users/${id}`,
    method: 'GET',
  })
  return data
}

export const getUserByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
  })
}

export function useViewUser(props: { id: string | undefined }) {
  return useQuery({
    queryKey: ['user', props.id],
    queryFn: () => getUserById(Number(props.id)),
    enabled: !!props.id,
  })
}

// ####################### Update User #######################
const updateUser = async ({
  data: userData,
  id,
}: {
  data: Partial<TUser>
  id: string | undefined
}) => {
  const { data } = await clientApi({
    url: `admin/users/${id}`,
    method: 'PUT',
    data: userData,
  })
  return data
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSettled: async (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-me'] })
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ['user', Number(variables.id)],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['get-customers'] })
    },
  })
}

// ####################### Block User #######################
const blockUser = async ({
  blocked,
  id,
}: {
  blocked: boolean
  id: string | undefined
}) => {
  const { data } = await clientApi({
    url: 'admin/users/block',
    method: 'PATCH',
    data: { id, blocked },
  })
  return data
}

export function useBlockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: blockUser,
    onSettled: () => {
      // parameters: data, error, variables, context
      queryClient.invalidateQueries({ queryKey: ['get-customers'] })
    },
  })
}

// ####################### Verify User #######################
const verifyUser = async (id: number): Promise<TUser> => {
  const { data } = await clientApi({
    url: `admin/users/${id}/verify`,
    method: 'PUT',
  })
  return data.user
}

export function useVerifyUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: verifyUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['get-customers'] })
    },
  })
}
