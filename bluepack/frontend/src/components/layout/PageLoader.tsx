import { Loader2 } from 'lucide-react'

export function PageLoader({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-3 text-muted">
        <Loader2 className="size-8 animate-spin text-brand-500" aria-hidden />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}
