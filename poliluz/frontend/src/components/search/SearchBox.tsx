import { ArrowRight, Loader2, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ProductImage } from '@/components/product/ProductImage'
import { useApi } from '@/hooks/useApi'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { api } from '@/lib/api'
import { catalogUrl } from '@/lib/catalogParams'
import { formatPrice } from '@/lib/format'

/** Buscador del encabezado con sugerencias en vivo. */
export function SearchBox({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const urlQuery = location.pathname === '/productos' ? (params.get('q') ?? '') : ''
  const [value, setValue] = useState(urlQuery)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => setValue(urlQuery), [urlQuery])

  const term = useDebouncedValue(value.trim(), 250)
  const key = term.length >= 2 ? `suggest:${term}` : null
  const { data, loading } = useApi(key, () => api.products({ q: term, perPage: 5 }))
  const results = key ? (data?.data ?? []) : []
  const showPanel = open && value.trim().length >= 2

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const finish = (to: string) => {
    setOpen(false)
    setActive(-1)
    inputRef.current?.blur()
    onNavigate?.()
    navigate(to)
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    finish(catalogUrl({ q: value.trim() }))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length + 1
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => (index + 1) % count)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (index <= 0 ? count - 1 : index - 1))
    } else if (event.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    } else if (event.key === 'Enter' && showPanel && active >= 0 && active < results.length) {
      event.preventDefault()
      finish(`/producto/${results[active].slug}`)
    }
  }

  return (
    <form ref={containerRef} role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar productos
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? `${listId}-option-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Buscar vasos, envases, bolsas…"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-xl border border-line bg-surface pr-20 pl-10 text-[15px] text-ink placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] outline-none [&::-webkit-search-cancel-button]:hidden focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('')
              inputRef.current?.focus()
            }}
            className="absolute top-1/2 right-11 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-ink"
            aria-label="Borrar búsqueda"
          >
            <X className="size-4" />
          </button>
        )}
        <button type="submit" className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600" aria-label="Buscar">
          <Search className="size-4" />
        </button>
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 animate-fade-in overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <ul id={listId} role="listbox" aria-label="Sugerencias de productos" className="max-h-[60vh] overflow-y-auto py-1.5">
            {results.map((product, index) => (
              <li
                key={product.id}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={active === index}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => finish(`/producto/${product.slug}`)}
                onMouseEnter={() => setActive(index)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${active === index ? 'bg-brand-50' : ''}`}
              >
                <span className="product-stage size-11 shrink-0 overflow-hidden rounded-lg border border-line">
                  <ProductImage src={product.image} alt="" className="size-full p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-navy-900">{product.name}</span>
                  <span className="block truncate text-xs text-muted">{product.presentation}</span>
                </span>
                <span className="text-sm font-bold text-navy-900 tabular-nums">{formatPrice(product.price)}</span>
              </li>
            ))}
            {!loading && key && results.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted" role="presentation">
                No encontramos productos para “{value.trim()}”.
              </li>
            )}
            {loading && results.length === 0 && (
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-muted" role="presentation">
                <Loader2 className="size-4 animate-spin" aria-hidden /> Buscando…
              </li>
            )}
          </ul>
          <button
            type="button"
            id={`${listId}-option-${results.length}`}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => submit()}
            className={`flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-50 ${active === results.length ? 'bg-brand-50' : ''}`}
          >
            Ver todos los resultados para “{value.trim()}”
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </form>
  )
}
