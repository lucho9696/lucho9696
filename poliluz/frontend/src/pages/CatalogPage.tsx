import { RotateCcw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CatalogFiltersPanel } from '@/components/catalog/CatalogFilters'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useApi } from '@/hooks/useApi'
import { useCategories } from '@/hooks/useCategories'
import { usePageMeta } from '@/hooks/usePageMeta'
import { api, productListQuery } from '@/lib/api'
import { LAST_CATALOG_KEY, SORT_OPTIONS, readCatalogFilters, toApiParams, writeCatalogFilters, type CatalogFilters } from '@/lib/catalogParams'
import { pluralize } from '@/lib/format'
import { writeStorage } from '@/lib/storage'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readCatalogFilters(searchParams), [searchParams])
  const apiParams = toApiParams(filters)
  const { data, loading, error, reload } = useApi(`products:${productListQuery(apiParams)}`, () => api.products(apiParams))
  const { data: categories } = useCategories()
  const { config } = useStoreConfig()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchDraft, setSearchDraft] = useState(filters.q)
  const searchTimer = useRef<number | undefined>(undefined)
  const resultsRef = useRef<HTMLDivElement>(null)

  const category = categories?.find((item) => item.slug === filters.category) ?? data?.meta.category ?? null
  const title = category?.name ?? (filters.featured ? 'Productos destacados' : 'Todos los productos')
  const description =
    category?.description ?? 'Descartables, envases y packaging para tu negocio. Buscá, filtrá y agregá al carrito lo que necesites.'
  usePageMeta(title, description)

  useEffect(() => setSearchDraft(filters.q), [filters.q])
  useEffect(() => writeStorage(LAST_CATALOG_KEY, `/productos${searchParams.size ? `?${searchParams}` : ''}`, 'session'), [searchParams])
  useEffect(() => () => window.clearTimeout(searchTimer.current), [])

  const update = useCallback(
    (patch: Partial<CatalogFilters>, replace = false) => {
      setSearchParams((previous) => writeCatalogFilters({ ...readCatalogFilters(previous), page: 1, ...patch }), { replace })
    },
    [setSearchParams],
  )

  const onSearchChange = (value: string) => {
    setSearchDraft(value)
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => update({ q: value.trim() }, true), 350)
  }

  const clearFilters = () => {
    window.clearTimeout(searchTimer.current)
    setSearchDraft('')
    setSearchParams(new URLSearchParams())
  }

  const goToPage = (page: number) => {
    update({ page })
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const total = data?.meta.total ?? 0
  const hasFilters = Boolean(filters.q || filters.category || filters.featured || filters.sort)
  const sortValue = filters.sort || (filters.q ? 'relevancia' : 'destacados')
  const sortOptions = SORT_OPTIONS.filter((option) => option.value !== 'relevancia' || filters.q)
  const activeFiltersCount = Number(Boolean(filters.category)) + Number(filters.featured)

  const chips = [
    filters.q && { label: `“${filters.q}”`, onRemove: () => update({ q: '' }) },
    category && { label: category.name, onRemove: () => update({ category: '' }) },
    filters.featured && { label: 'Destacados', onRemove: () => update({ featured: false }) },
  ].filter(Boolean) as { label: string; onRemove: () => void }[]

  return (
    <>
      <PageHeader
        compact
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, ...(category ? [{ label: 'Productos', to: '/productos' }, { label: category.name }] : [{ label: 'Productos' }])]}
      >
        <form role="search" onSubmit={(event) => event.preventDefault()} className="w-full lg:max-w-sm">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar en el catálogo
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="catalog-search"
              type="search"
              value={searchDraft}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar en el catálogo"
              className="h-12 w-full rounded-xl border border-line bg-white pr-4 pl-12 text-[15px] shadow-sm outline-none [&::-webkit-search-cancel-button]:hidden focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </form>
      </PageHeader>

      <Container className="py-8 sm:py-10">
        <div ref={resultsRef} className="grid scroll-mt-40 gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block" aria-label="Filtros">
            <div className="sticky top-36 space-y-6">
              <CatalogFiltersPanel categories={categories} filters={filters} onChange={(patch) => update(patch)} />
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-brand-600">
                  <RotateCcw className="size-4" aria-hidden />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">
                {loading && !data ? (
                  'Cargando productos…'
                ) : (
                  <>
                    <span className="font-semibold text-navy-900">{pluralize(total, 'producto', 'productos')}</span>
                    {filters.q && <> para “{filters.q}”</>}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(true)} className="lg:hidden">
                  <SlidersHorizontal className="size-4" aria-hidden />
                  Filtros
                  {activeFiltersCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-[11px] text-white">{activeFiltersCount}</span>}
                </Button>
                <label htmlFor="catalog-sort" className="sr-only">
                  Ordenar productos
                </label>
                <select
                  id="catalog-sort"
                  value={sortValue}
                  onChange={(event) => update({ sort: event.target.value })}
                  className="h-9 rounded-xl border border-line bg-white pr-8 pl-3 text-sm font-medium text-navy-900 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 py-1 pr-2 pl-3 text-sm font-medium text-brand-700 transition-colors hover:border-brand-200 hover:bg-brand-100"
                    aria-label={`Quitar filtro ${chip.label}`}
                  >
                    {chip.label}
                    <X className="size-3.5" aria-hidden />
                  </button>
                ))}
                <button type="button" onClick={clearFilters} className="px-2 text-sm font-semibold text-muted hover:text-brand-600">
                  Limpiar todo
                </button>
              </div>
            )}

            {error && !data ? (
              <EmptyState icon={SearchX} title="No pudimos cargar los productos" description={error.message}>
                <Button onClick={reload}>
                  <RotateCcw className="size-4" aria-hidden />
                  Reintentar
                </Button>
              </EmptyState>
            ) : !loading && data && data.data.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No encontramos productos"
                description="Probá con otra búsqueda o quitá algún filtro. También podés consultarnos por productos que no estén en el catálogo."
              >
                <Button onClick={clearFilters}>
                  <RotateCcw className="size-4" aria-hidden />
                  Limpiar filtros
                </Button>
                <WhatsAppButton href={config?.whatsapp.links.general} variant="outline">
                  Consultar por WhatsApp
                </WhatsAppButton>
              </EmptyState>
            ) : (
              <>
                <ProductGrid products={data?.data} loading={loading} skeletons={9} className="grid-cols-2 md:grid-cols-3" />
                {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={goToPage} />}
              </>
            )}
          </div>
        </div>
      </Container>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        title="Filtrar productos"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearFilters} className="flex-1" disabled={!hasFilters}>
              Limpiar
            </Button>
            <Button onClick={() => setFiltersOpen(false)} className="flex-[2]">
              Ver {pluralize(total, 'producto', 'productos')}
            </Button>
          </div>
        }
      >
        <div className="space-y-7 p-5">
          <div>
            <label htmlFor="catalog-sort-mobile" className="mb-3 block text-xs font-semibold tracking-wider text-muted uppercase">
              Ordenar por
            </label>
            <select
              id="catalog-sort-mobile"
              value={sortValue}
              onChange={(event) => update({ sort: event.target.value })}
              className="h-12 w-full rounded-xl border border-line bg-white px-3 text-[15px] font-medium text-navy-900"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <CatalogFiltersPanel categories={categories} filters={filters} onChange={(patch) => update(patch)} />
        </div>
      </Drawer>
    </>
  )
}
