import type { ProductListParams, ProductSort } from '@/types/catalog'

/** Opciones de orden visibles en la URL (en español) y su equivalente en la API. */
export const SORT_OPTIONS: { value: string; label: string; api: ProductSort }[] = [
  { value: 'destacados', label: 'Destacados primero', api: 'featured' },
  { value: 'relevancia', label: 'Más relevantes', api: 'relevance' },
  { value: 'precio-asc', label: 'Precio: menor a mayor', api: 'price_asc' },
  { value: 'precio-desc', label: 'Precio: mayor a menor', api: 'price_desc' },
  { value: 'nombre-asc', label: 'Nombre: A a Z', api: 'name_asc' },
  { value: 'nombre-desc', label: 'Nombre: Z a A', api: 'name_desc' },
]

export const CATALOG_PER_PAGE = 12

/** Última URL del catálogo (sessionStorage) para volver con los mismos filtros. */
export const LAST_CATALOG_KEY = 'bluepack:last-catalog'

export interface CatalogFilters {
  q: string
  category: string
  sort: string
  featured: boolean
  page: number
}

export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  const page = Number.parseInt(params.get('pagina') ?? '1', 10)
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    category: params.get('categoria') ?? '',
    sort: SORT_OPTIONS.some((option) => option.value === params.get('orden')) ? (params.get('orden') as string) : '',
    featured: params.get('destacados') === '1',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

export function writeCatalogFilters(filters: Partial<CatalogFilters>): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.category) params.set('categoria', filters.category)
  if (filters.sort) params.set('orden', filters.sort)
  if (filters.featured) params.set('destacados', '1')
  if (filters.page && filters.page > 1) params.set('pagina', String(filters.page))
  return params
}

export function toApiParams(filters: CatalogFilters): ProductListParams {
  return {
    q: filters.q || undefined,
    category: filters.category || undefined,
    featured: filters.featured,
    sort: SORT_OPTIONS.find((option) => option.value === filters.sort)?.api,
    page: filters.page,
    perPage: CATALOG_PER_PAGE,
  }
}

export function catalogUrl(filters: Partial<CatalogFilters> = {}): string {
  const query = writeCatalogFilters(filters).toString()
  return query ? `/productos?${query}` : '/productos'
}
