export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'light' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold select-none transition-[background-color,color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white shadow-sm shadow-brand-500/25 hover:bg-brand-600',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  outline: 'border border-line bg-white text-navy-900 hover:border-brand-300 hover:bg-brand-50/60',
  ghost: 'text-navy-900 hover:bg-surface',
  whatsapp: 'bg-whatsapp text-white shadow-sm shadow-whatsapp/25 hover:bg-whatsapp-dark',
  light: 'bg-white text-navy-900 shadow-sm hover:bg-brand-50',
  inverse: 'border border-white/25 text-white hover:border-white/50 hover:bg-white/10',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-6 text-base',
  icon: 'size-10',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim()
}
