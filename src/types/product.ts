import type { TCategory } from './category'
import type { TCompany } from './company'
import type { TDosageForm } from './dosage-form'
import type { TVariant } from './variant'

type TProduct<VariantType> = {
  _id: string
  name_en: string
  name_ar: string
  slug: string
  description_en: string
  description_ar: string
  nutritionFacts: {
    servingSize: string
    servingPerContainer: string
    ingredients: {
      name: string
      amountPerServing: string
      dailyValue: string
    }[]
    otherIngredients: { name: string }[]
  }
  company: TCompany
  dosageForm: TDosageForm
  category: TCategory[]
  numReviews: number
  averageRating: number
  variants: VariantType
  featured: boolean
  directionOfUse: string
  warnings: string
  storageConditions: string
  NFSA_REG_NO: string
  createdAt: string
  updatedAt: string
}

export type TProductParams = {
  page: number
  name: string
  averageRating: 1 | 2 | 3 | 4 | 5
  company: string[]
  dosageForm: string[]
  category: string[]
  limit: number
}

export type TProductWithSingleVariant = TProduct<TVariant>
export type TProductWithMultipleVariants = TProduct<TVariant[]>
