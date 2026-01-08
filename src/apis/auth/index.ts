import { useNavigate } from '@tanstack/react-router'
import { queryOptions, useMutation } from '@tanstack/react-query'

import { clientApi } from '../client'
import { useAuthStore } from '@/store/auth'
import type { TUser } from '@/types/user'

export type TLoginResponse = {
  message?: string
  accessToken: string
}

// ######################## Login ############################
const login = async (user: {
  email: string
  password: string
}): Promise<TLoginResponse> => {
  const { data } = await clientApi<{
    message: string
    accessToken: string
  }>({
    url: '/auth/login',
    method: 'POST',
    data: user,
  })
  return data
}

export function useLogin() {
  return useMutation({ mutationFn: login })
}

// ####################### Get Me #######################
export const getMe = async (): Promise<TUser> => {
  const { data } = await clientApi({
    url: 'auth/me',
    method: 'GET',
  })
  return data.user
}

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ['get-me'],
    queryFn: getMe,
  })

// ######################## Refresh Token #####################
export const refreshAccessTokenFn = async (): Promise<TLoginResponse> => {
  const { data } = await clientApi<TLoginResponse>({
    url: 'auth/refresh',
    method: 'POST',
  })
  if (data?.accessToken) {
    const response = {
      accessToken: data.accessToken,
    }
    useAuthStore.getState().authenticateUser(response)
    return response
  }
  throw new Error('Failed to refresh token')
}

// ######################## LogOut ############################
const logout = async () => {
  const { data } = await clientApi({ url: '/auth/logout' })
  return data
}

export function useLogout() {
  const navigate = useNavigate()
  const logOutUser = useAuthStore((state) => state.logUserOut)
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logOutUser()
      navigate({ to: '/login' })
    },
  })
}
