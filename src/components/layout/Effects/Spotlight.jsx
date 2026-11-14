import { useEffect } from 'react'
import { useFinePointer, useReducedMotion } from '../../../hooks/useMediaQuery.js'

/* Brillo dorado que sigue al cursor en las tarjetas con clase global .spot */
export default function Spotlight() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!fine || reduce) return
    const onMove = (e) => {
      const el = e.target.closest && e.target.closest('.spot')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', e.clientX - r.left + 'px')
      el.style.setProperty('--my', e.clientY - r.top + 'px')
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [fine, reduce])

  return null
}
