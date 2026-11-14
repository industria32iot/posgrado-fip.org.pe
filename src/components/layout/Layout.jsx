import Footer from './Footer/Footer.jsx'
import Header from './Header/Header.jsx'
import WhatsAppFloat from './WhatsAppFloat/WhatsAppFloat.jsx'
import ScrollProgress from './Effects/ScrollProgress.jsx'

/* Estructura común: barra de progreso, salto al contenido, cabecera, pie y WhatsApp */
export default function Layout({ children, solicitarHref, waMessage, banner }) {
  return (
    <>
      <ScrollProgress />
      {banner}
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Header solicitarHref={solicitarHref} />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat message={waMessage} />
    </>
  )
}
