import { Link } from 'react-router-dom'
import { useSpot } from '../../../hooks/useMediaQuery.js'
import { TIPOS, asset, programUrl } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../Icon/Icon.jsx'
import Reveal from '../Reveal/Reveal.jsx'
import s from './ProgramCard.module.css'

const FACT_ICONS = ['clock', 'book', 'screen']

/* Tarjeta de programa (portada y "Otros programas" de la ficha) */
export default function ProgramCard({ p, index = 0, wide = false, out = false, hidden = false }) {
  const spot = useSpot()
  const url = programUrl(p)
  const resumen =
    wide && p.resumen && !p.borrador
      ? p.resumen.length > 170
        ? p.resumen.slice(0, p.resumen.lastIndexOf(' ', 168)) + '…'
        : p.resumen
      : null

  return (
    <Reveal
      as="article"
      index={index}
      className={cx(s.prog, wide && s.progWide, p.borrador && s.isDraft, out && s.isOut, spot)}
      hidden={hidden}
      data-type={p.tipo}
    >
      <Link className={s.progImg} to={url} tabIndex={-1} aria-hidden="true">
        <img src={asset(p.img)} alt="" loading="lazy" width="1200" height="750" />
        <span className="tag">{TIPOS[p.tipo].singular}</span>
        {p.estado && <span className={s.state}>{p.estado}</span>}
      </Link>
      <div className={s.progBody}>
        <h3>
          <Link to={url}>{p.corto}</Link>
        </h3>
        {resumen && <p className={s.progSum}>{resumen}</p>}
        <ul className={s.facts}>
          {(p.facts || []).map((f, i) => (
            <li key={f}>
              <Icon name={FACT_ICONS[i % 3]} />
              {f}
            </li>
          ))}
          {p.requisito && (
            <li className={s.factsReq}>
              <Icon name="cap" />
              <span>
                Requisito: <b>{p.requisito}</b>
              </span>
            </li>
          )}
        </ul>
        <Link className="more" to={url}>
          {p.borrador ? 'Ver avance' : 'Ver programa completo'} <Icon name="arrow" />
        </Link>
      </div>
    </Reveal>
  )
}

/* Cuadrícula de tarjetas. cols: 1–4 columnas; all: catálogo completo de la portada */
export function ProgramGrid({ cols, all = false, className, children, ...rest }) {
  return (
    <div className={cx(s.pgrid, s['pgrid' + cols], all && s.pgridAll, className)} {...rest}>
      {children}
    </div>
  )
}
