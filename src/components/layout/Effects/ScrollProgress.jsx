import { useRef } from 'react'
import { useScrollFrame } from '../../../hooks/useScroll.js'

/* Barra dorada de progreso de lectura (clase global .progress) */
export default function ScrollProgress() {
  const ref = useRef(null)
  useScrollFrame((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (ref.current) ref.current.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')'
  })
  return <div ref={ref} className="progress" aria-hidden="true" />
}
