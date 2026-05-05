import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
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
      '/ofertas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
