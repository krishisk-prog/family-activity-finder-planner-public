import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Check if SSL certificates exist (shared from backend)
const certsPath = path.join(__dirname, '..', 'backend', 'certs')
const keyPath = path.join(certsPath, 'localhost-key.pem')
const certPath = path.join(certsPath, 'localhost.pem')

const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath)
  ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to LAN (equivalent to --host flag)
    port: 5174,
    https: httpsConfig,
  },
})
