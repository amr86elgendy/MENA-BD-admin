import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { clientApi } from '../client'
import type { TCompany, TCompaniesParams } from '@/types/company'

export type CreateCompanyData = {
  nameEn: string
  nameAr?: string
  registrationNumber: string
  legalForm?: string
  industry: string
  foundedDate?: string
  size?: string
  address: string
  city: string
  countryCode: string
  phone: string
  email: string
  website?: string
  description?: string
  services?: string[]
}

export type UpdateCompanyData = {
  nameEn?: string
  nameAr?: string
  registrationNumber?: string
  legalForm?: string
  industry?: string
  foundedDate?: string
  size?: string
  address?: string
  city?: string
  countryCode?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  services?: string[]
}

export type CompaniesResponse = {
  success: boolean
  data: TCompany[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

type GetCompaniesReturnType = {
  currentPage: number
  lastPage: number
  companies: TCompany[]
  totalCount: number
}

export type CompanyResponse = {
  success: boolean
  data: TCompany
}

// ####################### Get All Companies #######################
const getAllCompanies = async ({
  pageParam,
  ...rest
}: {
  pageParam: number
} & Partial<TCompaniesParams>): Promise<GetCompaniesReturnType> => {
  const params = { page: pageParam, ...rest }
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.countryCode && params.countryCode.length > 0) {
    queryParams.append('countryCode', params.countryCode.join(','))
  }

  const queryString = queryParams.toString()
  const { data } = await clientApi({
    url: `admin/companies${queryString ? `?${queryString}` : ''}`,
    method: 'GET',
  })

  return {
    currentPage: data.pagination.page,
    lastPage: data.pagination.totalPages,
    companies: data.data,
    totalCount: data.pagination.total,
  }
}

export const getAllCompaniesQueryOptions = (props: Partial<TCompaniesParams>) =>
  infiniteQueryOptions({
    queryKey: ['companies', props],
    queryFn: ({ pageParam }) => getAllCompanies({ pageParam, ...props }),
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

// ####################### Get Company By ID #######################
export const getCompanyById = async (id: number): Promise<TCompany> => {
  const { data } = await clientApi({
    url: `admin/companies/${id}`,
    method: 'GET',
  })
  return data.data
}

export const getCompanyByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id),
  })

// ####################### Create Company #######################
const createCompany = async (data: CreateCompanyData): Promise<TCompany> => {
  const { data: response } = await clientApi({
    url: 'admin/companies',
    method: 'POST',
    data,
  })
  return response.data
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

// ####################### Update Company #######################
const updateCompany = async ({
  id,
  data,
}: {
  id: number
  data: UpdateCompanyData
}): Promise<TCompany> => {
  const { data: response } = await clientApi({
    url: `admin/companies/${id}`,
    method: 'PUT',
    data,
  })
  return response.data
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCompany,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      // queryClient.invalidateQueries({ queryKey: ['company', variables.id] })
    },
  })
}

// ####################### Delete Company #######################
const deleteCompany = async (id: number): Promise<void> => {
  await clientApi({
    url: `admin/companies/${id}`,
    method: 'DELETE',
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCompany,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

// ####################### Upload Excel #######################
export type UploadExcelResponse = {
  success: boolean
  message: string
  data: {
    total: number
    success: number
    failed: number
    errors: Array<{ row: number; error: string }>
  }
}

const uploadExcel = async (file: File): Promise<UploadExcelResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await clientApi({
    url: 'admin/upload/companies',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export function useUploadExcel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadExcel,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
