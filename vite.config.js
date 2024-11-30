import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Usa una base absoluta para producción
  build: {
    outDir: 'public' // Carpeta de salida para el build
  },
  server: {
    proxy: {
      '/api': 'https://deploy-educar.vercel.app/',
    }
  }
});