/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Barlow Condensed", "Barlow", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Tema "Noche de Campeones": grafito cálido casi negro (reemplaza el slate azulado
        // original) + dorado como color principal + borgoña como acento secundario. emerald/
        // amber quedan intactos abajo porque data.ts y clubExtras.ts los usan como el color
        // REAL de camiseta de clubes puntuales (ej. Aston Villa, Wolves) -- no son parte del
        // tema de la app y no deben recolorearse.
        slate: {
          50: "#f6f4f2",
          100: "#ece7e2",
          200: "#d6cec5",
          300: "#bbb0a3",
          400: "#8f8275",
          500: "#6b5f53",
          600: "#4f4740",
          700: "#3a332e",
          800: "#26211d",
          900: "#19161a",
          950: "#0b0a0d",
        },
        gold: {
          50: "#faf6ec",
          100: "#f3ead0",
          200: "#e6d29e",
          300: "#d4b86a",
          400: "#c0a047",
          500: "#a8842e",
          600: "#8a6a22",
          700: "#6b511a",
          800: "#4d3a13",
          900: "#33270d",
          950: "#1f1808",
        },
        burgundy: {
          50: "#fdf1f4",
          100: "#fbdde5",
          200: "#f5b8c8",
          300: "#e888a0",
          400: "#d1547a",
          500: "#9f1239",
          600: "#7d0e2d",
          700: "#5c0a21",
          800: "#400717",
          900: "#29040e",
          950: "#170208",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
    },
  },
  plugins: [],
}