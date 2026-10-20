import { createContext, useContext, type ReactNode } from 'react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/lib/api'
import type { StoreConfig } from '@/types/store'

interface StoreConfigValue {
  config: StoreConfig | undefined
  status: 'loading' | 'ready' | 'error'
  whatsappConfigured: boolean
}

const StoreConfigContext = createContext<StoreConfigValue>({
  config: undefined,
  status: 'loading',
  whatsappConfigured: false,
})

export function StoreConfigProvider({ children }: { children: ReactNode }) {
  const { data, error } = useApi('config', api.config)
  const status = data ? 'ready' : error ? 'error' : 'loading'

  return (
    <StoreConfigContext.Provider value={{ config: data, status, whatsappConfigured: data?.whatsapp.configured ?? false }}>
      {children}
    </StoreConfigContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreConfig(): StoreConfigValue {
  return useContext(StoreConfigContext)
}
