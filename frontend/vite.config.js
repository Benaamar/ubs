import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    allowedHosts: [
      'unteeming-uncommiserated-bradly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.app'
    ]
    // Proxy désactivé - on utilise directement l'URL ngrok dans api.js
  }
})

