import { useDraw } from '../../../hooks/useInView.js'
import { useSpot } from '../../../hooks/useMediaQuery.js'
import { C, conTotal, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import s from './WhyUs.module.css'

/* 6. ¿POR QUÉ ESTUDIAR? + TRAYECTORIA · contenido.js → porQue, trayectoria */
export default function WhyUs() {
  const PQ = C.porQue || {}
  const spot = useSpot()
  const [lineRef, drawn] = useDraw()

  return (
    <section className="section" id="porque">
      <div className="container">
        <div className={s.why2}>
          <div className={s.why2Head}>
            <p className="eyebrow">¿Por qué estudiar en Posgrado FIP-UNI?</p>
            <h2 id="porqueTitulo">{PQ.titulo}</h2>
          </div>
          {/* Razones compactas: ícono + título + texto corto; enlazan a su sección */}
          <ul className={s.why2List} id="porqueGrid">
            {vis(PQ.tarjetas).map((t, i) => {
              const Tag = t.enlace ? 'a' : 'div'
              return (
                <Reveal as="li" index={i} className={spot} key={t.titulo}>
                  <Tag href={t.enlace || undefined} className={s.why2Item}>
                    <span className={s.why2Ico}>
                      <Icon name={t.icono || 'shield'} />
                    </span>
                    <span className={s.why2Txt}>
                      <b>{t.titulo}</b>
                      <span>{conTotal(t.texto)}</span>
                    </span>
                    {t.enlace && (
                      <span className={s.why2Go}>
                        <Icon name="arrow" />
                      </span>
                    )}
                  </Tag>
                </Reveal>
              )
            })}
          </ul>
        </div>

        <Reveal className={cx(s.tl, spot)} id="trayectoria">
          <span className={s.tlK}>
            Prestigio y respaldo UNI <em>· Nuestra trayectoria</em>
          </span>
          <ol ref={lineRef} className={cx(s.tlLine, drawn)} id="trayectoriaList">
            {vis(C.trayectoria).map((t) => (
              <li className={cx(t.destacado && s.isNow)} key={t.anio}>
                <b>{t.anio}</b>
                <i></i>
                <span>{t.texto}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
