import type { WhatsAppLinkInfo } from './catalog'

export interface StoreConfig {
  store: {
    name: string
    tagline: string
    demoMode: boolean
    currency: string
  }
  whatsapp: {
    configured: boolean
    links: {
      general: string | null
      wholesale: string | null
    }
  }
  wholesale: {
    businessTypes: { value: string; label: string }[]
  }
}

export interface CustomerForm {
  name: string
  business: string
  phone: string
  city: string
  comments: string
}

export interface OrderPayload {
  customer: CustomerForm
  items: { productId: string; quantity: number }[]
}

export interface OrderLineSummary {
  productId: string
  slug: string
  name: string
  presentation: string
  quantity: number
  unitLabel: string
  unitPrice: number
  subtotal: number
}

export interface OrderWhatsAppResponse {
  order: {
    lines: OrderLineSummary[]
    totalUnits: number
    total: number
  }
  message: string
  whatsapp: WhatsAppLinkInfo
}

export interface WholesalePayload {
  name: string
  business: string
  businessType: string
  city: string
  phone: string
  categories: string[]
  details: string
}

export interface WhatsAppMessageResponse {
  message: string
  whatsapp: WhatsAppLinkInfo
}
