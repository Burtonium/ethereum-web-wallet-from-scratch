import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [wasm(), react(), nodePolyfills()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
  },
})
