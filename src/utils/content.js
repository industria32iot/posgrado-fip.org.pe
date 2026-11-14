/* Datos derivados de contenido.js y programas.js.
   Reúne la lógica que antes estaba repartida en main.js y secciones.js. */
import { CONTENIDO as C } from '../data/contenido.js'
import { PROGRAMAS, TIPOS } from '../data/programas.js'

export { C, TIPOS }

/* Elementos visibles (visible: false los oculta sin borrarlos) */
export const vis = (arr) => (arr || []).filter((x) => x && x.visible !== false)

/* Rutas de imágenes de los datos ("assets/x.jpg") → public/assets/x.jpg,
   respetando la base del despliegue (vite.config.js → base) */
export const asset = (path) => {
  if (!path || /^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}

/* ---------- Contacto y WhatsApp ---------- */
export const K = C.contacto || {}
export const wa = (txt) => 'https://wa.me/' + (K.whatsapp || '51998028384') + (txt ? '?text=' + encodeURIComponent(txt) : '')

/* ---------- Fechas ---------- */
export const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic']
export const DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const parseF = (f) => {
  const p = String(f).split('-')
  return new Date(+p[0], +p[1] - 1, +p[2])
}

/* ---------- Programas ---------- */
export const ORDEN_TIPOS = ['doctorado', 'maestria', 'diplomado']
export const PROGS = PROGRAMAS.slice().sort(
  (a, b) => ORDEN_TIPOS.indexOf(a.tipo) - ORDEN_TIPOS.indexOf(b.tipo) || (a.orden || 99) - (b.orden || 99),
)
export const porTipo = (t) => PROGS.filter((p) => p.tipo === t)
export const progById = (id) => PROGS.find((p) => p.id === id)
export const programUrl = (p) => '/programa/' + encodeURIComponent(p.id)

/* Nombre corto: Doctorado / Maestría / Diplomado en <etiqueta> */
export const nombreCorto = (p) =>
  p.tipo === 'diplomado'
    ? 'Diplomado en ' + String(p.etiqueta || p.corto).replace(/^Diplomado en /, '')
    : TIPOS[p.tipo].singular

/* ---------- Investigación ---------- */
const INV = C.investigacion || {}
const lineasTesis = (INV.lineas || []).reduce((s, l) => s + (l && +l.tesis > 0 ? +l.tesis : 0), 0)
/* Total de tesis: una sola fuente (investigacion.totalTesis). Si no existe, se usa la suma de las líneas. */
export const TOTAL_TESIS = +INV.totalTesis > 0 ? +INV.totalTesis : lineasTesis
export const conTotal = (s) => String(s == null ? '' : s).replace(/\{totalTesis\}/g, TOTAL_TESIS)
export const lineasObj = (INV.lineas || []).map((l) => (typeof l === 'string' ? { nombre: l } : l || {}))

if (import.meta.env.DEV && lineasTesis !== TOTAL_TESIS) {
  console.warn(`Tesis: las líneas suman ${lineasTesis} y el total es ${TOTAL_TESIS}. Faltan clasificar ${TOTAL_TESIS - lineasTesis}.`)
}

/* Números automáticos de cifras e indicadores */
export const AUTO = {
  programas: () => vis(PROGRAMAS).filter((p) => !p.borrador).length,
  totalTesis: () => TOTAL_TESIS,
  laboratorios: () => vis(INV.laboratorios).length,
  lineas: () => lineasObj.filter((o) => o.nombre && o.visible !== false).length,
}

/* {modalidades} de las preguntas frecuentes: datos → "Modalidad" de cada programa */
export const textoModalidades = () =>
  PROGRAMAS.filter((p) => !p.borrador)
    .map((p) => {
      const m = (p.datos || []).find((d) => /modalidad/i.test(d[0]))
      if (!m) return ''
      const val = String(m[1]).replace(/\.$/, '')
      return nombreCorto(p) + ': ' + val.charAt(0).toLowerCase() + val.slice(1)
    })
    .filter(Boolean)
    .join('. ') + '.'

/* "a, b y c" con la primera letra en mayúscula */
export const listaTexto = (arr) => {
  const a = arr.map((x) => x.toLowerCase())
  const s = a.length > 1 ? a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] : a.join('')
  return s.replace(/^./, (c) => c.toUpperCase())
}

/* Iniciales de un nombre (omite títulos como Dr., MSc.) */
export const inicialesDocente = (n) => {
  const w = String(n)
    .replace(/^(Dr\.|Dra\.|MSc\.|Mg\.|Ing\.|PhD\.?)\s*/i, '')
    .split(/\s+/)
    .filter((x) => x.replace('.', '').length > 1)
  const b = w.length >= 4 ? w[2] : w[1]
  return ((w[0] || '')[0] || '') + ((b || '')[0] || '')
}

export const isExternal = (u) => /^https?:/i.test(u || '')
