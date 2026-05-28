import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base so the built assets resolve under any GitHub Pages sub-path
  // (e.g. https://<owner>.github.io/<repo>/) without hard-coding the repo name.
  // The app is a single-page tool with no client-side router, so relative URLs
  // are safe here.
  base: './',
})
