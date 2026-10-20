import { useEffect } from 'react'

let locks = 0

export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks += 1
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollbar > 0 ? `${scrollbar}px` : ''

    return () => {
      locks -= 1
      if (locks === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}
