import { Link, useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import FormLink from '../components/sections/LeadForm/FormLink.jsx'
import Icon from '../components/ui/Icon/Icon.jsx'
import JsonLd from '../components/ui/JsonLd/JsonLd.jsx'
import ProgramCard, { ProgramGrid } from '../components/ui/ProgramCard/ProgramCard.jsx'
import Reveal from '../components/ui/Reveal/Reveal.jsx'
import { useDocumentMeta } from '../hooks/useDocumentMeta.js'
import { K, PROGS, TIPOS, asset, progById, wa } from '../utils/content.js'
import { cx } from '../utils/cx.js'
import { orgGraph } from '../utils/seo.js'
import s from './ProgramPage.module.css'

const FACT_ICONS = ['clock', 'book', 'screen']

const Ticks = ({ items }) => (
  <ul className={s.ticks}>
    {items.map((x) => (
      <li key={x}>{x}</li>
    ))}
  </ul>
)

const Kv = ({ rows, price = false }) => (
  <dl className={cx(s.kv, price && s.kvPrice)}>
    {rows.map(([k, v]) => (
      <div key={k}>
        <dt>{k}</dt>
        <dd>{v}</dd>
      </div>
    ))}
  </dl>
)

/* Bloque del contenido principal (aparece al hacer scroll) */
const Block = ({ title, index, children, id }) => (
  <Reveal as="section" index={index} className={s.block} id={id}>
    <h2>{title}</h2>
    {children}
  </Reveal>
)

/* Ficha de programa: /programa/:id · datos de src/data/programas.js */
export default function ProgramPage() {
  const { id } = useParams()
  const p = progById(id) || PROGS[0]
  const tipo = TIPOS[p.tipo].singular
  const waMsg = 'Hola, quisiera información del ' + p.nombre
  useDocumentMeta(p.nombre + ' | Posgrado FIP-UNI', p.resumen || p.nombre)

  /* Otros programas: primero los del mismo grado */
  const otros = [...PROGS.filter((x) => x.id !== p.id && x.tipo === p.tipo), ...PROGS.filter((x) => x.id !== p.id && x.tipo !== p.tipo)].slice(0, 3)

  let bi = 0
  const org = orgGraph(p.id)

  return (
    <Layout solicitarHref={'/?programa=' + encodeURIComponent(p.id) + '#solicitar'} waMessage={waMsg}>
      {/* Cabecera del programa */}
      <section className={s.phero}>
        <div className={s.pheroBg} aria-hidden="true">
          <img src={asset(p.img)} alt="" />
        </div>
        <div className={cx('container', s.pheroIn)}>
          <nav className={s.crumbs} aria-label="Ruta">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <Link to="/#programas">Programas</Link>
            <span>/</span>
            <span>{tipo}</span>
          </nav>
          <span className="tag tag--hero">{tipo + (p.estado ? ' · ' + p.estado : '')}</span>
          <h1>{p.nombre}</h1>
          <ul className={s.pheroFacts}>
            {(p.facts || []).map((f, i) => (
              <li key={f}>
                <Icon name={FACT_ICONS[i % 3]} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--pt">
        <div className={cx('container', s.pdetail)}>
          <article className={s.pdetailMain} key={p.id}>
            {p.borrador && (
              <div className={s.notice}>
                <Icon name="clock" />
                <div>
                  <b>Programa en preparación</b>
                  <p>
                    Muy pronto publicaremos el plan de estudios, requisitos e inversión. Déjanos tus datos y te avisaremos
                    apenas abra la convocatoria.
                  </p>
                </div>
              </div>
            )}
            <Block title="Presentación" index={bi++}>
              <p className={s.leadP}>{p.resumen}</p>
            </Block>
            {p.perfil && (
              <Block title={p.perfilTitulo || 'Perfil del egresado'} index={bi++}>
                <Ticks items={p.perfil} />
              </Block>
            )}
            {p.plan && (
              <Block title="Plan de estudios" index={bi++}>
                <div className={cx(s.plan, p.plan.length === 4 && s.plan4)}>
                  {p.plan.map((c) => (
                    <div key={c.t}>
                      <b>{c.t}</b>
                      {c.c.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </div>
                  ))}
                </div>
                {p.planNota && <p className="small">{p.planNota}</p>}
              </Block>
            )}
            {p.modulos && (
              <Block title={p.modulosTitulo || 'Módulos'} index={bi++}>
                <ol className={s.modules}>
                  {p.modulos.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ol>
              </Block>
            )}
            {p.lineas && (
              <Block title="Líneas de investigación" index={bi++}>
                <ul className="lines">
                  {p.lineas.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </Block>
            )}
            {p.requisitos && (
              <Block title="Requisitos de admisión" index={bi++} id="requisitos">
                <Ticks items={p.requisitos} />
              </Block>
            )}
            {p.convenios && (
              <Block title="Convenios" index={bi++}>
                <div className="partners">
                  {p.convenios.map((c) => (
                    <b key={c}>{c}</b>
                  ))}
                </div>
              </Block>
            )}
          </article>

          <aside className={s.pdetailSide}>
            <div className={s.sideCard}>
              <h3>Datos del programa</h3>
              <Kv rows={p.datos || []} />
              {p.inversion && (
                <>
                  <h3>Inversión</h3>
                  <Kv rows={p.inversion} price />
                </>
              )}
              {p.inversionNota && <p className="small">{p.inversionNota}</p>}
              {/* El formulario vive solo en la portada: se enlaza con el programa preseleccionado */}
              <div className={s.sideBtns}>
                <FormLink className="btn btn--primary btn--block" progId={p.id}>
                  Solicita información
                </FormLink>
                <a className="btn btn--outline btn--block" href={wa(waMsg)} target="_blank" rel="noopener noreferrer">
                  <Icon name="wa" /> Consultar por WhatsApp
                </a>
              </div>
            </div>
            <div className={s.sideHelp}>
              <Icon name="phone" />
              <div>
                <b>¿Prefieres llamar?</b>
                <a href={'tel:' + K.telefonoLink}>{K.telefono}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Otros programas */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="head head--split">
            <div>
              <p className="eyebrow">Sigue explorando</p>
              <h2>Otros programas de posgrado</h2>
            </div>
            <p>
              <Link className="more" to="/#programas">
                Ver todos los programas <Icon name="arrow" />
              </Link>
            </p>
          </Reveal>
          <ProgramGrid cols={3} id="pOtros">
            {otros.map((x, i) => (
              <ProgramCard key={x.id} p={x} index={i} />
            ))}
          </ProgramGrid>
        </div>
      </section>
      {org && <JsonLd data={org} />}
    </Layout>
  )
}
