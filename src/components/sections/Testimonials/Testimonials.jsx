import { useCarousel } from '../../../hooks/useCarousel.js'
import { useSpot } from '../../../hooks/useMediaQuery.js'
import { asset } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import { TESTIMONIOS } from '../../../utils/testimonios.js'
import CarouselNav from '../../ui/CarouselNav/CarouselNav.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import s from './Testimonials.module.css'

const iniciales = (n) => {
  const w = String(n).trim().split(/\s+/)
  return ((w[0] || '')[0] || '') + ((w[1] || '')[0] || '')
}

/* 11. TESTIMONIOS · contenido.js → testimonios
   Se muestra solo con 2 o más testimonios reales. 2 o 3: cuadrícula; más de 3: carrusel. */
export default function Testimonials() {
  const spot = useSpot()
  const { trackRef, scroll, atStart, atEnd } = useCarousel(20)
  const list = TESTIMONIOS
  if (list.length < 2) return null
  const carrusel = list.length > 3

  return (
    <section className="section" id="testimonios">
      <div className="container">
        <Reveal className="head head--split">
          <div>
            <p className="eyebrow">Testimonios</p>
            <h2>Experiencias de nuestros egresados</h2>
          </div>
          <div className={s.testiSide}>
            <p>Profesionales que hoy lideran proyectos en la industria del petróleo, gas natural y petroquímica.</p>
            <CarouselNav
              className={s.testiNav}
              hidden={!carrusel}
              label="Navegar testimonios"
              prevLabel="Testimonios anteriores"
              nextLabel="Más testimonios"
              onScroll={scroll}
              atStart={atStart}
              atEnd={atEnd}
              disableAtEdges
            />
          </div>
        </Reveal>
        <div ref={trackRef} className={cx(s.quotes, list.length === 2 && s.quotes2, carrusel && s.quotesTrack)} id="testiGrid">
          {list.map((t, i) => {
            const cargo = [t.cargo, t.empresa].filter(Boolean).join(' · ')
            const prog = [t.programa, t.anio].filter(Boolean).join(' ')
            return (
              <Reveal as="figure" index={i} className={cx(s.quote, t.ejemplo && s.quoteEj, spot)} key={i}>
                {t.ejemplo && <span className={s.quoteLabel}>Ejemplo</span>}
                <blockquote>{t.texto}</blockquote>
                <figcaption>
                  {t.foto ? (
                    <img className="avatar avatar--sm avatar--img" src={asset(t.foto)} alt="" />
                  ) : (
                    <span className="avatar avatar--sm">{t.ejemplo ? <Icon name="user" /> : iniciales(t.nombre)}</span>
                  )}
                  <div>
                    <b>{t.nombre}</b>
                    {cargo && <span>{cargo}</span>}
                    {prog && <em className={s.quoteProg}>{prog}</em>}
                  </div>
                  {t.linkedin && (
                    <a className={s.quoteIn} href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={'LinkedIn de ' + t.nombre}>
                      <Icon name="in" />
                    </a>
                  )}
                </figcaption>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
