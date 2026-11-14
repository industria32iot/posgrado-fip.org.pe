import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { C, K, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Brand from '../../ui/Brand/Brand.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import s from './Footer.module.css'

const RED_ICON = { facebook: 'fb', instagram: 'ig', youtube: 'yt', x: 'xx', twitter: 'xx', linkedin: 'in' }
const ext = { target: '_blank', rel: 'noopener noreferrer' }
const YEAR = new Date().getFullYear()

/* FOOTER · contenido.js → contacto, redes
   Solo teléfono, WhatsApp y correo: la dirección y el horario ya están en "Visítanos". */
export default function Footer() {
  const redes = vis(C.redes).filter((r) => r.url)
  const waNums = (K.whatsapps?.length ? K.whatsapps : [{ numero: K.whatsapp, texto: K.whatsappTexto }]).filter((w) => w.numero)

  return (
    <footer className={cx(s.footer, s.footerMin)} id="contacto">
      <div className={cx('container', s.footerGrid)}>
        <div className={s.footerBrand}>
          <Brand variant="light" to="/#inicio" />
          {C.redesTitulo && redes.length > 0 && <p className={s.socialT}>{C.redesTitulo}</p>}
          <div className={s.social} id="footerRedes">
            {redes.map((r) => (
              <a key={r.red} href={r.url} aria-label={r.red} {...ext}>
                <Icon name={RED_ICON[r.red] || 'globe'} />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Enlaces">
          <h3>Enlaces</h3>
          <ul>
            <li>
              <Link to="/#programas">Programas de posgrado</Link>
            </li>
            <li>
              <Link to="/#admision">Calendario de admisión</Link>
            </li>
            <li>
              <Link to="/#faq">Preguntas frecuentes</Link>
            </li>
            <li>
              <a href="https://www.fip.uni.edu.pe/" {...ext}>
                Facultad FIP
              </a>
            </li>
            <li>
              <a href="https://repositorio.uni.edu.pe" {...ext}>
                Repositorio UNI
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <h3>Contacto</h3>
          <ul className={s.contact} id="footerContacto">
            {K.telefono && (
              <li>
                <Icon name="phone" />
                <a href={'tel:' + K.telefonoLink}>{K.telefono}</a>
              </li>
            )}
            <li>
              <Icon name="wa" />
              <span>
                {waNums.map((w, i) => (
                  <Fragment key={w.numero}>
                    {i > 0 && ' · '}
                    <a href={'https://wa.me/' + String(w.numero).replace(/\D/g, '')} aria-label={'WhatsApp ' + (w.texto || w.numero)} {...ext}>
                      {String(w.texto || w.numero).replace(/^\+51\s*/, '')}
                    </a>
                  </Fragment>
                ))}
              </span>
            </li>
            {K.correo && (
              <li>
                <Icon name="mail" />
                <a href={'mailto:' + K.correo}>{K.correo}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className={cx('container', s.footerBottom)}>
        <span>© {YEAR} Universidad Nacional de Ingeniería</span>
        <span className={s.footerLinks}>
          <Link to="/privacidad">Política de privacidad</Link>
          {C.mostrarSPE !== false && (
            <a id="footerSPE" href="https://pe.linkedin.com/in/speuni" {...ext}>
              SPE UNI Student Chapter
            </a>
          )}
          <a href="#main">Volver arriba ↑</a>
        </span>
      </div>
    </footer>
  )
}
