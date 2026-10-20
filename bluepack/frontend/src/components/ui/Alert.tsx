import { AlertTriangle, Info } from 'lucide-react'
import type { ReactNode } from 'react'

export function Alert({ tone = 'info', title, children, className = '' }: { tone?: 'info' | 'warning'; title?: string; children: ReactNode; className?: string }) {
  const Icon = tone === 'warning' ? AlertTriangle : Info
  const styles = tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-brand-100 bg-brand-50 text-navy-900'
  return (
    <div role={tone === 'warning' ? 'alert' : 'note'} className={`flex gap-3 rounded-2xl border p-4 text-sm ${styles} ${className}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${tone === 'warning' ? 'text-amber-600' : 'text-brand-500'}`} aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-1 opacity-90' : ''}>{children}</div>
      </div>
    </div>
  )
}
