/* Datos estructurados: la Unidad (CollegeOrUniversity) y cada programa (Course) */
import { PROGRAMAS } from '../data/programas.js'
import { C, K, vis } from './content.js'

const base = String(C.sitioUrl || '').replace(/\/?$/, '/')

export const unidad = {
  '@type': 'CollegeOrUniversity',
  name: 'Unidad de Posgrado de la Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica (FIP-UNI)',
  url: base,
  logo: base + 'favicon.png',
  email: K.correo || undefined,
  telephone: K.telefonoLink || undefined,
  address: { '@type': 'PostalAddress', streetAddress: K.direccion || undefined, addressLocality: 'Lima', addressCountry: 'PE' },
  parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Universidad Nacional de Ingeniería', url: 'https://www.uni.edu.pe/' },
  sameAs: vis(C.redes).filter((r) => r.url).map((r) => r.url),
}

/* En la ficha de un programa solo se describe ese programa */
export function orgGraph(soloId = null) {
  if (!base || base === '/') return null
  const cursos = vis(PROGRAMAS)
    .filter((p) => !p.borrador && (!soloId || p.id === soloId))
    .map((p) => {
      const mod = (p.datos || []).find((d) => /modalidad/i.test(d[0]))
      return {
        '@type': 'Course',
        name: p.nombre,
        description: p.resumen || p.nombre,
        url: base + 'programa/' + p.id,
        provider: { '@type': 'CollegeOrUniversity', name: unidad.name, url: base },
        hasCourseInstance: mod ? { '@type': 'CourseInstance', courseMode: String(mod[1]) } : undefined,
      }
    })
  return { '@context': 'https://schema.org', '@graph': [unidad, ...cursos] }
}

export const faqGraph = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: String(f.pregunta), acceptedAnswer: { '@type': 'Answer', text: String(f.respuesta) } })),
})
