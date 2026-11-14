import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollFrame } from '../../../hooks/useScroll.js'
import { useScrollSpy } from '../../../hooks/useScrollSpy.js'
import { ORDEN_TIPOS, TIPOS, porTipo, programUrl } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Brand from '../../ui/Brand/Brand.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import SmartLink from '../../ui/SmartLink/SmartLink.jsx'
import s from './Header.module.css'

const LINKS = [
  ['admision', 'Admisión'],
  ['docentes', 'Docentes'],
  ['investigacion', 'Investigación'],
  ['agenda', 'Agenda'],
  ['contacto', 'Contacto'],
]
const SPY_IDS = LINKS.map((l) => l[0])

/**
 * Cabecera fija con mega menú de programas y menú móvil.
 * solicitarHref: destino de "Solicita información" (en la ficha de un programa,
 * lleva al formulario de la portada con el programa preseleccionado).
 */
export default function Header({ solicitarHref = '#solicitar' }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const headerRef = useRef(null)
  const subRef = useRef(null)
  const [navOpen, setNavOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)

  /* Sombra (>8 px) y cabecera compacta (>140 px) */
  useScrollFrame((y) => {
    setScrolled(y > 8)
    setCompact(y > 140)
  })

  /* Enlace activo (solo en la portada) */
  const getOffset = useCallback(() => headerRef.current?.offsetHeight || 0, [])
  const active = useScrollSpy(SPY_IDS, getOffset, isHome)

  /* Menú móvil: bloquea el scroll del fondo mientras está abierto */
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  /* Clic fuera cierra el submenú; Esc cierra todo */
  useEffect(() => {
    const onClick = (e) => {
      if (subRef.current && !subRef.current.contains(e.target)) setSubOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSubOpen(false)
        setNavOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  /* Al elegir un enlace se cierran el menú móvil y el submenú */
  const closeNav = () => {
    setNavOpen(false)
    setSubOpen(false)
  }
  /* En la ficha de programa, "Contacto" es el pie de la misma página */
  const href = (id) => (id === 'contacto' && !isHome ? '#contacto' : '/#' + id)

  return (
    <header ref={headerRef} className={cx(s.header, scrolled && s.isScrolled, compact && s.isCompact)} id="header">
      <div className={cx('container', s.headerIn)}>
        <Brand variant="header" compact={compact} to="/#inicio" />

        <nav className={cx(s.nav, navOpen && s.isOpen)} id="nav" aria-label="Principal">
          <ul>
            <li ref={subRef} className={cx(s.hasSub, subOpen && s.isOpen)}>
              <button
                type="button"
                className={s.navSubBtn}
                aria-expanded={subOpen}
                onClick={() => setSubOpen((o) => !o)}
              >
                Programas <Icon name="chev" />
              </button>
              <div className={s.mega} id="mega">
                <div className={s.megaCols}>
                  {ORDEN_TIPOS.map((t) => {
                    const list = porTipo(t)
                    if (!list.length) return null
                    return (
                      <div className={s.megaCol} key={t}>
                        <b>{TIPOS[t].plural}</b>
                        <ul>
                          {list.map((p) => (
                            <li key={p.id}>
                              <Link to={programUrl(p)} onClick={closeNav}>
                                {p.corto}
                                {p.estado && <em>{p.estado}</em>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <Link className={s.megaAll} to="/#programas" onClick={closeNav}>
                  Ver todos los programas <Icon name="arrow" />
                </Link>
              </div>
            </li>
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <Link to={href(id)} className={cx(active === id && s.isActive)} onClick={closeNav}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <SmartLink className={cx('btn btn--primary', s.navCtaM)} href={solicitarHref} onClick={closeNav}>
            Solicita información
          </SmartLink>
        </nav>

        <SmartLink className={cx('btn btn--primary', s.headerCta)} href={solicitarHref}>
          <Icon name="brochure" /> Solicita información
        </SmartLink>
        <button
          className={s.burger}
          id="burger"
          type="button"
          aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-controls="nav"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <Icon name={navOpen ? 'x' : 'menu'} />
        </button>
      </div>
    </header>
  )
}

/* Cabecera mínima (solo el escudo), para páginas legales */
export function SimpleHeader() {
  return (
    <header className={s.header} style={{ position: 'static' }}>
      <div className={cx('container', s.headerIn)}>
        <Brand variant="header" to="/" />
      </div>
    </header>
  )
}
