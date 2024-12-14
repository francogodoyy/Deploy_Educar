import { defineConfig } from 'vite';



export default defineConfig({
  base: './', // Define una base relativa para el proyecto
  build: {
    outDir: 'dist' // Carpeta de salida para el build
  },
  server: {
    proxy: {
      '/api': 'https://deploy-educar.vercel.app/', 
    }
  }
}); 