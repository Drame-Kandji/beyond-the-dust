import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` keeps the build portable (Vercel, Netlify, GitHub Pages sub-path).
// three.js is only loaded when a machine is opened (lazy SceneRoot chunk).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1600 },
});
