import { useEffect } from 'react'
import { SITE } from '@/content/site'

/** Título y descripción por página (SEO básico). */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : SITE.defaultTitle

    const content = description ?? SITE.defaultDescription
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(selector)?.setAttribute('content', content)
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
  }, [title, description])
}
