export type TCountry = {
  id: number
  code: string
  nameEn: string
  nameAr: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type TCountriesParams = {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}
