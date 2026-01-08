export type TUser = {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export type TCustomersParams = {
  search?: string
  isVerified?: boolean
  role?: 'USER' | 'ADMIN'
}
