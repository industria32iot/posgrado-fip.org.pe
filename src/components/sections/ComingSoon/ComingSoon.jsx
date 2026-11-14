import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { C, listaTexto, vis, wa } from '../../../utils/content.js'
import Icon from '../../ui/Icon/Icon.jsx'
import s from './ComingSoon.module.css'

/* PRÓXIMAMENTE · contenido.js → escuelaLideres, cursos, proximamente
   Escuela de Líderes + Cursos en una sola franja, con lista de espera por correo. */
export default function ComingSoon() {
  const E = C.escuelaLideres
  const CU = C.cursos
  const PX = C.proximamente || {}
  const mailRef = useRef(null)
  const okRef = useRef(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!E && !CU) return null

  const onSubmit = (e) => {
    e.preventDefault()
    const mail = mailRef.current
    const ok = okRef.current
    const mailOk = mail.value.trim() && mail.checkValidity()
    const msg = !mailOk ? 'Escribe un correo electrónico válido.' : !ok.checked ? 'Acepta la política de privacidad para continuar.' : ''
    setError(msg)
    if (msg) {
      ;(mailOk ? ok : mail).focus()
      return
    }
    const correo = mail.value.trim()
    if (PX.formularioAviso) {
      /* Si el servicio no admite CORS: se abre el formulario con el correo como parámetro */
      const abrir = () => {
        const u = PX.formularioAviso + (PX.formularioAviso.includes('?') ? '&' : '?') + 'email=' + encodeURIComponent(correo)
        window.open(u, '_blank', 'noopener')
      }
      fetch(PX.formularioAviso, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'email=' + encodeURIComponent(correo),
      })
        .then((r) => {
          if (!r.ok) abrir()
        })
        .catch(abrir)
        .finally(() => setDone(true))
    } else {
      window.open(
        wa('Hola, quiero que me avisen cuando abran la Escuela de Líderes o los Cursos especializados de la FIP-UNI. Mi correo: ' + correo),
        '_blank',
        'noopener',
      )
      setDone(true)
    }
  }

  return (
    <div className={s.soonwrap} id="ejecutiva">
      <div className={s.soon} id="soon">
        <div className={s.soonHead}>
          <span className={s.soonBadge}>
            <i></i>Próximamente{PX.fecha && <em> · {PX.fecha}</em>}
          </span>
          <h2>Nuevas líneas de formación</h2>
        </div>
        <ul className={s.soonList}>
          {E && (
            <li>
              <span className={s.soonIco}>
                <Icon name="cap" />
              </span>
              <div>
                <b>{E.titulo}</b>
                <span>{E.temas?.length ? listaTexto(E.temas) : E.texto}</span>
              </div>
            </li>
          )}
          {CU && (
            <li>
              <span className={s.soonIco}>
                <Icon name="flask" />
              </span>
              <div>
                <b>{CU.titulo}</b>
                <span>{listaTexto(vis(CU.lista).map((c) => c.nombre))}</span>
              </div>
            </li>
          )}
        </ul>

        {done ? (
          <p className={s.soonDone} role="status">
            <Icon name="check" />
            ¡Listo! Te avisaremos cuando abra la convocatoria.
          </p>
        ) : (
          <form className={s.soonForm} noValidate onSubmit={onSubmit}>
            <div className={s.soonRow}>
              <label className="sr-only" htmlFor="soonMail">
                Correo electrónico
              </label>
              <input ref={mailRef} id="soonMail" type="email" name="email" autoComplete="email" required placeholder="Tu correo electrónico" />
              <button className="btn btn--primary" type="submit">
                Avísame
              </button>
            </div>
            <label className={s.soonOk}>
              <input ref={okRef} type="checkbox" name="privacidad" required /> Acepto la{' '}
              <Link to="/privacidad" target="_blank" rel="noopener">
                política de privacidad
              </Link>
            </label>
            <p className={s.soonErr} role="alert" hidden={!error}>
              {error}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
