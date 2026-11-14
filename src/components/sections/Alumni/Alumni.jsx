import { C, vis } from '../../../utils/content.js'
import { TESTIMONIOS } from '../../../utils/testimonios.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import s from './Alumni.module.css'

/* 11b. NUESTROS EGRESADOS INVESTIGAN · contenido.js → egresadosInvestigan
   Alternativa a Testimonios: se muestra mientras haya menos de 2 testimonios reales. */
export default function Alumni() {
  const EI = C.egresadosInvestigan
  const tes = vis(C.investigacion?.tesisRecientes)
  if (TESTIMONIOS.length >= 2 || !EI || !EI.visible || !tes.length) return null

  return (
    <section className="section" id="egresados">
      <div className="container">
        <Reveal className="head">
          <p className="eyebrow">Egresados</p>
          <h2 id="egresadosTitulo">{EI.titulo || 'Nuestros egresados investigan'}</h2>
        </Reveal>
        <div className={s.alumni} id="egresadosGrid">
          {tes.slice(0, 3).map((t, i) => (
            <Reveal as="article" index={i} className={s.alumnus} key={t.titulo}>
              <span className={s.alumnusK}>
                <Icon name="book" />
                Tesis de maestría
              </span>
              <h3>{t.titulo}</h3>
              <p>
                <b>{t.autor}</b>
                {t.anio && <> <span>· {t.anio}</span></>}
              </p>
              {t.enlace && (
                <a className="more" href={t.enlace} target="_blank" rel="noopener noreferrer">
                  Leer tesis <Icon name="arrow" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
