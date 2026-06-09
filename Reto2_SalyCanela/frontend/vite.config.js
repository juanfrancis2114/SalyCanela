import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El frontend corre en :5173. Las peticiones a /api se redirigen (proxy)
// al backend en :4000 durante desarrollo, evitando problemas de CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
