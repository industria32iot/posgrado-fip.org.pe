import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { progById } from '../../../utils/content.js'

/**
 * Estado compartido del formulario "Solicita información".
 * El formulario vive en el hero, pero también se abre en un modal (celular y
 * enlaces con modal). Al guardar el estado aquí, lo escrito se conserva al pasar
 * de un lugar a otro, igual que en el sitio original (que movía el mismo nodo).
 */
const LeadFormContext = createContext(null)

const INITIAL = {
  tipo: 'Brochure académico',
  nombres: '',
  apellidos: '',
  correo: '',
  celular: '',
  programa: '', // id del programa
  privacidad: false,
}

export function LeadFormProvider({ children }) {
  const { pathname, search, hash } = useLocation()
  const [values, setValues] = useState(INITIAL)
  const [sentTo, setSentTo] = useState(null) // nombre de quien envió: muestra el "¡Gracias!"
  const [modal, setModal] = useState({ open: false, origin: null })

  const update = useCallback((patch) => setValues((v) => ({ ...v, ...patch })), [])

  /* Preseleccionar tipo de información o programa (botones de charlas, fichas, etc.) */
  const preselect = useCallback(
    ({ tipo, progId } = {}) => {
      const patch = {}
      if (tipo) patch.tipo = tipo
      if (progId && progById(progId)) patch.programa = progId
      if (Object.keys(patch).length) update(patch)
    },
    [update],
  )

  const openModal = useCallback((origin = null) => setModal({ open: true, origin }), [])
  const closeModal = useCallback(() => {
    setModal((m) => {
      if (m.origin && typeof m.origin.focus === 'function') setTimeout(() => m.origin.focus(), 0)
      return { open: false, origin: null }
    })
  }, [])

  /* Llegada desde una ficha de programa: /?programa=ID#solicitar */
  useEffect(() => {
    if (pathname !== '/') return
    const qp = new URLSearchParams(search).get('programa')
    if (!qp) return
    // Sincroniza el formulario con la URL al navegar desde una ficha de programa
    // y permite una nueva solicitud aunque ya se haya enviado otra.
    // oxlint-disable-next-line react/set-state-in-effect
    preselect({ progId: qp })
    setSentTo(null)
  }, [pathname, search, preselect])

  /* En celular el formulario no se ve en la portada: llegar con #solicitar abre el modal */
  useEffect(() => {
    if (pathname !== '/' || hash !== '#solicitar') return
    if (!window.matchMedia('(max-width:640px)').matches) return
    const id = setTimeout(() => openModal(null), 300)
    return () => clearTimeout(id)
  }, [pathname, hash, openModal])

  const value = useMemo(
    () => ({ values, update, preselect, sentTo, setSentTo, modal, openModal, closeModal }),
    [values, update, preselect, sentTo, modal, openModal, closeModal],
  )
  return <LeadFormContext.Provider value={value}>{children}</LeadFormContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useLeadForm() {
  const ctx = useContext(LeadFormContext)
  if (!ctx) throw new Error('useLeadForm debe usarse dentro de <LeadFormProvider>')
  return ctx
}
