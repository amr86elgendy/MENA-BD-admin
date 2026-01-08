import { type TVariant } from './variant'
import { type TProductWithMultipleVariants } from './product'
import { PAYMENT_METHODS } from './../constants/paymentMethods';
import { ORDER_STATUS } from '@/constants'

export type TOrderItem = {
  _id: string
  product: TProductWithMultipleVariants
  company: string
  amount: number
  variant: TVariant
  totalProductPrice: number
}

type TAddress = {
  _id: string
  user: string
  firstName: string
  lastName: string
  email: string
  governorate: string
  city: string
  phone: number
  additionalPhone: number
  street: string
  buildingNo: string
  floor: string
}

// type TOrderStatus =

export type TOrder = {
  _id: string
  shippingAddress: TAddress
  user: {
    _id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
  }
  orderItems: TOrderItem[]
  shippingFee: number
  subtotal: number
  total: number
  status: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]['value']
  paid: boolean
  paymentMethod: {
    id: string
    name: string
  }
  deliveredAt: string
  createdAt: string
  updatedAt: string
}

export type TOrderParams = {
  name: string
  status: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]['value'][]
  company: string[]
  paid: boolean
  paymentMethod: (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]['value']
  period: string
  page: number
  limit: number
}
