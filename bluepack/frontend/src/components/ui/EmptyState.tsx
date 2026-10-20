import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className = '',
}: {
  icon: LucideIcon
  title: string
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-14 text-center ${className}`}>
      <span className="grid size-16 place-items-center rounded-2xl bg-white text-brand-500 shadow-card">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-bold text-navy-900">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
