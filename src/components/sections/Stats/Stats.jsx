import { useCountUp } from '../../../hooks/useCountUp.js'
import { AUTO, C, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import s from './Stats.module.css'

/* Cifras con referencial: true no se publican; auto: el número se calcula de los datos.
   Una cifra automática en 0 no se muestra. */
const cifras = vis(C.cifras)
  .filter((c) => {
    if (c.referencial && import.meta.env.DEV) console.info('Cifra oculta por ser referencial: ' + (c.texto || ''))
    return !c.referencial
  })
  .map((c) => (c.auto && AUTO[c.auto] ? { ...c, numero: AUTO[c.auto]() } : c))
  .filter((c) => +c.numero > 0)

function Stat({ c }) {
  const [ref, text] = useCountUp(+c.numero, c.prefijo || '', c.sufijo || '')
  return (
    <div className={s.stat}>
      <Icon name={c.icono || 'award'} />
      <b ref={ref}>{text}</b>
      <span>{c.texto}</span>
    </div>
  )
}

/* 2. CIFRAS · contenido.js → cifras */
export default function Stats() {
  return (
    <section className={s.stats} aria-label="Indicadores">
      <div
        className={cx('container', s.statsGrid, cifras.length <= 3 && s.statsGridPocas)}
        id="cifras"
        style={{ '--n': cifras.length }}
      >
        {cifras.map((c) => (
          <Stat c={c} key={c.texto} />
        ))}
      </div>
    </section>
  )
}
