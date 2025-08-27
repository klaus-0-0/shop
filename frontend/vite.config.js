import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true,
    allowedHosts: ['frontend-wr1l.onrender.com'],
  },
})
