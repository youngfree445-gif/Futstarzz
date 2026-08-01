// Foto de tapa del periódico de post-partido: cambia según cómo te fue.
//
// Las fotos se cargan solas desde src/assets/press/match/<victoria|empate|derrota>/. Para agregar
// una, alcanza con dejar el archivo en la carpeta que corresponda -- no hay que tocar este archivo
// ni registrarla en ninguna lista. Se elige una al azar entre las disponibles de esa categoría.
//
// Mientras una carpeta esté vacía se dibuja una escena con CSS/SVG (ver MatchPhoto.tsx), así el
// periódico nunca queda con un hueco.

export type MatchOutcome = 'victoria' | 'empate' | 'derrota';

// eager:true las incluye en el bundle como cualquier otro asset (con hash y optimización de Vite).
// El patrón cubre las extensiones que suele traer una foto de prensa.
const FOTOS = import.meta.glob<{ default: string }>(
  './assets/press/match/*/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

// Agrupa por carpeta: './assets/press/match/victoria/festejo1.jpg' -> 'victoria'.
const PORCATEGORIA: Record<MatchOutcome, string[]> = { victoria: [], empate: [], derrota: [] };
for (const [ruta, mod] of Object.entries(FOTOS)) {
  const carpeta = ruta.split('/').at(-2) as MatchOutcome | undefined;
  if (carpeta && carpeta in PORCATEGORIA) PORCATEGORIA[carpeta].push(mod.default);
}

/** 'W' | 'D' | 'L' -> la carpeta de fotos que le corresponde. */
export function outcomeOf(resultado: 'W' | 'D' | 'L'): MatchOutcome {
  return resultado === 'W' ? 'victoria' : resultado === 'D' ? 'empate' : 'derrota';
}

/**
 * Una foto al azar para este resultado, o null si todavía no hay ninguna cargada (ahí el periódico
 * dibuja la escena por código).
 *
 * `seed` mantiene estable la elección mientras el componente se re-renderiza: sin él, cada cambio de
 * estado en PostMatch sortearía una foto distinta y la tapa parpadearía.
 */
export function pickMatchPhoto(outcome: MatchOutcome, seed: number): string | null {
  const pool = PORCATEGORIA[outcome];
  if (pool.length === 0) return null;
  return pool[Math.abs(Math.floor(seed)) % pool.length];
}

/** Cuántas fotos hay cargadas por categoría. Útil para verificar que se agregaron bien. */
export function matchPhotoCounts(): Record<MatchOutcome, number> {
  return {
    victoria: PORCATEGORIA.victoria.length,
    empate: PORCATEGORIA.empate.length,
    derrota: PORCATEGORIA.derrota.length,
  };
}
