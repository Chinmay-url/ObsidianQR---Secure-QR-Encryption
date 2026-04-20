import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Allow connections from any IP
    port: 3000,      // Use port 3000
    strictPort: true, // Don't try to find another port if 3000 is in use
    open: false      // Don't open browser automatically
  },
});
