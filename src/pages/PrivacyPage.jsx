import { Link } from 'react-router-dom'
import { SimpleHeader } from '../components/layout/Header/Header.jsx'
import { useDocumentMeta } from '../hooks/useDocumentMeta.js'
import s from './PrivacyPage.module.css'

/* Política de privacidad.
   Basado en: Ley 29733, D.S. 016-2024-JUS y el Aviso de Privacidad UNI (UC-OTI, 13/01/2026, canal pdp@uni.edu.pe).
   Debe ser validado por la Oficina de Asesoría Legal de la UNI antes de publicar. */
export default function PrivacyPage() {
  useDocumentMeta('Política de privacidad | Posgrado FIP-UNI', 'Política de privacidad y tratamiento de datos personales del Posgrado FIP-UNI.')
  return (
    <>
      <SimpleHeader />
      <main className={s.legal} id="main">
        <Link className={s.back} to="/">
          ← Volver al inicio
        </Link>
        <h1>Política de privacidad</h1>
        <span className="ref-tag">Pendiente de validación por la Oficina de Asesoría Legal UNI</span>
        <p>La Unidad de Posgrado de la Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica de la Universidad Nacional de Ingeniería (en adelante, “Posgrado FIP-UNI”), con domicilio en Av. Túpac Amaru N.º 210, Rímac, Lima, es responsable del tratamiento de los datos personales que nos entregas.</p>
        <p><b>Marco legal vigente:</b> Ley N.º 29733, Ley de Protección de Datos Personales, y su Reglamento aprobado por Decreto Supremo N.º 016-2024-JUS. Este aviso sigue los mismos criterios del <a href="https://cursosgratuitos.uni.edu.pe/assets/docs/Aviso_Privacidad.pdf" target="_blank" rel="noopener noreferrer">Aviso de Privacidad de la Universidad Nacional de Ingeniería</a> (Oficina de Tecnologías de la Información, enero 2026).</p>
        <h2>1. Qué datos recogemos</h2>
        <p>A través del formulario “Recibe información del programa”: nombres, apellidos, correo electrónico, número de celular, programa de interés y tipo de información solicitada (brochure o charla informativa).</p>
        <h2>2. Para qué los usamos</h2>
        <ul>
        <li>Enviarte el brochure académico o la invitación a la charla informativa que solicitaste.</li>
        <li>Contactarte por correo, llamada o WhatsApp para resolver tus consultas sobre admisión, horarios e inversión.</li>
        <li>Informarte sobre nuevas convocatorias de los programas de posgrado de la FIP-UNI.</li>
        </ul>
        <h2>3. Con quién los compartimos</h2>
        <p>No vendemos ni compartimos tus datos con terceros. Solo acceden a ellos el personal de la Unidad de Posgrado y, cuando corresponda, la Escuela Central de Posgrado de la UNI para tu proceso de admisión.</p>
        <h2>4. Consecuencia de no proporcionar los datos</h2>
        <p>Si no completas los datos solicitados, no podremos enviarte el brochure ni inscribirte en la charla informativa.</p>
        <h2>5. Cuánto tiempo los conservamos</h2>
        <p>Por un plazo de tres (3) años desde tu último contacto con nosotros, o hasta que solicites su eliminación. No realizamos transferencias a terceros, salvo obligación legal.</p>
        <h2>6. Tus derechos (ARCO)</h2>
        <p>Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales, y a revocar tu consentimiento en cualquier momento. Para ejercerlos, dirígete al canal institucional de la UNI: <a href="mailto:pdp@uni.edu.pe">pdp@uni.edu.pe</a> o Mesa de Partes UNI. También puedes escribir a <a href="mailto:posgrado-fip@uni.edu.pe">posgrado-fip@uni.edu.pe</a> con el asunto “Datos personales”.</p>
        <p>Si consideras que no se atendió tu solicitud, puedes presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.</p>
        <h2>7. Contacto</h2>
        <p>Unidad de Posgrado FIP-UNI · Av. Túpac Amaru N.º 210, Rímac, Lima · (01) 481-1070 anexo 6005.</p>
        <p className="small">Última actualización: noviembre de 2026.</p>
      </main>
    </>
  )
}
