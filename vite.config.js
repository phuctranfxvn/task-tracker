import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      // Add this section
      allowedHosts: [
        'tasks.868686863.xyz',
        'tasks.tranphuc.site',
        'task-tracker-api.868686863.xyz',
        'localhost' // optional, implicitly allowed usually
      ]
    }
})
