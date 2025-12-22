import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Add this section
    allowedHosts: [
      'tasks.tranphuc.site',
      'task-tracker-api.tranphuc.site',
      'localhost' // optional, implicitly allowed usually
    ]
  }
})
