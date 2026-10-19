import { ChevronLeft, ChevronRight } from 'lucide-react'

function pages(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const set = new Set([1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total))
  const sorted = [...set].sort((a, b) => a - b)
  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? ['gap' as const, page] : [page]))
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null
  const item = 'grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-semibold transition-colors'

  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-1.5">
      <button type="button" className={`${item} border border-line text-navy-900 hover:bg-surface disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Página anterior">
        <ChevronLeft className="size-4" />
      </button>
      {pages(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={`${item} ${entry === page ? 'bg-brand-500 text-white shadow-sm' : 'text-navy-900 hover:bg-surface'}`}
          >
            {entry}
          </button>
        ),
      )}
      <button type="button" className={`${item} border border-line text-navy-900 hover:bg-surface disabled:opacity-40`} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Página siguiente">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
