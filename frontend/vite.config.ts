import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {}
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['everbearing-marlee-dragonfly.ngrok-free.dev']
  }
})
