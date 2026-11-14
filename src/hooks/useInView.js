import { useEffect, useRef, useState } from 'react'

/* Un IntersectionObserver compartido por cada combinación de opciones */
const observers = new Map()
function observe(el, options, cb) {
  const key = JSON.stringify(options)
  let entry = observers.get(key)
  if (!entry) {
    const callbacks = new Map()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => callbacks.get(e.target)?.(e))
    }, options)
    entry = { io, callbacks }
    observers.set(key, entry)
  }
  entry.callbacks.set(el, cb)
  entry.io.observe(el)
  return () => {
    entry.callbacks.delete(el)
    entry.io.unobserve(el)
  }
}

/**
 * Devuelve [ref, visible]. Con once = true deja de observar tras la primera vez
 * (como el script original: la animación ocurre una sola vez).
 */
export function useInView({ rootMargin = '0px', threshold = 0, once = true, disabled = false } = {}) {
  const ref = useRef(null)
  /* Sin IntersectionObserver (navegadores muy antiguos) se muestra todo */
  const [inView, setInView] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || disabled || !('IntersectionObserver' in window)) return
    let stop = null
    stop = observe(el, { rootMargin, threshold }, (e) => {
      if (e.isIntersecting) {
        setInView(true)
        if (once && stop) stop()
      } else if (!once) setInView(false)
    })
    return () => stop && stop()
  }, [rootMargin, threshold, once, disabled])

  return [ref, inView]
}

/* Líneas que se "dibujan" al entrar en pantalla (clase global is-in).
   Sin IntersectionObserver o con "reducir movimiento" se muestran completas. */
export function useDraw() {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px', disabled: reduce })
  return [ref, reduce || inView ? 'is-in' : '']
}
