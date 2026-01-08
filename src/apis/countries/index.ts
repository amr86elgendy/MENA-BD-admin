import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { clientApi } from '../client'
import type { TCountry, TCountriesParams } from '@/types/country'

export type CreateCountryData = {
  code: string
  nameEn: string
  nameAr: string
  isActive?: boolean
}

export type UpdateCountryData = {
  code?: string
  nameEn?: string
  nameAr?: string
  isActive?: boolean
}

export type CountriesResponse = {
  success: boolean
  data: TCountry[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type CountryResponse = {
  success: boolean
  data: TCountry
}

// ####################### Get All Countries #######################
export const getAllCountries = async (
  params?: TCountriesParams,
): Promise<CountriesResponse> => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.isActive !== undefined) {
    queryParams.append('isActive', params.isActive.toString())
  }

  const queryString = queryParams.toString()
  const { data } = await clientApi({
    url: `admin/countries${queryString ? `?${queryString}` : ''}`,
    method: 'GET',
  })
  return data
}

export const getAllCountriesQueryOptions = (params?: TCountriesParams) =>
  queryOptions({
    queryKey: ['countries', params],
    queryFn: () => getAllCountries(params),
  })

// ####################### Get Country By ID #######################
export const getCountryById = async (id: number): Promise<TCountry> => {
  const { data } = await clientApi({
    url: `admin/countries/${id}`,
    method: 'GET',
  })
  return data.data
}

export const getCountryByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['country', id],
    queryFn: () => getCountryById(id),
  })

// ####################### Create Country #######################
const createCountry = async (data: CreateCountryData): Promise<TCountry> => {
  const { data: response } = await clientApi({
    url: 'admin/countries',
    method: 'POST',
    data,
  })
  return response.data
}

export function useCreateCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCountry,
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['countries'] })
    // },
  })
}

// ####################### Update Country #######################
const updateCountry = async ({
  id,
  data,
}: {
  id: number
  data: UpdateCountryData
}): Promise<TCountry> => {
  const { data: response } = await clientApi({
    url: `admin/countries/${id}`,
    method: 'PUT',
    data,
  })
  return response.data
}

export function useUpdateCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCountry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      // queryClient.invalidateQueries({ queryKey: ['country', variables.id] })
    },
  })
}

// ####################### Delete Country #######################
const deleteCountry = async (id: number): Promise<void> => {
  await clientApi({
    url: `admin/countries/${id}`,
    method: 'DELETE',
  })
}

export function useDeleteCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCountry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
    },
  })
}
