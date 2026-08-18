// Los errores de los OTROS: Sentry.
//
// ---------------------------------------------------------------------------------------------
// PARA QUÉ SIRVE Y PARA QUÉ NO
// ---------------------------------------------------------------------------------------------
//
// Esto NO reemplaza al reporte de bug (src/reporteDeBug.ts) ni a PantallaDeError, y no encuentra
// ninguno de los bugs de lógica del juego: Sentry captura EXCEPCIONES, y una copa que reparte mal
// sus fechas no tira ninguna. Para eso está el botón de adentro del juego.
//
// Lo que sí resuelve es un agujero que no tiene otra solución: el juego está publicado en Netlify y
// en GitHub Pages, y si a alguien que no seas vos se le queda la pantalla en negro, no te enterás
// nunca. Esa persona no va a exportar su partida ni a escribirte -- cierra y no vuelve. Con esto,
// esa caída te llega con su stack trace, su navegador y la foto del estado que ya arma
// PantallaDeError.
//
// ---------------------------------------------------------------------------------------------
// APAGADO POR DEFECTO, Y A PROPÓSITO
// ---------------------------------------------------------------------------------------------
//
// Sin DSN configurado esto no hace absolutamente nada: ni se conecta, ni pide permisos, ni frena el
// arranque. Un juego que manda datos a un servidor sin que su dueño lo haya decidido es lo contrario
// de lo que hay que hacer, y además en desarrollo llenaría el panel de errores tuyos.
//
// Para encenderlo:
//   1. Cuenta gratis en sentry.io -> nuevo proyecto -> plataforma "React".
//   2. Copiar el DSN que te muestra (una URL tipo https://abc123@o45.ingest.sentry.io/678).
//   3. Ponerlo en la variable de entorno VITE_SENTRY_DSN:
//      - Netlify: Site settings -> Environment variables.
//      - Local:   un archivo .env con  VITE_SENTRY_DSN=https://...
//   4. Volver a compilar. Listo.
//
// Sin el paso 3, todo lo demás sigue funcionando igual que hoy.

// ---------------------------------------------------------------------------------------------
// SE CARGA SOLO SI SE USA
// ---------------------------------------------------------------------------------------------
//
// El SDK entra por `import()` y no por un import normal: así queda en un trozo aparte que el
// navegador NO descarga cuando no hay DSN. Con un import normal, un juego con el reporte apagado
// igual le hacía bajar el SDK entero a cada jugador -- pagar el peso de algo que no se usa.

/** El DSN llega por variable de entorno; Vite la incrusta en el build si empieza con VITE_. */
const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

type SentryModulo = typeof import('@sentry/react');
let sentry: SentryModulo | null = null;
let cargando: Promise<void> | null = null;

/**
 * Enciende el reporte remoto, si hay DSN.
 *
 * Se llama una sola vez desde main.tsx, ANTES de montar React: un error durante el primer render es
 * justamente el que hay que capturar, y si el reporte se enciende después ese se pierde.
 */
export function encenderReporteRemoto() {
  if (!DSN || cargando) return;
  cargando = import('@sentry/react').then(mod => {
    sentry = mod;
    mod.init({
      dsn: DSN,
      // Sin trazas de rendimiento ni grabación de sesión: acá sólo interesan los errores, y lo
      // demás gasta la cuota gratuita (5.000 eventos al mes) en datos que no se van a mirar.
      tracesSampleRate: 0,
      // El entorno separa lo tuyo de lo de los jugadores: en desarrollo se rompen cosas a propósito.
      environment: import.meta.env.DEV ? 'desarrollo' : 'produccion',
      // Ruido de navegador que no es del juego: extensiones, bloqueadores, pestañas que se cierran
      // a mitad de una petición. Sin este filtro son la mayoría de los eventos y tapan los de verdad.
      ignoreErrors: [
        'ResizeObserver loop',
        'Non-Error promise rejection captured',
        /extension:\//i,
      ],
    });
  }).catch(() => {
    // Sin red, o con el SDK bloqueado por un adblocker: el juego sigue igual. Un diagnóstico que
    // no carga no puede ser el motivo de que nadie pueda jugar.
  });
}

/**
 * Le manda a Sentry un error que PantallaDeError ya atrapó, con la foto del estado de la partida.
 *
 * El stack trace solo dice DÓNDE reventó. Lo que hace falta para reproducirlo es en qué paso de la
 * carrera estaba, qué decía el calendario de ese día y cómo estaba cada cuadro -- que es justo lo
 * que el reporte ya arma. Va como contexto adjunto y no como mensaje para que se pueda leer entero
 * sin recortes.
 */
export function avisarDeLaCaida(error: Error, estadoDeLaPartida: string | null) {
  if (!DSN) return;
  // Se espera a que el SDK termine de cargar antes de mandar nada. Sin esta espera, una caída
  // durante el primer render -- que es la más probable y la más grave -- llegaría cuando el módulo
  // todavía no está y se perdería en silencio, justo la que había que capturar.
  void cargando?.then(() => {
    sentry?.withScope(scope => {
      if (estadoDeLaPartida) scope.setContext('partida', { reporte: estadoDeLaPartida });
      sentry!.captureException(error);
    });
  });
}
