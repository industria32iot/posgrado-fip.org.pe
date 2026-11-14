import { useDraw } from '../../../hooks/useInView.js'
import { C, PROGS, vis, wa } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import FormLink from '../LeadForm/FormLink.jsx'
import s from './Admission.module.css'

/* 4. CALENDARIO DE ADMISIÓN · contenido.js → calendario */
export default function Admission() {
  const A = C.calendario
  const [stepsRef, drawn] = useDraw()
  if (!A) return null
  const dips = PROGS.filter((p) => p.tipo === 'diplomado' && p.visible !== false)

  return (
    <section className="section section--tint" id="admision">
      <div className="container" id="admisionIn">
        <div className={s.admHead}>
          <div>
            <p className="eyebrow">{A.etiqueta}</p>
            <h2>{A.titulo}</h2>
          </div>
          <FormLink className="btn btn--primary">
            Solicita información <Icon name="arrow" />
          </FormLink>
        </div>

        <div className={s.adm}>
          {/* Doctorado y Maestría: pasos con título y fecha */}
          <div className={cx(s.admCard, s.admCardMain)}>
            <div className={s.admTop}>
              <span className={s.admK}>{A.alcance || 'Doctorado y Maestría'}</span>
              {A.estadoInscripcion && (
                <span className={s.admTag}>
                  <i></i>
                  {A.estadoInscripcion}
                </span>
              )}
            </div>
            <ol ref={stepsRef} className={cx(s.steps, s.stepsAdm, drawn)}>
              {vis(A.pasos).map((p, i) => (
                <Reveal as="li" index={i} title={p.texto} key={p.titulo}>
                  <i className={s.stepsC}>{i + 1}</i>
                  <b>{p.titulo}</b>
                  <em>{p.fecha}</em>
                  {p.detalle && <small>{p.detalle}</small>}
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Diplomados: inscripción directa */}
          {dips.length > 0 && (
            <div className={s.admCard}>
              <span className={s.admK}>Diplomados · sin examen</span>
              <ul className={s.dips}>
                {dips.map((p) => (
                  <li key={p.id}>
                    <a href={wa('Hola, quisiera información del ' + p.nombre)} target="_blank" rel="noopener noreferrer">
                      <b>{p.etiqueta || p.corto}</b>
                      <span>{p.proximoInicio ? 'Inicio: ' + p.proximoInicio : 'Inicio por confirmar'}</span>
                      <em className={s.dipsWa}>
                        <Icon name="wa" />
                        Consultar
                      </em>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className={cx('small', s.stepsNota)}>
          {A.nota} · <a href="#programas">Ver requisitos por programa</a>
        </p>
      </div>
    </section>
  )
}
