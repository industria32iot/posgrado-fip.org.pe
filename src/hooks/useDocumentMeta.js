import { useEffect } from 'react'

/* Título y descripción de la página (para Google y para la pestaña del navegador) */
export function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      const md = document.querySelector('meta[name="description"]')
      if (md) md.setAttribute('content', description)
    }
  }, [title, description])
}
