import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // Add any global CSS variables or mixins here if needed
    },
    modules: {
      // Enable CSS modules for .module.css files
      localsConvention: 'camelCaseOnly',
    },
    // Enable CSS source maps in development
    devSourcemap: true,
  },
  resolve: {
    alias: {
      // Add any path aliases here if needed
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Configure development server options
    port: 5173,
    open: true,
    // Enable HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
  },
  // Enable source maps for better debugging
  build: {
    sourcemap: true,
  },
})
