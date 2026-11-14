import { Fragment, useState } from 'react'
import { useCountUp } from '../../../hooks/useCountUp.js'
import { useSpot } from '../../../hooks/useMediaQuery.js'
import { AUTO, C, TOTAL_TESIS, asset, conTotal, isExternal, lineasObj, parseF, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import s from './Research.module.css'

const R = C.investigacion || {}
const CE = R.campoEscuela
const CEL = R.campoEscuelaLab /* si el campo escuela va en Laboratorios, no se repite junto a los convenios */
const pad = (n) => (n < 10 ? '0' : '') + n

/* ---------- Líneas de investigación (lista numerada) ----------
   Con menos tesis que "minimoTesisVisible" se muestra solo "Ver tesis →". */
function Lineas() {
  const minT = +R.minimoTesisVisible > 0 ? +R.minimoTesisVisible : 2
  return (
    <ul className="lines lines--list" id="invLineas">
      {lineasObj.map((o, i) => {
        const muchas = +o.tesis >= minT
        let badge = null
        if (o.enlace) {
          badge = (
            <em className="lines__tesis">
              {muchas ? o.tesis + ' tesis' : 'Ver tesis'} <Icon name="arrow" />
            </em>
          )
        } else if (muchas) badge = <em className="lines__tesis">{o.tesis} tesis</em>
        return (
          <li id={'linea-' + pad(i + 1)} key={o.nombre}>
            {o.enlace ? (
              <a className="lines__a" href={o.enlace} target="_blank" rel="noopener noreferrer" title="Ver tesis en el Repositorio UNI">
                <span className="lines__n">{o.nombre}</span>
                {badge}
              </a>
            ) : (
              <>
                <span className="lines__n">{o.nombre}</span>
                {badge}
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Foto opcional (personas o campo escuela) ---------- */
function ResearchPhoto() {
  const useField = !!(CE && CE.visible && CE.foto && !(CEL && CEL.visible))
  const [fieldFailed, setFieldFailed] = useState(false)
  const [failed, setFailed] = useState(false)

  let src = R.fotoPersonas
  let alt = R.fotoPersonasAlt || ''
  const field = useField && !fieldFailed
  if (field) {
    src = CE.foto
    alt = CE.fotoAlt || R.fotoAlt || CE.titulo || ''
  } else if (useField && fieldFailed) {
    /* si la foto del campo escuela no carga, vuelve a la foto de respaldo */
    src = R.foto
    alt = R.fotoAlt || ''
  }
  if (!src || failed) return null

  return (
    <Reveal className={cx(s.researchImg, s.invPeople, field && s.fieldCard)}>
      <img src={asset(src)} alt={alt} loading="lazy" onError={() => (field ? setFieldFailed(true) : setFailed(true))} />
      {field && (
        <div className={s.fieldCardOv}>
          <span className={s.fieldCardK}>Campo escuela</span>
          <h3>{CE.titulo}</h3>
          {CE.texto && <p>{CE.texto}</p>}
          {CE.enlace && (
            <a className="more" href={CE.enlace} target="_blank" rel="noopener noreferrer">
              Conocer más <Icon name="arrow" />
            </a>
          )}
        </div>
      )}
    </Reveal>
  )
}

/* ---------- Convenios: { nacionales: [], internacionales: [] } o una lista ----------
   El detalle solo se muestra si confirmado es true. */
function Convenios() {
  const norm = (arr) =>
    (arr || []).map((c) => (typeof c === 'string' ? { nombre: c } : c || {})).filter((c) => c.nombre && c.visible !== false)
  const CV = R.convenios || []
  const grupos = (
    Array.isArray(CV)
      ? [{ k: 'Internacionales', l: norm(CV) }]
      : [
          { k: 'Nacionales', l: norm(CV.nacionales) },
          { k: 'Internacionales', l: norm(CV.internacionales) },
        ]
  ).filter((g) => g.l.length)

  return (
    <div className={cx('partners', s.agreementsStrip)} id="convenios">
      {grupos.length > 0 && (
        <>
          <p className="eyebrow">Alianzas</p>
          <h3 className="sub-h3">{grupos.length > 1 ? 'Convenios' : 'Convenios ' + grupos[0].k.toLowerCase()}</h3>
          {grupos.map((g) => (
            <Fragment key={g.k}>
              {grupos.length > 1 && <em className={s.agreementsG}>{g.k}</em>}
              <ul className={s.agreements}>
                {g.l.map((c) => (
                  <li key={c.nombre}>
                    {c.logo ? <img src={asset(c.logo)} alt={c.nombre} loading="lazy" /> : <b>{c.nombre}</b>}
                    <span className={s.agreementsInfo}>
                      {c.pais && <small>{c.pais}</small>}
                      {c.confirmado === true && c.detalle && <p>{c.detalle}</p>}
                    </span>
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </>
      )}
    </div>
  )
}

/* ---------- Resultados: indicadores + panel de tesis ---------- */
/* "Tesis recientes" si la más reciente tiene menos de 12 meses; si no, "Tesis destacadas" */
const tr = vis(R.tesisRecientes)
const fechaTesis = (t) => {
  if (t.fecha) {
    const d = parseF(t.fecha)
    if (!isNaN(d)) return d
  }
  const y = parseInt(t.anio, 10)
  return y ? new Date(y, 11, 31) : null
}
const masReciente = tr.reduce((m, t) => {
  const d = fechaTesis(t)
  return d && (!m || d > m) ? d : m
}, null)
const reciente = !!masReciente && (new Date() - masReciente) / (1000 * 60 * 60 * 24 * 30.44) <= 12

function Kpi({ k, n, main }) {
  const [ref, text] = useCountUp(n, k.prefijo || '', k.sufijo || '')
  return (
    <div className={cx(s.kpi, main && s.kpiMain)}>
      <b ref={ref}>{text}</b>
      <span className={s.kpiT}>{k.texto}</span>
      <span className={s.kpiD}>{k.detalle || ''}</span>
      {k.enlace && (
        <a className="more" href={k.enlace} {...(isExternal(k.enlace) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {k.enlaceTexto || 'Ver más'} <Icon name="arrow" />
        </a>
      )}
    </div>
  )
}

function Resultados() {
  /* Los referenciales no se publican; "auto" calcula el número; el de tesis va primero */
  const ind = vis(R.indicadores)
    .filter((k) => {
      if (k.referencial && import.meta.env.DEV) console.info('Indicador oculto por ser referencial: ' + (k.texto || ''))
      return !k.referencial
    })
    .map((k) => ({ k, n: k.auto && AUTO[k.auto] ? AUTO[k.auto]() : +k.numero || 0, main: k.auto === 'totalTesis' }))
    .sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0))
  const enlaceTesis = ind.find((x) => x.main)?.k.enlace || ''

  const tituloPanel = R.tituloTesis || (reciente ? 'Tesis recientes' : 'Tesis destacadas')

  if (!ind.length && !tr.length) return null
  return (
    <>
      <p className="eyebrow">Impacto</p>
      <h3 className="sub-h3">Resultados de investigación</h3>
      <div className={s.resultsGrid}>
        {ind.length > 0 && (
          <div className={cx(s.resultsKpis, s['resultsKpisN' + Math.min(ind.length, 4)])}>
            {ind.map((x) => (
              <Kpi key={x.k.texto} {...x} />
            ))}
          </div>
        )}
        {tr.length > 0 && (
          <div className={cx(s.theses, !reciente && s.thesesOld)}>
            <span className={s.thesesK}>{tituloPanel}</span>
            <ul>
              {tr.map((t) => (
                <li key={t.enlace || t.titulo}>
                  <a href={t.enlace} target="_blank" rel="noopener noreferrer">
                    {reciente ? (
                      <>
                        <em>{t.anio}</em>
                        <b>{t.titulo}</b>
                        <span>{t.autor}</span>
                      </>
                    ) : (
                      <>
                        <b>{t.titulo}</b>
                        <span>
                          {t.autor}
                          {t.anio ? ' · ' + t.anio : ''}
                        </span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            {enlaceTesis && (
              <a className={s.thesesAll} href={enlaceTesis} target="_blank" rel="noopener noreferrer">
                Ver las {TOTAL_TESIS} tesis en el Repositorio UNI <Icon name="arrow" />
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}

/* ---------- Laboratorios ---------- */
/* Foto con respaldo al ícono si no carga */
function LabMedia({ foto, icono, alt }) {
  const [failed, setFailed] = useState(false)
  const showImg = foto && !failed
  return (
    <>
      {showImg && (
        <img className={s.labImg} src={asset(foto)} alt={alt} loading="lazy" width="1200" height="750" onError={() => setFailed(true)} />
      )}
      <span className={s.labIco} hidden={showImg}>
        <Icon name={icono || 'flask'} />
      </span>
    </>
  )
}

function Laboratorios() {
  const spot = useSpot()
  const labs = vis(R.laboratorios)
  const nLin = lineasObj.length
  const feat = CEL && CEL.visible && CE ? CE : null

  /* Columnas sin huecos: escritorio 4 columnas (la destacada ocupa 2, 3 o 4 según cuántos labs haya);
     tablet 2 columnas (la destacada ocupa la fila; si quedan impares, el último ocupa 2) */
  const n = labs.length
  let s4 = 2
  if (feat) s4 = [2, 3, 4].find((x) => (x + n) % 4 === 0) || 2
  const rest4 = ((feat ? s4 : 0) + n) % 4
  const last4 = rest4 ? 4 - rest4 + 1 : 1
  const last2 = n % 2 ? 2 : 1

  const tags = (arr) => {
    const list = (arr || []).filter((x) => +x >= 1)
    if (!list.length) return null
    return (
      <ul className={s.labTags}>
        {list.map((x) => {
          const nn = pad(+x)
          return (
            <li key={x}>
              <a href={+x <= nLin ? '#linea-' + nn : '#investigacion'}>Línea {nn}</a>
            </li>
          )
        })}
      </ul>
    )
  }

  const offset = feat ? 1 : 0
  return (
    <ul className={s.labsGrid} id="labsList">
      {feat && (
        <Reveal as="li" index={0} className={cx(s.lab, s.labFeature, spot)} style={{ '--s4': s4 }}>
          <LabMedia foto={feat.foto} icono={CEL.icono || 'field'} alt={feat.fotoAlt || feat.titulo} />
          <span className={s.labK}>Campo escuela</span>
          <b>{feat.titulo}</b>
          {feat.texto && <span className={s.labD}>{feat.texto}</span>}
        </Reveal>
      )}
      {labs.map((l, i) => {
        const isLast = i === n - 1
        return (
          <Reveal
            as="li"
            index={offset + i}
            key={l.nombre}
            className={cx(s.lab, isLast && s.labLast, spot)}
            style={isLast ? { '--l4': last4, '--l2': last2 } : undefined}
          >
            <LabMedia foto={l.foto} icono={l.icono} alt={l.nombre} />
            <b>{l.nombre}</b>
            {l.detalle && <span className={s.labD}>{l.detalle}</span>}
            {l.equipos && <span className={s.labEq}>Equipos: {l.equipos}</span>}
            {tags(l.lineas)}
          </Reveal>
        )
      })}
    </ul>
  )
}

/* 8. INVESTIGACIÓN · contenido.js → investigacion */
export default function Research() {
  return (
    <section className="section" id="investigacion">
      <div className="container">
        {/* Encabezado: título a la izquierda, subtítulo a la derecha */}
        <Reveal className={cx('head head--split', s.invHead)}>
          <div>
            <p className="eyebrow">Investigación e innovación</p>
            <h2 id="invTitulo">{R.titulo}</h2>
          </div>
          <p id="invTexto">{conTotal(R.texto)}</p>
        </Reveal>
        <Lineas />
        <ResearchPhoto />
        <Convenios />
      </div>
      {/* Resultados: franja crema */}
      <div className={cx(s.band, s.bandCrema)}>
        <div className={cx('container', s.results)} id="invResultados">
          <Resultados />
        </div>
      </div>
      {/* Laboratorios: franja blanca; campo escuela destacado */}
      <div className={cx(s.band, s.bandLabs)}>
        <div className={cx('container', s.labs)} id="laboratorios">
          <div className={s.labsHead}>
            <p className="eyebrow">Infraestructura</p>
            <h3>Laboratorios especializados</h3>
            <p id="labsTexto">{R.labsTexto || ''}</p>
          </div>
          <Laboratorios />
        </div>
      </div>
    </section>
  )
}
