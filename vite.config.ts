import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'

export default defineConfig({
  base: `/${pkg.name}`,
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: `dist`
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [vue()]
})
