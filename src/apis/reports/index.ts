import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { clientApi } from '../client'
import type { TReport, TReportsParams } from '@/types/report'

export type CreateReportData = {
  name: string
  description: string
  isActive?: boolean
  turnaround: string
  price: number
  countryCode: string
}

export type UpdateReportData = {
  name?: string
  description?: string
  isActive?: boolean
  turnaround?: string
  price?: number
  countryCode?: string
}

export type ReportsResponse = {
  success: boolean
  data: TReport[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type ReportResponse = {
  success: boolean
  data: TReport
}

// ####################### Get All Reports #######################
export const getAllReports = async (
  params?: TReportsParams,
): Promise<ReportsResponse> => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.isActive !== undefined) {
    queryParams.append('isActive', params.isActive.toString())
  }
  if (params?.countryCode) {
    queryParams.append('countryCode', params.countryCode)
  }

  const queryString = queryParams.toString()
  const { data } = await clientApi({
    url: `admin/reports${queryString ? `?${queryString}` : ''}`,
    method: 'GET',
  })
  return data
}

export const getAllReportsQueryOptions = (params?: TReportsParams) =>
  queryOptions({
    queryKey: ['reports', params],
    queryFn: () => getAllReports(params),
  })

// ####################### Get Report By ID #######################
export const getReportById = async (id: number): Promise<TReport> => {
  const { data } = await clientApi({
    url: `admin/reports/${id}`,
    method: 'GET',
  })
  return data.data
}

export const getReportByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['report', id],
    queryFn: () => getReportById(id),
  })

// ####################### Create Report #######################
const createReport = async (data: CreateReportData): Promise<TReport> => {
  const { data: response } = await clientApi({
    url: 'admin/reports',
    method: 'POST',
    data,
  })
  return response.data
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createReport,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

// ####################### Update Report #######################
const updateReport = async ({
  id,
  data,
}: {
  id: number
  data: UpdateReportData
}): Promise<TReport> => {
  const { data: response } = await clientApi({
    url: `admin/reports/${id}`,
    method: 'PUT',
    data,
  })
  return response.data
}

export function useUpdateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateReport,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

// ####################### Delete Report #######################
const deleteReport = async (id: number): Promise<void> => {
  await clientApi({
    url: `admin/reports/${id}`,
    method: 'DELETE',
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReport,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
