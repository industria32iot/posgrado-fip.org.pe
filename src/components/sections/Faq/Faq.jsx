import { useState } from 'react'
import { C, textoModalidades, vis, wa } from '../../../utils/content.js'
import Icon from '../../ui/Icon/Icon.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'
import FormLink from '../LeadForm/FormLink.jsx'
import s from './Faq.module.css'

const TEMAS = { admision: 'Admisión', programas: 'Programas', inversion: 'Inversión' }

/* {modalidades} se reemplaza por la modalidad de cada programa */
// oxlint-disable-next-line react/only-export-components
export const FAQS = vis(C.faq).map((f) =>
  (f.respuesta || '').includes('{modalidades}') ? { ...f, respuesta: f.respuesta.replace(/\{modalidades\}/g, textoModalidades()) } : f,
)

/* 12. PREGUNTAS FRECUENTES + CIERRE · contenido.js → faq, faqCierre */
export default function Faq() {
  const [tema, setTema] = useState('')
  const [abierta, setAbierta] = useState(null) // una sola pregunta abierta a la vez
  const temasUsados = Object.keys(TEMAS).filter((k) => FAQS.some((f) => f.tema === k))
  /* Filtros solo con 10 preguntas o más (con menos, se leen de un vistazo) */
  const conFiltros = FAQS.length >= 10 && temasUsados.length > 1
  const FC = C.faqCierre

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className={s.faqLayout}>
          <div className={s.faqTop}>
            <div>
              <p className="eyebrow">Preguntas frecuentes</p>
              <h2>Resolvemos tus dudas</h2>
            </div>
            <div className={'filters ' + s.faqFilters} id="faqFiltros" role="tablist" aria-label="Filtrar preguntas" hidden={!conFiltros}>
              {conFiltros &&
                [['', 'Todas'], ...temasUsados.map((k) => [k, TEMAS[k]])].map(([k, label]) => (
                  <button
                    key={k || 'todas'}
                    type="button"
                    className={'chip' + (tema === k ? ' is-on' : '')}
                    role="tab"
                    aria-selected={tema === k}
                    onClick={() => setTema(k)}
                  >
                    {label}
                  </button>
                ))}
            </div>
          </div>

          <div className={s.faq} id="faqList">
            {FAQS.map((f, i) => (
              <Reveal
                as="details"
                index={i}
                key={f.pregunta}
                data-tema={f.tema || ''}
                hidden={!!tema && f.tema !== tema}
                open={abierta === i}
                onToggle={(e) => {
                  if (e.currentTarget.open) setAbierta(i)
                  else if (abierta === i) setAbierta(null)
                }}
              >
                <summary>
                  {f.pregunta}
                  <Icon name="chev" />
                </summary>
                <p>{f.respuesta}</p>
              </Reveal>
            ))}
          </div>

          {FC && (
            <div className={s.faqHelp} id="faqCierre">
              <p className={s.faqHelpT}>
                <b>{FC.titulo}</b> {FC.texto || ''}
              </p>
              <div className={s.faqHelpBtns}>
                <a
                  className="btn btn--primary btn--sm"
                  href={wa('Hola, quisiera hablar con un asesor académico de posgrado FIP-UNI')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="wa" /> WhatsApp
                </a>
                <FormLink className="more" modal>
                  Solicita información <Icon name="arrow" />
                </FormLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
