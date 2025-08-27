import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxDev: true, // 👈 Force React to use dev mode
    }),
  ],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true,
    allowedHosts: ['frontend-wr1l.onrender.com'],
  },
})
