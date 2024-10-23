import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/hume': {
        target: 'https://api.hume.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hume/, '')
      }
    }
  }
});