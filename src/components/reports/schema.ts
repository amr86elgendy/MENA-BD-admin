import { z } from 'zod'

export const reportSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  isActive: z.boolean(),
  turnaround: z.string().min(1, { message: 'Turnaround is required' }),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .min(0, { message: 'Price must be a positive number' }),
  countryCode: z.string().min(1, { message: 'Country is required' }),
})
