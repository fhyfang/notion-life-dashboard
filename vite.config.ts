import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/notion-life-dashboard/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'motion': ['framer-motion'],
          'notion': ['@notionhq/client'],
          'icons': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
