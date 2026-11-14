import { useEffect, useRef, useState } from 'react'

/**
 * Llama a onFrame(scrollY) como máximo una vez por cuadro (requestAnimationFrame)
 * al hacer scroll o cambiar el tamaño de la ventana.
 */
export function useScrollFrame(onFrame) {
  const cb = useRef(onFrame)
  useEffect(() => {
    cb.current = onFrame
  })

  useEffect(() => {
    let ticking = false
    const run = () => {
      ticking = false
      cb.current(window.scrollY)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(run)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    run()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/* true cuando la página bajó más de `px` píxeles (solo re-renderiza al cambiar) */
export function useScrolledPast(px) {
  const [past, setPast] = useState(false)
  useScrollFrame((y) => setPast(y > px))
  return past
}
