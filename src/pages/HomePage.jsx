import Layout from '../components/layout/Layout.jsx'
import FormDialog from '../components/sections/LeadForm/FormDialog.jsx'
import Admission from '../components/sections/Admission/Admission.jsx'
import Agenda from '../components/sections/Agenda/Agenda.jsx'
import Alumni from '../components/sections/Alumni/Alumni.jsx'
import Faculty from '../components/sections/Faculty/Faculty.jsx'
import Faq, { FAQS } from '../components/sections/Faq/Faq.jsx'
import Hero from '../components/sections/Hero/Hero.jsx'
import Programs from '../components/sections/Programs/Programs.jsx'
import Research from '../components/sections/Research/Research.jsx'
import Stats from '../components/sections/Stats/Stats.jsx'
import Testimonials from '../components/sections/Testimonials/Testimonials.jsx'
import Visit from '../components/sections/Visit/Visit.jsx'
import WhyUs from '../components/sections/WhyUs/WhyUs.jsx'
import JsonLd from '../components/ui/JsonLd/JsonLd.jsx'
import { useDocumentMeta } from '../hooks/useDocumentMeta.js'
import { faqGraph, orgGraph } from '../utils/seo.js'
import { MODO_EJEMPLO } from '../utils/testimonios.js'

const TITLE = 'Posgrado FIP-UNI | Doctorado, Maestría y Diplomados en Petróleo y Gas Natural'
const DESCRIPTION =
  'Unidad de Posgrado de la Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica de la Universidad Nacional de Ingeniería. Doctorado, Maestría y Diplomados para líderes del sector energético.'

/* Portada: las secciones toman sus textos de src/data/contenido.js y programas.js */
export default function HomePage() {
  useDocumentMeta(TITLE, DESCRIPTION)
  const org = orgGraph()

  return (
    <Layout
      banner={
        MODO_EJEMPLO && (
          <div className="demo-bar" role="status">
            MODO EJEMPLO: hay testimonios de muestra visibles
          </div>
        )
      }
    >
      <Hero />
      <Stats />
      <Programs />
      <Admission />
      <WhyUs />
      <Faculty />
      <Research />
      <Agenda />
      <Testimonials />
      <Alumni />
      <Faq />
      <Visit />
      <FormDialog />
      {FAQS.length > 0 && <JsonLd data={faqGraph(FAQS)} />}
      {org && <JsonLd data={org} />}
    </Layout>
  )
}
