import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // .hero__bg en el CSS → styles.heroBg en JSX
      localsConvention: 'camelCaseOnly',
    },
  },
})
