import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  link?: { to: string; label: string }
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">{eyebrow}</p>}
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {actions}
        {link && (
          <Link
            to={link.to}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700"
          >
            {link.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  )
}
