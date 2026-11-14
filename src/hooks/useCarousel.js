import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useMediaQuery.js'

/**
 * Carrusel horizontal con scroll nativo (scroll-snap en CSS).
 * Las flechas avanzan una tarjeta y se desactivan en los extremos.
 */
export function useCarousel(gap = 16) {
  const trackRef = useRef(null)
  const reduce = useReducedMotion()
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const update = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    setEdges({
      atStart: t.scrollLeft <= 2,
      atEnd: t.scrollLeft + t.clientWidth >= t.scrollWidth - 2,
    })
  }, [])

  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    const onScroll = () => requestAnimationFrame(update)
    t.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const id = setTimeout(update, 50)
    return () => {
      clearTimeout(id)
      t.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  const scroll = useCallback(
    (dir) => {
      const t = trackRef.current
      if (!t) return
      const card = t.firstElementChild
      const step = card ? card.getBoundingClientRect().width + gap : 300
      t.scrollBy({ left: step * dir, behavior: reduce ? 'auto' : 'smooth' })
    },
    [gap, reduce],
  )

  return { trackRef, scroll, ...edges }
}
