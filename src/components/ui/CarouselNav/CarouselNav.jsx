import { cx } from '../../../utils/cx.js'
import Icon from '../Icon/Icon.jsx'
import s from './CarouselNav.module.css'

/**
 * Flechas anterior / siguiente de un carrusel (docentes, testimonios).
 * disableAtEdges: desactiva la flecha al llegar a un extremo.
 */
export default function CarouselNav({ label, prevLabel, nextLabel, onScroll, atStart, atEnd, disableAtEdges = false, className, hidden }) {
  return (
    <div className={cx(s.carouselNav, className)} aria-label={label} hidden={hidden}>
      <button
        type="button"
        className={s.carouselBtn}
        aria-label={prevLabel}
        disabled={disableAtEdges && atStart}
        onClick={() => onScroll(-1)}
      >
        <Icon name="arrow" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button
        type="button"
        className={s.carouselBtn}
        aria-label={nextLabel}
        disabled={disableAtEdges && atEnd}
        onClick={() => onScroll(1)}
      >
        <Icon name="arrow" />
      </button>
    </div>
  )
}
