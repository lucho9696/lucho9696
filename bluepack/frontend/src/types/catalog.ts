export interface SaleUnit {
  singular: string
  plural: string
}

export interface CategoryRef {
  id: string
  slug: string
  name: string
}

export type CategoryTone = 'blue' | 'sky' | 'mint' | 'slate' | 'sand'

export interface Category extends CategoryRef {
  description: string
  image: string
  tone: CategoryTone
  productCount: number
}

export interface Product {
  id: string
  sku: string
  slug: string
  name: string
  description: string
  price: number
  categoryId: string
  category: CategoryRef | null
  presentation: string
  saleUnit: SaleUnit
  image: string
  gallery: string[]
  featured: boolean
  isNew: boolean
  available: boolean
  tags: string[]
}

export type ProductSort = 'featured' | 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

export interface ProductListParams {
  q?: string
  category?: string
  featured?: boolean
  new?: boolean
  sort?: ProductSort
  page?: number
  perPage?: number
}

export interface ProductListMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
  sort: ProductSort
  search: string
  category: Omit<Category, 'productCount'> | null
}

export interface ProductListResponse {
  data: Product[]
  meta: ProductListMeta
}

export interface WhatsAppLinkInfo {
  configured: boolean
  url: string | null
}

export interface ProductDetailResponse {
  data: Product
  related: Product[]
  inquiry: WhatsAppLinkInfo
}
