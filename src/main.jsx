import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
/* Estilos globales primero: los CSS Modules de cada componente van después y pueden sobrescribirlos */
import './styles/global.css'
import App from './App.jsx'
import { captureUtm } from './utils/lead.js'

/* Origen de la visita (UTM / sitio de referencia) para el embudo del CRM */
captureUtm()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
