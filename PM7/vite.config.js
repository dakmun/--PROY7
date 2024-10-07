import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Redirigir solicitudes API al backend (Express)
        changeOrigin: true,
        secure: false
      }
    }
  }
})
