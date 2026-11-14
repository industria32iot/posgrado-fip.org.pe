import { useEffect, useRef } from 'react'
import Icon from '../../ui/Icon/Icon.jsx'
import LeadForm from './LeadForm.jsx'
import { useLeadForm } from './LeadFormContext.jsx'
import s from './LeadForm.module.css'

/**
 * Formulario en ventana modal (<dialog> nativo: foco atrapado, Esc y fondo oscuro).
 * Mientras está abierto, el hero no muestra su formulario (no se duplica el id).
 */
export default function FormDialog() {
  const { modal, closeModal } = useLeadForm()
  const ref = useRef(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (modal.open && !dlg.open) {
      dlg.showModal()
      const first = dlg.querySelector('input:not([type=radio]), select')
      if (first) first.focus()
    } else if (!modal.open && dlg.open) dlg.close()
  }, [modal.open])

  return (
    <dialog
      ref={ref}
      className={s.formDialog}
      aria-label="Solicita información"
      onClose={closeModal}
      onClick={(e) => {
        if (e.target === ref.current) closeModal() // clic fuera del formulario
      }}
    >
      <button type="button" className={s.formDialogX} aria-label="Cerrar" onClick={closeModal}>
        <Icon name="x" />
      </button>
      {modal.open && <LeadForm />}
    </dialog>
  )
}
