import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/lib/api'

const cache = new Map<string, unknown>()

interface ApiState<T> {
  key: string | null
  data: T | undefined
  error: ApiError | null
  loading: boolean
}

/**
 * Obtiene datos de la API con caché en memoria por clave.
 * Mientras carga una clave nueva conserva los datos anteriores (evita parpadeos al filtrar).
 */
export function useApi<T>(key: string | null, fetcher: () => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>(() => ({
    key,
    data: key ? (cache.get(key) as T | undefined) : undefined,
    error: null,
    loading: key !== null && !cache.has(key),
  }))
  const fetcherRef = useRef(fetcher)
  const forceRef = useRef(false)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (key === null) return

    if (cache.has(key) && !forceRef.current) {
      setState({ key, data: cache.get(key) as T, error: null, loading: false })
      return
    }

    forceRef.current = false
    let cancelled = false
    setState((previous) => ({ ...previous, loading: true, error: null }))

    fetcherRef
      .current()
      .then((data) => {
        cache.set(key, data)
        if (!cancelled) setState({ key, data, error: null, loading: false })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const apiError = error instanceof ApiError ? error : new ApiError('Ocurrió un error inesperado.', 0)
        setState((previous) => ({ ...previous, key, error: apiError, loading: false }))
      })

    return () => {
      cancelled = true
    }
  }, [key, reloadToken])

  const reload = useCallback(() => {
    forceRef.current = true
    setReloadToken((token) => token + 1)
  }, [])

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    /** true cuando los datos visibles pertenecen a otra clave (p. ej. otro producto). */
    isStale: state.key !== key,
    reload,
  }
}
