import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/comunidad_data': 'http://localhost:3000', // Asegúrate de que esto apunte a tu backend
      '/docente_data': 'http://localhost:3000', // Igualmente, para el otro endpoint
    }
  }
})