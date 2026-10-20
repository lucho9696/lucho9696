import type { ReactNode } from 'react'

type Tone = 'brand' | 'soft' | 'accent' | 'success' | 'neutral' | 'navy'

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-500 text-white',
  soft: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100',
  accent: 'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200/70',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
  navy: 'bg-navy-900 text-white',
}

export function Badge({ tone = 'soft', className = '', children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
