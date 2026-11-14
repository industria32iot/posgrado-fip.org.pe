import { useSpot } from '../../../hooks/useMediaQuery.js'
import { C, DIA, MES, TIPOS, asset, parseF, progById, vis } from '../../../utils/content.js'
import { cx } from '../../../utils/cx.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import FormLink from '../LeadForm/FormLink.jsx'
import s from './Agenda.module.css'

const hora12 = (h) => {
  const [hh, mm] = h.split(':')
  const H = +hh
  return ((H % 12) || 12) + ':' + mm + (H < 12 ? ' a. m.' : ' p. m.')
}

/* Enlace "Agregar a mi calendario" (Google Calendar). Lima = UTC-5 */
const gcal = (ses, p) => {
  const d = parseF(ses.fecha)
  const hm = ses.hora.split(':')
  const ini = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), +hm[0] + 5, +hm[1]))
  const fin = new Date(ini.getTime() + (ses.duracion || 45) * 60000)
  const z = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    encodeURIComponent('Charla informativa: ' + (p ? p.corto : '') + ' – Posgrado FIP-UNI') +
    '&dates=' + z(ini) + '/' + z(fin) +
    '&details=' + encodeURIComponent('Charla gratuita por Google Meet.' + (ses.enlaceMeet ? ' Enlace: ' + ses.enlaceMeet : ' El enlace se enviará por correo y WhatsApp.')) +
    '&location=' + encodeURIComponent(ses.enlaceMeet || 'Google Meet')
  )
}

const ext = { target: '_blank', rel: 'noopener noreferrer' }

/* ---------- Charlas (Google Meet) · contenido.js → charlas ---------- */
/* Las charlas con fecha pasada se ocultan solas. Se muestran hasta 3. */
const hoy = new Date()
hoy.setHours(0, 0, 0, 0)
const sesAll = vis(C.charlas?.sesiones)
  .filter((x) => parseF(x.fecha) >= hoy)
  .sort((a, b) => String(a.fecha + a.hora).localeCompare(String(b.fecha + b.hora)))

