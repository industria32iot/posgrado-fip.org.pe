/* Testimonios publicables: solo real: true con nombre y texto.
   Con modoEjemplo (solo para el boceto) se muestran los de ejemplo con etiqueta "Ejemplo". */
import { C, vis } from './content.js'

const TE = C.testimonios
const grupoProg = (t) => {
  const p = String(t.programa || '').toLowerCase()
  return /doctor/.test(p) ? 'doc' : /maestr/.test(p) ? 'mae' : /diplom/.test(p) ? 'dip' : 'otro'
}
const porFecha = (a, b) => (parseInt(b.anio, 10) || 0) - (parseInt(a.anio, 10) || 0)
/* reparte por programa: doc, mae, dip, doc, mae… */
const intercalar = (arr) => {
  const g = {}
  const orden = ['doc', 'mae', 'dip', 'otro']
  const out = []
  arr.forEach((t) => (g[grupoProg(t)] = g[grupoProg(t)] || []).push(t))
  let quedan = true
  while (quedan) {
    quedan = false
    orden.forEach((k) => {
      if (g[k]?.length) {
        out.push(g[k].shift())
        quedan = true
      }
    })
  }
  return out
}

let reales = TE ? vis(TE.lista).filter((t) => t.real === true && String(t.nombre || '').trim() && String(t.texto || '').trim()) : []
export const MODO_EJEMPLO = !!(TE && TE.modoEjemplo) && reales.length < 2
if (MODO_EJEMPLO) {
  reales = vis(TE.lista)
    .filter((t) => String(t.texto || '').trim())
    .map((t) =>
      t.real === true
        ? t
        : { ejemplo: true, nombre: 'Nombre del egresado', programa: t.programa, anio: t.anio, cargo: t.cargo, empresa: t.empresa, texto: t.texto },
    )
  console.warn('Testimonios en MODO EJEMPLO: poner testimonios.modoEjemplo = false antes de publicar.')
}

/* ORDEN: 1) destacados, 2) más recientes (anio), 3) intercalando programas */
const maxT = TE && +TE.maximo > 0 ? +TE.maximo : 9
export const TESTIMONIOS =
  reales.length >= 2
    ? reales
        .filter((t) => t.destacado === true)
        .sort(porFecha)
        .concat(intercalar(reales.filter((t) => t.destacado !== true).sort(porFecha)))
        .slice(0, maxT)
    : []
