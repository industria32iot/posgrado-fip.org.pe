import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/* NOINDEX=true en la compilación agrega <meta name="robots" content="noindex">:
   se usa en las copias de prueba (GitHub Pages, nuevo.posgrado-fip.org.pe)
   para que Google no las indexe ni compitan con el sitio oficial. */
const noindex = () => ({
  name: 'noindex',
  transformIndexHtml: () =>
    process.env.NOINDEX === 'true' ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }] : [],
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), noindex()],
  css: {
    modules: {
      // .hero__bg en el CSS → styles.heroBg en JSX
      localsConvention: 'camelCaseOnly',
    },
  },
})
