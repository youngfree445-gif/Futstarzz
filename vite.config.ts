import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// GitHub Pages sirve un repo (no un dominio propio ni user.github.io) desde una subcarpeta
// (https://usuario.github.io/repo/), así que los assets necesitan ese prefijo en el build de
// Pages. Netlify sirve desde la raíz, por eso esto es condicional (GH_PAGES=true solo lo pone
// el script "deploy", ver package.json) y no afecta al build normal para Netlify.
export default defineConfig({
  base: process.env.GH_PAGES ? '/f-tbol-star-_-calcio-manager-2026--1-/' : '/',
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  }
});