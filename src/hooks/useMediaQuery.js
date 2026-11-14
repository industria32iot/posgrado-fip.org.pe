import { useSyncExternalStore } from 'react'

/* true/false según una media query; se actualiza si cambia (rotar pantalla, ajustes del sistema) */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width:640px)')
/* Efecto "spotlight": solo con mouse y sin "reducir movimiento" */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

/* Clase global "spot" (brillo que sigue al cursor) solo con mouse y sin "reducir movimiento" */
export function useSpot() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  return fine && !reduce ? 'spot' : ''
}
