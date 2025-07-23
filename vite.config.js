import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        dashboard: 'dashboard.html',
        login: 'index.html',
        register: 'register.html',
      },
    },
  },
})