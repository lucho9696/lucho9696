import { Link } from 'react-router-dom'

/** Logotipo tipográfico provisional de Blue Pack. */
export function Logo({ inverted = false, className = '' }: { inverted?: boolean; className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Blue Pack, ir al inicio">
      <span
        className={`relative grid size-9 place-items-center rounded-xl text-lg font-black transition-transform duration-300 group-hover:-rotate-6 ${
          inverted ? 'bg-white text-brand-600' : 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
        }`}
        aria-hidden
      >
        P
        <span className={`absolute right-1 bottom-1 size-1.5 rounded-full ${inverted ? 'bg-brand-300' : 'bg-brand-200'}`} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold tracking-[0.08em] ${inverted ? 'text-white' : 'text-navy-900'}`}>POLILUZ</span>
        <span className={`mt-1 text-[10px] font-medium tracking-[0.16em] uppercase ${inverted ? 'text-white/60' : 'text-muted'}`}>
          Descartables
        </span>
      </span>
    </Link>
  )
}
