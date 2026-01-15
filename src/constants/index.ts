export const ORDER_STATUS = {
  processing: {
    label: 'Processing',
    value: 'processing',
    color: '',
  },
  shipped: {
    label: 'Shipped',
    value: 'shipped',
    color: '',
  },
  delivered: {
    label: 'Delivered',
    value: 'delivered',
    color: '',
  },
  cancelled: {
    label: 'Cancelled',
    value: 'cancelled',
    color: '',
  },
} as const

export const USER_ROLES = {
  user: { label: 'User', value: 'USER' },
  admin: { label: 'Admin', value: 'ADMIN' },
  // superAdmin: { label: 'Super Admin', value: 'SUPER_ADMIN' },
} as const

// ###########################################
const today = new Date()
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
).toISOString()
const lastMonth = new Date(
  today.getFullYear(),
  today.getMonth() - 1,
  today.getDate(),
).toISOString()
const lastThreeMonth = new Date(
  today.getFullYear(),
  today.getMonth() - 3,
  today.getDate(),
).toISOString()

export const PERIODS = [
  { label: 'Last Week', value: lastWeek },
  { label: 'Last Month', value: lastMonth },
  { label: 'Last Three Month', value: lastThreeMonth },
]

export const MONTHS = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
} as const
