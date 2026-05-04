import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000', // Altere para a porta que o backend roda localmente
        changeOrigin: true,
      },
      '/usuarios': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/prontuarios': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/agenda': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});