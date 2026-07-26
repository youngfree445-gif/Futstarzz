import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// GitHub Pages sirve un repo (no un dominio propio ni user.github.io) desde una subcarpeta
// (https://usuario.github.io/repo/), así que los assets necesitan ese prefijo en el build de
// Pages. Netlify sirve desde la raíz, por eso esto es condicional (GH_PAGES=true solo lo pone
// el script "deploy", ver package.json) y no afecta al build normal para Netlify.
// La app de Capacitor (CAPACITOR=true, ver script "build:capacitor") se sirve desde el sistema
// de archivos local del dispositivo (capacitor://... / file://...), no desde un dominio, así que
// necesita rutas relativas ('./') y un dist propio (dist-mobile) para no pisar el build web.
export default defineConfig({
  base: process.env.CAPACITOR ? './' : process.env.GH_PAGES ? '/f-tbol-star-_-calcio-manager-2026--1-/' : '/',
  build: {
    outDir: process.env.CAPACITOR ? 'dist-mobile' : 'dist',
  },
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