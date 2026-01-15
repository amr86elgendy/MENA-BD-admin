export type TCompany = {
  id: number
  nameEn: string
  nameAr: string | null
  registrationNumber: string
  legalForm: string
  industry: string
  foundedDate: string | null
  size: string | null
  address: string
  city: string
  countryCode: string
  country: {
    code: string
    nameEn: string
    nameAr: string
  }
  phone: string
  email: string
  website: string | null
  description: string | null
  services: string[]
  reports?: Array<{
    id: number
    name: string
    description: string
    price: number
    turnaround: string
  }>
  createdAt: string
  updatedAt: string
}

export type TCompaniesParams = {
  page: number
  limit: number
  search: string
  countryCode: Array<string>
}
