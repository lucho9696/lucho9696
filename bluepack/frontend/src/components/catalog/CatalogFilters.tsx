import { Check, Star } from 'lucide-react'
import type { CatalogFilters } from '@/lib/catalogParams'
import type { Category } from '@/types/catalog'

interface CatalogFiltersPanelProps {
  categories: Category[] | undefined
  filters: CatalogFilters
  onChange: (patch: Partial<CatalogFilters>) => void
}

/** Filtros del catálogo (barra lateral en escritorio y drawer en móvil). */
export function CatalogFiltersPanel({ categories, filters, onChange }: CatalogFiltersPanelProps) {
  const total = categories?.reduce((sum, category) => sum + category.productCount, 0)
  const options = [{ slug: '', name: 'Todas las categorías', productCount: total }, ...(categories ?? [])]

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Categorías</legend>
        <ul className="space-y-1">
          {options.map((category) => {
            const selected = filters.category === category.slug
            return (
              <li key={category.slug || 'all'}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange({ category: category.slug })}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors ${selected ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink hover:bg-surface'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`grid size-[18px] place-items-center rounded-full border-2 transition-colors ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                      {selected && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    {category.name}
                  </span>
                  {category.productCount !== undefined && <span className="text-xs text-muted tabular-nums">{category.productCount}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Mostrar</legend>
        <button
          type="button"
          role="switch"
          aria-checked={filters.featured}
          onClick={() => onChange({ featured: !filters.featured })}
          className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-[15px] transition-colors ${filters.featured ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-line text-ink hover:bg-surface'}`}
        >
          <span className="flex items-center gap-2.5 font-medium">
            <Star className={`size-4 ${filters.featured ? 'fill-brand-500 text-brand-500' : 'text-slate-400'}`} aria-hidden />
            Solo destacados
          </span>
          <span className={`grid size-5 place-items-center rounded-md border-2 transition-colors ${filters.featured ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
            {filters.featured && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
          </span>
        </button>
      </fieldset>
    </div>
  )
}
