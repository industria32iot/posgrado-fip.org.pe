import { K } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import s from './Visit.module.css'

/* 14. VISÍTANOS · contenido.js → contacto
   Franja compacta sin mapa incrustado: "Cómo llegar" abre Google Maps. */
export default function Visit() {
  const maps = K.mapsEnlace || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(K.direccion || '')
  return (
    <section className={cx(s.visit, s.visitStrip)} id="visitanos" aria-labelledby="visitTitulo">
      <div className={cx('container', s.visitBar)} id="visitCard">
        <div className={s.visitId}>
          <p className="eyebrow">Visítanos</p>
          <h2 className="sub-h3" id="visitTitulo">
            Unidad de Posgrado FIP-UNI
          </h2>
        </div>
        <ul className={s.visitList}>
          <li>
            <Icon name="pin" />
            <span>
              <b>{K.direccion}</b>
              {K.referencia || ''}
              {K.comoLlegar ? ' · ' + K.comoLlegar : ''}
            </span>
          </li>
          {K.horario && (
            <li>
              <Icon name="clock" />
              <span>
                <b>Horario de atención</b>
                {K.horario}
              </span>
            </li>
          )}
        </ul>
        <div className={s.visitBtns}>
          <a className="btn btn--primary" href={maps} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" /> Cómo llegar
          </a>
          {K.telefonoLink && (
            <a className="btn btn--outline" href={'tel:' + K.telefonoLink}>
              <Icon name="phone" /> Llamar
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
