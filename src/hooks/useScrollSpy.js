import { useEffect, useState } from 'react'

/**
 * Sección activa del menú: la que ya pasó bajo el header (la que se está leyendo),
 * no la que recién se asoma por abajo.
 */
export function useScrollSpy(ids, getOffset, enabled = true) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!enabled) return
    let ticking = false
    const run = () => {
      ticking = false
      const line = getOffset() + 140
      let best = null, bestTop = -Infinity
      ids.forEach((id) => {
        const t = document.getElementById(id)
        if (!t) return
        const r = t.getBoundingClientRect()
        if (r.top <= line && r.bottom > line && r.top > bestTop) {
          best = id
          bestTop = r.top
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(run)
      }
    }
    const onHash = () => setTimeout(run, 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHash)
    run()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHash)
    }
  }, [ids, getOffset, enabled])

  return enabled ? active : null
}
