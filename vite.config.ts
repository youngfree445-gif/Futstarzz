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
//
// process.env.NETLIFY va primero y le gana a todo lo demas a propósito: Netlify lo inyecta el
// solo en TODOS sus builds (no hay forma de que falte ni de que lo pongamos mal), así que si
// alguna vez queda GH_PAGES=true pegado en las variables de entorno del panel de Netlify (pasó:
// sirvió los assets con el prefijo de carpeta de GitHub Pages, que en Netlify no existe -> 404
// en todo -> pantalla en blanco), esto lo pisa igual sin depender de acordarse de sacarlo.
export default defineConfig({
  base: process.env.CAPACITOR
    ? './'
    : process.env.NETLIFY
    ? '/'
    : process.env.GH_PAGES
    ? '/Futstarzz/'
    : '/',
  // Cada destino escribe en su propia carpeta. Antes GH Pages y Netlify compartían dist/, y como
  // el build de Pages lleva el prefijo /Futstarzz/ en los assets, correr "deploy" dejaba en dist/
  // un build que en Netlify da 404 en todo -> pantalla en blanco. Como a Netlify se sube
  // arrastrando la carpeta a mano, ese dist/ envenenado se subía sin que nada lo avisara.
  build: {
    outDir: process.env.CAPACITOR
      ? 'dist-mobile'
      : process.env.GH_PAGES
      ? 'dist-ghpages'
      : 'dist',
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