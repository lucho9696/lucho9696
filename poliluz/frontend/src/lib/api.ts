import type { Category, ProductDetailResponse, ProductListParams, ProductListResponse } from '@/types/catalog'
import type {
  OrderPayload,
  OrderWhatsAppResponse,
  StoreConfig,
  WhatsAppMessageResponse,
  WholesalePayload,
} from '@/types/store'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api'

export class ApiError extends Error {
  readonly status: number
  readonly fields: Record<string, string>

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError('No pudimos conectar con el servidor. Revisá tu conexión e intentá nuevamente.', 0)
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.error ?? 'Ocurrió un error inesperado. Intentá nuevamente.', response.status, data?.fields)
  }

  return data as T
}

export function productListQuery(params: ProductListParams): string {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', '1')
  if (params.new) query.set('new', '1')
  if (params.sort) query.set('sort', params.sort)
  if (params.page && params.page > 1) query.set('page', String(params.page))
  if (params.perPage) query.set('perPage', String(params.perPage))
  return query.toString()
}

export const api = {
  config: () => request<StoreConfig>('/config'),
  categories: () => request<{ data: Category[] }>('/categories').then((response) => response.data),
  products: (params: ProductListParams) => request<ProductListResponse>(`/products?${productListQuery(params)}`),
  product: (slug: string) => request<ProductDetailResponse>(`/products/${encodeURIComponent(slug)}`),
  prepareWhatsAppOrder: (payload: OrderPayload) =>
    request<OrderWhatsAppResponse>('/orders/whatsapp', { method: 'POST', body: JSON.stringify(payload) }),
  prepareWholesaleInquiry: (payload: WholesalePayload) =>
    request<WhatsAppMessageResponse>('/wholesale/whatsapp', { method: 'POST', body: JSON.stringify(payload) }),
}
