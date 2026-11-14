import { useCarousel } from '../../../hooks/useCarousel.js'
import { useSpot } from '../../../hooks/useMediaQuery.js'
import { C, asset, inicialesDocente, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import CarouselNav from '../../ui/CarouselNav/CarouselNav.jsx'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import FormLink from '../LeadForm/FormLink.jsx'
import s from './Faculty.module.css'

/* Sin foto: iniciales en serif con un tono distinto por docente (rotación de 4) */
function Avatar({ d, i }) {
  if (d.foto) {
    return <img className="avatar avatar--img avatar--foto" src={asset(d.foto)} alt={d.nombre} loading="lazy" width="400" height="400" />
  }
  return <span className={'avatar avatar--t' + (i % 4)}>{inicialesDocente(d.nombre)}</span>
}

/* 7. DOCENTES · contenido.js → docentes (carrusel con scroll-snap) */
export default function Faculty() {
  const docs = vis(C.docentes)
  const spot = useSpot()
  const { trackRef, scroll } = useCarousel(16)

  return (
    <section className="section section--tint" id="docentes">
      <div className="container">
        <div className={s.facHead}>
          <div>
            <p className="eyebrow">Cuerpo docente</p>
            <h2>Plana docente nacional e internacional</h2>
            <p>Especialistas con trayectoria en la industria, el Estado y universidades del Perú y del extranjero.</p>
          </div>
          <CarouselNav
            label="Navegar docentes"
            prevLabel="Docentes anteriores"
            nextLabel="Más docentes"
            onScroll={scroll}
          />
        </div>
        <div ref={trackRef} className={cx(s.faculty, s.facTrack)} id="docentesGrid">
          {docs.map((d, i) => (
            <Reveal as="article" index={i} className={cx(s.prof, spot)} key={d.nombre}>
              <div className={s.profTop}>
                <Avatar d={d} i={i} />
                <div>
                  <h3>{d.nombre}</h3>
                  <p className={s.role}>{d.cargo}</p>
                </div>
              </div>
              <p className={s.profSum}>{d.resumen}</p>
              {d.sellos?.length > 0 && (
                <ul className={s.profSeals}>
                  {d.sellos.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
        <p className={s.facMore}>
          <FormLink className="more">
            Conoce a todo el equipo docente en el brochure <Icon name="arrow" />
          </FormLink>
        </p>
      </div>
    </section>
  )
}
