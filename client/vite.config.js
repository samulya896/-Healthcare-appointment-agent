import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, requests to /api are proxied to the local Express server
// (leave VITE_API_URL empty). In production set VITE_API_URL to the deployed backend.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