function Charlas() {
  const CH = C.charlas
  const spot = useSpot()
  if (!CH) return null

  const ses = sesAll.slice(0, 3)

  /* Título automático según el tipo de programa de las sesiones */
  const tiposSes = [...new Set(sesAll.map((x) => progById(x.programa)?.tipo).filter(Boolean))]
  const titulo =
    CH.titulo || (tiposSes.length === 1 ? 'Próximas charlas: ' + TIPOS[tiposSes[0]].plural.toLowerCase() : 'Próximas charlas por Google Meet')
  const form = CH.formularioInscripcion

  return (
    <div id="agendaCharlas">
      <h3 className={s.agendaSub}>{titulo}</h3>
      {CH.texto && <p className={s.agendaLead}>{CH.texto}</p>}
      <div className={s.sessions}>
        {ses.length ? (
          ses.map((x, i) => {
            const p = progById(x.programa)
            const d = parseF(x.fecha)
            const pend = x.confirmada === false
            const horas = p ? String((p.facts || [''])[0]).split('·')[0].trim() : '' /* solo las horas: "384 horas" */
            return (
              <Reveal as="article" index={i} className={cx(s.session, spot)} key={x.fecha + x.hora}>
                <div className={s.sessionDate}>
                  <span>{DIA[d.getDay()]}</span>
                  <b>{d.getDate()}</b>
                  <span>{MES[d.getMonth()]}</span>
                </div>
                <div className={s.sessionBody}>
                  <span className="cat">
                    {p ? TIPOS[p.tipo].singular + (horas ? ' · ' + horas : '') : ''}
                    {pend && <> <em className={s.sessionPend}>Por confirmar</em></>}
                  </span>
                  <h3>{p ? p.corto : x.programa}</h3>
                  <ul className={s.sessionMeta}>
                    <li>
                      <Icon name="clock" />
                      {hora12(x.hora)} (hora de Lima) · {x.duracion || 45} min
                    </li>
                    <li>
                      <Icon name="video" />
                      Google Meet
                    </li>
                  </ul>
                  <div className={s.sessionActions}>
                    {pend ? (
                      <FormLink className="btn btn--primary" tipo="Charla informativa" progId={x.programa}>
                        Avísame
                      </FormLink>
                    ) : (
                      <>
                        {form ? (
                          <a className="btn btn--primary" href={form} {...ext}>
                            Inscribirme
                          </a>
                        ) : (
                          <FormLink className="btn btn--primary" tipo="Charla informativa" progId={x.programa}>
                            Reservar mi lugar
                          </FormLink>
                        )}
                        <a className="btn btn--outline" href={gcal(x, p)} {...ext}>
                          Agregar a mi calendario
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })
        ) : (
          <Reveal as="article" className={cx(s.session, s.sessionEmpty, spot)}>
            <div className={s.sessionBody}>
              <h3>Muy pronto anunciaremos nuevas fechas</h3>
              <p>Déjanos tus datos y te avisaremos de la próxima charla.</p>
              <FormLink className="btn btn--primary" tipo="Charla informativa">
                Avísame
              </FormLink>
            </div>
          </Reveal>
        )}
      </div>
      {sesAll.length > 3 &&
        (form ? (
          <a className={cx('more', s.agendaMore)} href={form} {...ext}>
            Ver más fechas <Icon name="arrow" />
          </a>
        ) : (
          <FormLink className={cx('more', s.agendaMore)} tipo="Charla informativa">
            Ver más fechas <Icon name="arrow" />
          </FormLink>
        ))}
      {CH.temas?.length > 0 && (
        <ul className={s.agendaTopics}>
          {CH.temas.map((t) => (
            <li key={t}>
              <Icon name="check" />
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- Noticias · contenido.js → noticias ----------
   Orden por ámbito (posgrado → facultad → estudiantes) y luego fecha.
   Como máximo 1 noticia estudiantil; se muestran 4. */
const ORD = { posgrado: 0, facultad: 1, estudiantes: 2 }
const fFecha = (f) => {
  const d = parseF(f)
  return d.getDate() + ' ' + MES[d.getMonth()] + ' ' + d.getFullYear()
}

let nEst = 0
const NEWS = vis(C.noticias)
  .slice()
  .sort((a, b) => {
    const oa = a.ambito in ORD ? ORD[a.ambito] : 9
    const ob = b.ambito in ORD ? ORD[b.ambito] : 9
    return oa - ob || String(b.fecha).localeCompare(String(a.fecha))
  })
  .filter((n) => (n.ambito === 'estudiantes' ? ++nEst <= 1 : true))
  .slice(0, 4)

function Meta({ n }) {
  return (
    <span className="cat">
      {n.categoria}
      {n.fecha && (
        <>
          {' · '}
          <time dateTime={n.fecha}>{fFecha(n.fecha)}</time>
        </>
      )}
    </span>
  )
}

function Noticias() {
  const spot = useSpot()
  const [first, ...rest] = NEWS

  return (
    <div id="agendaNoticias">
      <h3 className={s.agendaSub}>Noticias</h3>
      {first && (
        <Reveal
          as={first.enlace ? 'a' : 'article'}
          className={cx(s.nw, s.nwMain, spot)}
          {...(first.enlace ? { href: first.enlace, ...ext } : {})}
        >
          {first.foto && <img src={asset(first.foto)} alt="" loading="lazy" width="1200" height="750" />}
          <div className={s.nwBody}>
            <Meta n={first} />
            <h4>{first.titulo}</h4>
            {first.resumen && <p>{first.resumen}</p>}
          </div>
        </Reveal>
      )}
      {rest.length > 0 && (
        <ul className={s.nwList}>
          {rest.map((n, i) => {
            const Tag = n.enlace ? 'a' : 'div'
            return (
              <Reveal as="li" index={i} key={n.titulo}>
                <Tag className={s.nwRow} {...(n.enlace ? { href: n.enlace, ...ext } : {})}>
                  <Meta n={n} />
                  <b>{n.titulo}</b>
                </Tag>
              </Reveal>
            )
          })}
        </ul>
      )}
      {C.noticiasMasEnlace && (
        <a className={cx('more', s.agendaMore)} href={C.noticiasMasEnlace} {...ext}>
          Ver todas las noticias <Icon name="arrow" />
        </a>
      )}
    </div>
  )
}

/* 9–10. AGENDA: charlas (izquierda) + noticias (derecha) · contenido.js → agenda */
export default function Agenda() {
  const AG = C.agenda || {}
  return (
    <section className={cx('section', s.agenda)} id="agenda">
      <div className="container">
        <Reveal className={cx('head', s.agendaHead)}>
          <p className="eyebrow" id="agendaEtiqueta">
            {AG.etiqueta || 'Agenda y actualidad'}
          </p>
          <h2 id="agendaTitulo">{AG.titulo || 'Lo que viene en el Posgrado FIP-UNI'}</h2>
        </Reveal>
        <div className={s.agendaGrid}>
          <div>
            <span id="charla" className="anchor"></span>
            <Charlas />
          </div>
          <div>
            <span id="noticias" className="anchor"></span>
            <Noticias />
          </div>
        </div>
      </div>
    </section>
  )
}
