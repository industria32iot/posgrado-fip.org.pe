import { Link, useLocation } from 'react-router-dom'
import { useLeadForm } from './LeadFormContext.jsx'

/**
 * Enlace al formulario "Solicita información".
 *  - Preselecciona el tipo ("Charla informativa") o el programa si se indican.
 *  - modal: abre el formulario en una ventana modal.
 *  - En celular, en la portada, siempre abre el modal (allí el formulario no se ve).
 *  - Fuera de la portada, lleva a /?programa=ID#solicitar.
 */
export default function FormLink({ tipo, progId, modal = false, className, children, ...rest }) {
  const { pathname } = useLocation()
  const { preselect, openModal } = useLeadForm()
  const isHome = pathname === '/'

  if (!isHome) {
    const to = '/' + (progId ? '?programa=' + encodeURIComponent(progId) : '') + '#solicitar'
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  const onClick = (e) => {
    preselect({ tipo, progId })
    if (modal || window.matchMedia('(max-width:640px)').matches) {
      e.preventDefault()
      openModal(e.currentTarget)
    }
  }
  return (
    <a href="#solicitar" className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}
