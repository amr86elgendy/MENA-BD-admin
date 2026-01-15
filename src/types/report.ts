export type TReport = {
  id: number
  name: string
  description: string
  isActive: boolean
  turnaround: string
  price: number
  countryCode: string
  country: {
    id: number
    code: string
    nameEn: string
    nameAr: string
    isActive: boolean
  }
  createdAt: string
  updatedAt: string
}

export type TReportsParams = {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  countryCode?: string
}
