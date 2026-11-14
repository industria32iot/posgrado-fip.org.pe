import { Link } from 'react-router-dom'
import logo from '../../../assets/logo-uni.png'
import logoBlanco from '../../../assets/logo-uni-blanco.png'
import { cx } from '../../../utils/cx.js'
import s from './Brand.module.css'

/**
 * Escudo UNI + nombre institucional.
 * variant: "header" (cabecera), "light" (pie, sobre fondo oscuro) o "plain".
 * compact: logo más pequeño cuando la cabecera se compacta al hacer scroll.
 */
export default function Brand({ variant = 'plain', compact = false, to = '/' }) {
  const light = variant === 'light'
  return (
    <Link
      className={cx(s.brand, variant === 'header' && s.brandHeader, compact && s.brandCompact, light && s.brandLight)}
      to={to}
      aria-label={variant === 'header' ? 'Posgrado FIP-UNI, inicio' : undefined}
    >
      <img
        src={light ? logoBlanco : logo}
        alt="Escudo de la Universidad Nacional de Ingeniería"
        width={light ? 40 : 44}
        height={light ? 48 : 53}
      />
      <span className={s.brandTxt}>
        <strong>Universidad Nacional de Ingeniería</strong>
        {light ? (
          <span>Unidad de Posgrado FIP</span>
        ) : (
          <span>
            Facultad de Ingeniería de Petróleo,
            <br />
            Gas Natural y Petroquímica
          </span>
        )}
      </span>
    </Link>
  )
}
