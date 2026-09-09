import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          if (id.includes('src/data/modelsData') || id.includes('src/data/toolsData') || id.includes('src/data/leaderboardData')) {
            return 'leaderboard-data';
          }
          if (id.includes('src/data/companiesData')) {
            return 'companies-data';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})


