import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { clientApi } from '../client'
import type { TUser } from '@/types/user'

export type CreateUserData = {
  email: string
  name: string
  password: string
  role?: 'USER' | 'ADMIN'
  isVerified?: boolean
}

export type UpdateUserData = {
  email?: string
  name?: string
  password?: string
  role?: 'USER' | 'ADMIN'
  isVerified?: boolean
}

// ####################### Get All Users #######################
export const getAllUsers = async (): Promise<TUser[]> => {
  const { data } = await clientApi({
    url: 'admin/users',
    method: 'GET',
  })
  return Array.isArray(data) ? data : data.data || []
}

export const getAllUsersQueryOptions = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

// ####################### Get User By ID #######################
export const getUserById = async (id: number): Promise<TUser> => {
  const { data } = await clientApi({
    url: `admin/users/${id}`,
    method: 'GET',
  })
  return (data as any).data || data
}

export const getUserByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
  })

// ####################### Create User #######################
const createUser = async (data: CreateUserData): Promise<TUser> => {
  const { data: response } = await clientApi({
    url: 'admin/users',
    method: 'POST',
    data,
  })
  return (response as any).data || response
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// ####################### Update User #######################
const updateUser = async ({
  id,
  data,
}: {
  id: number
  data: UpdateUserData
}): Promise<TUser> => {
  const { data: response } = await clientApi({
    url: `admin/users/${id}`,
    method: 'PUT',
    data,
  })
  return (response as any).data || response
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}

// ####################### Delete User #######################
const deleteUser = async (id: number): Promise<void> => {
  await clientApi({
    url: `admin/users/${id}`,
    method: 'DELETE',
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// ##################### Update User Password #####################
const updateUserPassword = async ({
  data: userData,
}: {
  data: { oldPassword: string; newPassword: string }
}) => {
  const { data } = await clientApi({
    url: 'admin/users/updateUserPassword',
    method: 'PATCH',
    data: userData,
  })
  return data
}

export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: updateUserPassword,
  })
}
