import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Asegura que los archivos se sirvan correctamente en producción
  base: './',
  server: {
    port: 5173, // puerto por defecto de Vite, opcional
  },
  define: {
    // Puedes exponer variables de entorno si quieres sobreescribirlas aquí
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
  }
});
