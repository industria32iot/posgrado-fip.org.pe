import { useRef } from 'react'
import { useScrollFrame } from '../../../hooks/useScroll.js'
import { useReducedMotion } from '../../../hooks/useMediaQuery.js'
import { C, asset, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import FormLink from '../LeadForm/FormLink.jsx'
import LeadForm from '../LeadForm/LeadForm.jsx'
import { useLeadForm } from '../LeadForm/LeadFormContext.jsx'
import s from './Hero.module.css'

/* 1. INICIO · contenido.js → inicio */
export default function Hero() {
  const I = C.inicio || {}
  const { modal } = useLeadForm()
  const reduce = useReducedMotion()
  const bgRef = useRef(null)

  /* Parallax suave de la foto de fondo (sin re-renderizar: se escribe el estilo directo) */
  useScrollFrame((y) => {
    const bg = bgRef.current
    if (!bg || reduce) return
    if (y < window.innerHeight * 1.2) bg.style.transform = `translate3d(0,${y * 0.28}px,0)`
  })

  return (
    <section className={s.hero} id="inicio">
      <div className={s.heroBg} ref={bgRef} aria-hidden="true">
        <img src={asset(I.foto || 'assets/portada.jpg')} alt="" fetchPriority="high" width="1920" height="901" />
      </div>
      <div className={cx('container', s.heroIn)}>
        <div className={s.heroCopy} id="heroCopy">
          <p className="eyebrow eyebrow--light" data-in="" style={{ '--d': 0 }}>
            {I.etiqueta}
          </p>
          <h1 data-in="" style={{ '--d': 1 }}>
            {I.titulo}
            {I.tituloDestacado && <> <span className={s.heroAccent}>{I.tituloDestacado}</span></>}
          </h1>
          <p className={s.heroLead} data-in="" style={{ '--d': 2 }}>
            {I.subtitulo}
          </p>
          <ul className={s.heroPillars} data-in="" style={{ '--d': 3 }}>
            {vis(I.pilares).map((p) => (
              <li key={p.titulo}>
                <Icon name={p.icono || 'shield'} />
                <div>
                  <b>{p.titulo}</b>
                  <span>{p.texto}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Celular: botón que abre el formulario en un modal */}
        <FormLink className={cx('btn btn--light btn--block', s.heroFormbtn)} modal>
          Solicita información
        </FormLink>
        {/* Formulario de captación (único en el sitio); se oculta mientras está en el modal */}
        {!modal.open && <LeadForm inHero />}
      </div>
    </section>
  )
}
