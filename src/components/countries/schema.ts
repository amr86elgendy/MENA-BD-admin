import { z } from 'zod'

export const countrySchema = z.object({
  code: z
    .string()
    .min(2, { message: 'Country code must be at least 2 characters' })
    .max(2, { message: 'Country code must be exactly 2 characters' })
    .toUpperCase(),
  nameEn: z.string().min(1, { message: 'Name (English) is required' }),
  nameAr: z.string().min(1, { message: 'Name (Arabic) is required' }),
  isActive: z.boolean(),
})
