import { useStoreConfig } from '@/context/StoreConfigContext'

/** true mientras la API indique modo demostración (DEMO_MODE). Por defecto se asume demo. */
export function useDemoMode(): boolean {
  const { config } = useStoreConfig()
  return config?.store.demoMode ?? true
}
