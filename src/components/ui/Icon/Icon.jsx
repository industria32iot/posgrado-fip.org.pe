import { ICONS } from './icons.js'

/**
 * Ícono SVG decorativo. Reemplaza el sprite <svg><use href="#i-..."/></svg>.
 * El tamaño lo da el CSS (svg { width: 1.1em } o la regla de cada componente).
 */
export default function Icon({ name, style, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.globe }}
    />
  )
}
