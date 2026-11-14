import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useMediaQuery.js'

/**
 * Filtro con transición: lo que sale se desvanece (is-out) y luego se oculta;
 * lo que entra aparece desde is-out. Devuelve { [key]: { out, hidden } }.
 */
export function useFilterTransition(keys, isShown) {
  const reduce = useReducedMotion()
  const [state, setState] = useState(() => Object.fromEntries(keys.map((k) => [k, { out: false, hidden: !isShown(k) }])))
  const timers = useRef([])

  useEffect(() => {
    const t = timers.current
    t.forEach(clearTimeout)
    t.length = 0
    setState((prev) => {
      const next = { ...prev }
      keys.forEach((k) => {
        const show = isShown(k)
        const cur = prev[k] || { out: false, hidden: false }
        if (show && cur.hidden) next[k] = { out: true, hidden: false } // entra: primero visible y transparente
        else if (!show && !cur.hidden) next[k] = { out: true, hidden: false } // sale: se desvanece
        else if (show) next[k] = { out: false, hidden: false }
      })
      return next
    })
    /* Dos cuadros después, lo que entra pierde is-out (así la transición se ve) */
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() =>
        setState((prev) => {
          const next = { ...prev }
          keys.forEach((k) => {
            if (isShown(k)) next[k] = { out: false, hidden: false }
          })
          return next
        }),
      )
    })
    /* Lo que sale se oculta al terminar la transición (220 ms) */
    t.push(
      setTimeout(
        () =>
          setState((prev) => {
            const next = { ...prev }
            keys.forEach((k) => {
              if (!isShown(k) && prev[k]?.out) next[k] = { out: true, hidden: true }
            })
            return next
          }),
        reduce ? 0 : 220,
      ),
    )
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      t.forEach(clearTimeout)
    }
    // isShown cambia con el filtro; keys es estable
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown, reduce])

  return state
}
