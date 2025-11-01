import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
    
  ],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'https://chatbottry-4.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

      },
      // Proxy uploads so frontend can use relative `/uploads/...` paths in dev
      '/uploads': {
        target: 'https://chatbottry-4.onrender.com',
        changeOrigin: true,
      },
    },
  },

})
