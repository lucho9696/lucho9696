import { useState, type ImgHTMLAttributes } from 'react'

const FALLBACK = '/images/placeholder.svg'

/** Imagen de producto con recurso local de respaldo si el archivo no carga. */
export function ProductImage({ src, alt, className = '', ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const current = failedSrc === src ? FALLBACK : src

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={800}
      height={800}
      onError={() => {
        if (current !== FALLBACK) setFailedSrc(src)
      }}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}
