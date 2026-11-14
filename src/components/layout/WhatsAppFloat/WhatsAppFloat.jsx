import { useEffect, useState } from 'react'
import { useIsMobile } from '../../../hooks/useMediaQuery.js'
import { useScrollFrame } from '../../../hooks/useScroll.js'
import { wa } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import s from './WhatsAppFloat.module.css'

const TIP_KEY = 'waTip'
const seenTip = () => {
  try {
    return sessionStorage.getItem(TIP_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Botón flotante de WhatsApp + burbuja "¿Tienes dudas?" (a los 6 s, una vez por sesión).
 * En celular se oculta mientras se ve el formulario del hero, y la burbuja no tapa el pie.
 */
export default function WhatsAppFloat({ message = 'Hola, quisiera información de los programas de posgrado de la FIP-UNI' }) {
  const mobile = useIsMobile()
  const [formVisible, setFormVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const [tip, setTip] = useState('none') // none | shown | in | closed

  useScrollFrame(() => {
    const form = document.getElementById('solicitar')
    const inHero = form && form.closest('#inicio')
    if (inHero) {
      const r = form.getBoundingClientRect()
      setFormVisible(r.bottom > 0 && r.top < window.innerHeight)
    } else setFormVisible(false)
    const pie = document.getElementById('contacto')
    setFooterVisible(!!pie && pie.getBoundingClientRect().top < window.innerHeight)
  })

  /* La burbuja aparece a los 6 s (una vez por sesión) */
  useEffect(() => {
    if (seenTip()) return
    const id = setTimeout(() => {
      setTip('shown')
      try {
        sessionStorage.setItem(TIP_KEY, '1')
      } catch {
        /* sin sessionStorage: se mostrará otra vez en la próxima visita */
      }
    }, 6000)
    return () => clearTimeout(id)
  }, [])

  /* Un cuadro después de montarse, entra con transición */
  useEffect(() => {
    if (tip !== 'shown') return
    const raf = requestAnimationFrame(() => setTip('in'))
    return () => cancelAnimationFrame(raf)
  }, [tip])

  const tapa = mobile && formVisible

  return (
    <>
      <a
        className={cx(s.waFloat, tapa && s.waFloatOff)}
        href={wa(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
      >
        <Icon name="wa" />
      </a>
      {(tip === 'shown' || tip === 'in') && (
        <div className={cx(s.waTip, tip === 'in' && 'is-in', tapa && s.waFloatOff, footerVisible && s.waTipOff)}>
          <b>¿Tienes dudas?</b> Escríbenos, un asesor te responde.
          <button type="button" aria-label="Cerrar" onClick={() => setTip('closed')}>
            <Icon name="x" />
          </button>
        </div>
      )}
    </>
  )
}
