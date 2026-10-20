import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface UiContextValue {
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const UiContext = createContext<UiContextValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const value = useMemo(
    () => ({ cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }),
    [cartOpen],
  )
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUi(): UiContextValue {
  const context = useContext(UiContext)
  if (!context) throw new Error('useUi debe usarse dentro de <UiProvider>')
  return context
}
