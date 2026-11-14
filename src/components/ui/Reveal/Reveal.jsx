import { useInView } from '../../../hooks/useInView.js'
import { useReducedMotion } from '../../../hooks/useMediaQuery.js'

/**
 * Aparición suave al hacer scroll (clases globales .reveal / .is-in de global.css).
 * `index` escalona la animación entre hermanos (máx. 6, como en el original).
 * Con "reducir movimiento" se muestra sin animar.
 */
export default function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px', disabled: reduce })
  const cls = [className, !reduce && 'reveal', !reduce && inView && 'is-in'].filter(Boolean).join(' ')
  return (
    <Tag ref={ref} className={cls} style={reduce ? style : { ...style, '--i': Math.min(index, 6) }} {...rest}>
      {children}
    </Tag>
  )
}
