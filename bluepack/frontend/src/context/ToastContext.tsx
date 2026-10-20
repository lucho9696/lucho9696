import { CheckCircle2, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

interface ToastOptions {
  title: string
  description?: string
  tone?: 'success' | 'info'
  image?: string
  action?: { label: string; onClick: () => void }
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
}

const ToastContext = createContext<(options: ToastOptions) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)), [])

  const notify = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-1), { ...options, id }])
      window.setTimeout(() => dismiss(id), options.duration ?? 4000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => {
          const Icon = toast.tone === 'info' ? Info : CheckCircle2
          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-lift"
            >
              {toast.image ? (
                <img src={toast.image} alt="" className="product-stage size-12 shrink-0 rounded-xl object-contain p-1" />
              ) : (
                <Icon
                  className={`mt-0.5 size-5 shrink-0 ${toast.tone === 'info' ? 'text-brand-500' : 'text-emerald-600'}`}
                  aria-hidden
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-sm text-muted">{toast.description}</p>}
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick()
                      dismiss(toast.id)
                    }}
                    className="mt-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-m-1 rounded-lg p-1 text-muted hover:bg-surface hover:text-ink"
                aria-label="Cerrar notificación"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
