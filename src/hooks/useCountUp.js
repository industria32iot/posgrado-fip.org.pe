import { useEffect, useState } from 'react'
import { useInView } from './useInView.js'
import { useReducedMotion } from './useMediaQuery.js'

const fmt = (n, pre, suf) => (pre || '') + Number(n).toLocaleString('en-US') + (suf || '')

/* Contador que sube desde 0 cuando el número entra en pantalla (1,4 s, ease-out). */
export function useCountUp(end, prefix = '', suffix = '') {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView({ threshold: 0.6, disabled: reduce })
  const [text, setText] = useState(fmt(end, prefix, suffix))

  useEffect(() => {
    if (!inView || reduce) return
    let raf, t0 = null
    const step = (t) => {
      if (!t0) t0 = t
      const k = Math.min((t - t0) / 1400, 1)
      const e = 1 - Math.pow(1 - k, 3)
      setText(fmt(Math.round(end * e), prefix, suffix))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, end, prefix, suffix])

  return [ref, text]
}
