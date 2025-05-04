import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/lps': {
        target: 'https://grocery-app-i1ef.onrender.com', // or your API host
        changeOrigin: true,
        secure: true
      }
    }
  }
})
