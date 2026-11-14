import { useCallback, useState } from 'react'
import { ORDEN_TIPOS, PROGS, TIPOS, porTipo } from '../../../utils/content.js'
import { useFilterTransition } from '../../../hooks/useFilterTransition.js'
import ComingSoon from '../ComingSoon/ComingSoon.jsx'
import ProgramCard, { ProgramGrid } from '../../ui/ProgramCard/ProgramCard.jsx'
import Reveal from '../../ui/Reveal/Reveal.jsx'

const OPCIONES = [['todos', 'Todos', PROGS.length], ...ORDEN_TIPOS.map((t) => [t, TIPOS[t].plural, porTipo(t).length])].filter(
  (o) => o[2],
)
const KEYS = PROGS.map((p) => p.id)

/* 3. PROGRAMAS · programas.js (catálogo con filtros por grado) */
export default function Programs() {
  const [filtro, setFiltro] = useState('todos')
  const isShown = useCallback(
    (id) => filtro === 'todos' || PROGS.find((p) => p.id === id).tipo === filtro,
    [filtro],
  )
  const fx = useFilterTransition(KEYS, isShown)

  return (
    <section className="section" id="programas">
      <div className="container">
        <Reveal className="head head--prog">
          <div>
            <p className="eyebrow">Programas de posgrado</p>
            <h2>Elige el programa que impulse tu carrera</h2>
            <p>
              Formación de excelencia en petróleo, gas natural y petroquímica, con el respaldo de 150 años de trayectoria
              de la UNI.
            </p>
          </div>
          <div className="filters" id="filters" role="tablist" aria-label="Filtrar programas">
            {OPCIONES.map(([k, label, n]) => (
              <button
                key={k}
                type="button"
                className={'chip' + (filtro === k ? ' is-on' : '')}
                role="tab"
                aria-selected={filtro === k}
                onClick={() => setFiltro(k)}
              >
                {label} <small>{n}</small>
              </button>
            ))}
          </div>
        </Reveal>

        <div id="catalogo">
          <ProgramGrid cols={Math.min(PROGS.length, 4)} all>
            {PROGS.map((p, i) => (
              <ProgramCard key={p.id} p={p} index={i} out={fx[p.id]?.out} hidden={fx[p.id]?.hidden} />
            ))}
          </ProgramGrid>
        </div>

        {/* 3b. PRÓXIMAMENTE: Escuela de Líderes + Cursos */}
        <ComingSoon />
      </div>
    </section>
  )
}
