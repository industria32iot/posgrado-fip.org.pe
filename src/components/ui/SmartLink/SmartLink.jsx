import { Link } from 'react-router-dom'
import { isExternal } from '../../../utils/content.js'

/**
 * Enlace que elige el tipo correcto:
 *  "/ruta"       → <Link> de React Router (sin recargar la página)
 *  "#ancla"      → <a> normal (desplazamiento dentro de la página)
 *  "https://..." → <a target="_blank" rel="noopener">
 */
export default function SmartLink({ href = '', children, ...rest }) {
  if (href.startsWith('/')) return <Link to={href} {...rest}>{children}</Link>
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }
  return <a href={href} {...rest}>{children}</a>
}
