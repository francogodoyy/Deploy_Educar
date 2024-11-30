// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Carpeta de salida para el build
  },
  server: {
    proxy: {
      '/api': 'https://backend-one-alpha-11.vercel.app',  // Proxy a tu backend
    }
  }
});