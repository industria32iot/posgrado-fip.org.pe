import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ORDEN_TIPOS, TIPOS, porTipo, progById, wa } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import { useLeadForm } from './LeadFormContext.jsx'
import s from './LeadForm.module.css'

const TIPOS_INFO = [
  ['Brochure académico', 'brochure'],
  ['Charla informativa', 'video'],
]

/**
 * Formulario de captación (único en el sitio).
 * Sin backend: valida y abre WhatsApp con los datos. Para guardar registros,
 * reemplazar el bloque ENVÍO por un fetch() al servicio (Sheets, CRM, API).
 * inHero: estilo compacto y animación de entrada de la portada.
 */
export default function LeadForm({ inHero = false }) {
  const { values, update, sentTo, setSentTo } = useLeadForm()
  const formRef = useRef(null)
  const [bad, setBad] = useState({}) // campos con error
  const [showErr, setShowErr] = useState(false)

  const set = (name) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    update({ [name]: v })
    if (bad[name]) setBad((b) => ({ ...b, [name]: false }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const form = formRef.current
    const fields = Array.from(form.querySelectorAll('input:not([type=radio]), select'))
    const nextBad = {}
    fields.forEach((f) => {
      nextBad[f.name] = f.type === 'checkbox' ? !f.checked : !f.checkValidity() || !String(f.value).trim()
    })
    setBad(nextBad)
    const ok = !Object.values(nextBad).some(Boolean)
    setShowErr(!ok)
    if (!ok) {
      const first = fields.find((f) => nextBad[f.name])
      if (first) first.focus()
      return
    }
    const p = progById(values.programa)
    const msg =
      'Hola, solicito ' + values.tipo.toLowerCase() + ' del programa:\n• ' + (p ? p.nombre : '') + '\n\n' +
      'Nombre: ' + values.nombres.trim() + ' ' + values.apellidos.trim() +
      '\nCorreo: ' + values.correo.trim() + '\nCelular: ' + values.celular.trim()
    /* ENVÍO */
    window.open(wa(msg), '_blank', 'noopener')
    setSentTo(values.nombres.trim())
  }

  const selected = progById(values.programa)
  const heroProps = inHero ? { 'data-in': '', 'data-from': 'right', style: { '--d': 2 } } : {}

  if (sentTo != null) {
    return (
      <form className={cx(s.lead, inHero && s.leadHero)} id="solicitar" {...heroProps}>
        <div className={s.leadDone}>
          <div className="ico">
            <Icon name="check" />
          </div>
          <h2 className={s.leadTitle}>¡Gracias, {sentTo}!</h2>
          <p className="small">Un asesor académico se comunicará contigo muy pronto.</p>
        </div>
      </form>
    )
  }

  return (
    <form ref={formRef} className={cx(s.lead, inHero && s.leadHero)} id="solicitar" noValidate onSubmit={onSubmit} {...heroProps}>
      <h2 className={s.leadTitle}>Recibe información del programa</h2>

      <fieldset className={s.leadType}>
        <legend className="sr-only">¿Qué deseas recibir?</legend>
        {TIPOS_INFO.map(([t, icon]) => (
          <label key={t}>
            <input type="radio" name="tipo" value={t} checked={values.tipo === t} onChange={set('tipo')} />
            <span>
              <Icon name={icon} />
              {t}
            </span>
          </label>
        ))}
      </fieldset>

      <div className={s.leadRow}>
        <label className={cx(s.field, bad.nombres && s.isBad)}>
          <span>Nombres</span>
          <input name="nombres" autoComplete="given-name" required maxLength={60} value={values.nombres} onChange={set('nombres')} />
        </label>
        <label className={cx(s.field, bad.apellidos && s.isBad)}>
          <span>Apellidos</span>
          <input name="apellidos" autoComplete="family-name" required maxLength={60} value={values.apellidos} onChange={set('apellidos')} />
        </label>
      </div>
      <label className={cx(s.field, bad.correo && s.isBad)}>
        <span>Correo electrónico</span>
        <input type="email" name="correo" autoComplete="email" required maxLength={100} value={values.correo} onChange={set('correo')} />
      </label>
      <label className={cx(s.field, bad.celular && s.isBad)}>
        <span>Celular</span>
        <input
          type="tel"
          name="celular"
          autoComplete="tel"
          inputMode="numeric"
          required
          maxLength={15}
          pattern="[0-9 +]{9,15}"
          value={values.celular}
          onChange={set('celular')}
        />
      </label>

      {/* Campo de programa: texto en hasta 2 líneas sobre un select nativo invisible */}
      <label className={cx(s.field, bad.programa && s.isBad)}>
        <span>¿Qué programa te interesa?</span>
        <span className={s.selectbox}>
          <select name="programa" required value={values.programa} onChange={set('programa')}>
            <option value="" disabled>
              Selecciona un programa
            </option>
            {ORDEN_TIPOS.map((t) => {
              const list = porTipo(t)
              if (!list.length) return null
              return (
                <optgroup label={TIPOS[t].plural} key={t}>
                  {list.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.corto}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
          <span className={cx(s.selectboxTxt, !selected && s.isEmpty)} aria-hidden="true">
            {selected ? TIPOS[selected.tipo].singular + ' · ' + selected.corto : 'Selecciona un programa'}
          </span>
        </span>
      </label>

      <label className={cx(s.field, s.fieldCheck, bad.privacidad && s.isBad)}>
        <input type="checkbox" name="privacidad" required checked={values.privacidad} onChange={set('privacidad')} />
        <span>
          Acepto la{' '}
          <Link to="/privacidad" target="_blank" rel="noopener">
            política de privacidad
          </Link>{' '}
          y el tratamiento de mis datos personales.
        </span>
      </label>

      <p className={s.leadErr} role="alert" hidden={!showErr}>
        Completa todos los campos y acepta la política de privacidad.
      </p>
      <button className="btn btn--primary btn--block" type="submit">
        Solicita información
      </button>
      <p className={s.leadNote}>
        <Icon name="lock" />
        Tu información está segura. No compartimos tus datos.
      </p>
    </form>
  )
}
