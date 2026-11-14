import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Desplazamiento al navegar:
 *  - Página nueva sin #ancla → arriba, al instante (como al cargar una página).
 *  - Página nueva con #ancla (ej. /#admision desde una ficha) → a esa sección, al instante.
 *  - Misma página con #ancla → desplazamiento suave hasta la sección.
 * El margen bajo la cabecera fija lo da el CSS (scroll-padding-top).
 */
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(null)

  useEffect(() => {
    const samePage = prevPath.current === pathname
    prevPath.current = pathname
    const behavior = samePage ? 'smooth' : 'instant'
    if (!hash) {
      if (!samePage) window.scrollTo({ top: 0, left: 0, behavior })
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    /* esperar a que la página nueva termine de pintarse */
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior }), samePage ? 0 : 60)
    return () => clearTimeout(t)
  }, [pathname, hash, key])

  return null
}
