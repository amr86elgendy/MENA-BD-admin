import { z } from 'zod'

export const companySchema = z.object({
  nameEn: z.string().min(1, { message: 'Name (English) is required' }),
  nameAr: z.string().optional(),
  registrationNumber: z
    .string()
    .min(1, { message: 'Registration number is required' }),
  legalForm: z.string().optional(),
  industry: z.string().min(1, { message: 'Industry is required' }),
  foundedDate: z.string().optional(),
  size: z.string().optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  countryCode: z.string().min(1, { message: 'Country is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),
  website: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
  services: z.array(z.string()).optional(),
  reportIds: z.array(z.union([z.string(), z.number()])).optional(),
})
