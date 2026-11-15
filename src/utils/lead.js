/* Envío de interesados al CRM (Dolibarr) a través de /api/lead.php.
   Solo se activa si la compilación define VITE_LEAD_ENDPOINT (despliegue en Hostinger).
   En GitHub Pages o en desarrollo no se envía nada y el formulario sigue abriendo WhatsApp. */

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || ''
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const STORE = 'fipUtm'

/* Guarda el origen de la visita (enlaces de campañas con ?utm_source=...) para
   atribuir el interesado aunque navegue por varias páginas antes de escribir. */
export function captureUtm() {
  try {
    const qs = new URLSearchParams(window.location.search)
    const utm = Object.fromEntries(UTM_KEYS.filter((k) => qs.get(k)).map((k) => [k, qs.get(k).slice(0, 100)]))
    if (!Object.keys(utm).length && document.referrer && !document.referrer.startsWith(window.location.origin)) {
      utm.utm_source = new URL(document.referrer).hostname
      utm.utm_medium = 'referral'
    }
    if (Object.keys(utm).length && !sessionStorage.getItem(STORE)) sessionStorage.setItem(STORE, JSON.stringify(utm))
  } catch {
    /* sin sessionStorage: el interesado se registra sin origen */
  }
}

function storedUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || '{}')
  } catch {
    return {}
  }
}

export const leadsEnabled = () => !!ENDPOINT

/**
 * Envía el interesado sin bloquear la interfaz (keepalive: se completa aunque
 * se abra WhatsApp o se cambie de página). Devuelve una promesa que nunca falla.
 */
export function sendLead(data) {
  if (!ENDPOINT) return Promise.resolve({ ok: false, skipped: true })
  const body = JSON.stringify({ ...storedUtm(), ...data, pagina: window.location.href })
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  })
    .then((r) => r.json().catch(() => ({ ok: r.ok })))
    .catch(() => ({ ok: false }))
}
