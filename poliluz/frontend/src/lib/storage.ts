/** Acceso seguro a localStorage/sessionStorage (puede no estar disponible en modo privado). */
export function readStorage(key: string, storage: 'local' | 'session' = 'local'): string | null {
  try {
    return (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string | null, storage: 'local' | 'session' = 'local'): void {
  try {
    const target = storage === 'local' ? window.localStorage : window.sessionStorage
    if (value === null) target.removeItem(key)
    else target.setItem(key, value)
  } catch {
    // Sin almacenamiento disponible: la tienda sigue funcionando durante la sesión.
  }
}
