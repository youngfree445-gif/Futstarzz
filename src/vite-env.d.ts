/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIPHY_API_KEY?: string;
  /** DSN de Sentry. Sin esto el reporte remoto queda apagado -- ver src/reporteRemoto.ts. */
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
