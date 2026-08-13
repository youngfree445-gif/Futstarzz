// Goleadores y asistidores de CADA competición, con el jugador adentro.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// El panel de estadísticas mostraba SIEMPRE los líderes de la liga, y salían de una tabla fija
// (REAL_LEAGUE_LEADERS) o de una derivación de la tabla de posiciones. Dos consecuencias:
//
//   1. La Libertadores, la copa nacional y la Sudamericana no tenían goleador. Podías ganar la copa
//      metiendo seis goles y eso no figuraba en ningún lado.
//   2. El jugador NUNCA entraba en la lista. Sus goles iban a su ficha personal y a ningún ranking,
//      así que ser goleador de un torneo era imposible por construcción.
//
// Pedido: "que cada torneo tenga su tabla de máximos... y tú estás incluido en esas estadísticas".
//
// ---------------------------------------------------------------------------------------------
// CÓMO FUNCIONA
// ---------------------------------------------------------------------------------------------
//
// Una tabla por competición y por temporada, guardada en el perfil. Se anota partido a partido: los
// goles del jugador salen del partido que acaba de jugar, y los de los demás se reparten entre los
// delanteros de cada club con el marcador que simuló el motor.
//
// La clave lleva la temporada porque cada año arranca de cero, igual que en la vida real: el
// goleador de la Libertadores 2026 no sigue sumando en la 2027.

export interface LineaDeLider {
  nombre: string;
  clubName: string;
  goles: number;
  asistencias: number;
  /** true si es el jugador de la carrera. Sirve para resaltarlo en la tabla. */
  esVos?: boolean;
}

/** competición|temporada -> nombre del jugador -> su línea. */
export type LideresPorCompeticion = Record<string, Record<string, LineaDeLider>>;

/**
 * La clave de una competición en una temporada.
 *
 * Se normaliza el nombre porque el mismo torneo llega con rótulos distintos según de dónde salga:
 * el calendario dice "Copa Libertadores" y el motor puede decir "Copa Libertadores · Octavos". Sin
 * normalizar, cada ronda armaba su propia tabla y ningún goleador pasaba de dos goles.
 */
export function claveDeCompeticion(competicion: string, temporada: number): string {
  const limpio = competicion.split('·')[0].trim();
  return `${limpio}|${temporada}`;
}

/** El nombre lindo de la competición, para el título del panel. */
export function nombreDeLaClave(clave: string): string {
  return clave.split('|')[0];
}

/**
 * Anota lo que pasó en un partido.
 *
 * `mios` son los goles y asistencias del jugador de la carrera; `otros` son los repartos simulados
 * del resto. Devuelve un objeto NUEVO -- el estado del perfil es inmutable y React necesita la
 * referencia distinta para volver a dibujar.
 */
export function anotarEnLideres(
  tablas: LideresPorCompeticion | undefined,
  clave: string,
  lineas: readonly { nombre: string; clubName: string; goles?: number; asistencias?: number; esVos?: boolean }[],
): LideresPorCompeticion {
  if (!lineas.length) return tablas ?? {};
  const previas = tablas?.[clave] ?? {};
  const tabla: Record<string, LineaDeLider> = { ...previas };
  for (const l of lineas) {
    if (!l.nombre) continue;
    const antes = tabla[l.nombre];
    tabla[l.nombre] = {
      nombre: l.nombre,
      clubName: l.clubName || antes?.clubName || '',
      goles: (antes?.goles ?? 0) + (l.goles ?? 0),
      asistencias: (antes?.asistencias ?? 0) + (l.asistencias ?? 0),
      esVos: l.esVos || antes?.esVos,
    };
  }
  return { ...(tablas ?? {}), [clave]: tabla };
}

/** Los mejores de una competición, ordenados. Vacío si todavía no se jugó nada. */
export function lideresDe(
  tablas: LideresPorCompeticion | undefined,
  clave: string,
): { goleadores: LineaDeLider[]; asistidores: LineaDeLider[] } {
  const tabla = tablas?.[clave];
  if (!tabla) return { goleadores: [], asistidores: [] };
  const todos = Object.values(tabla);
  // Desempate por nombre para que el orden sea estable entre renders: sin esto, dos jugadores con
  // los mismos goles se turnaban el primer puesto cada vez que la pantalla se volvía a dibujar.
  const goleadores = todos.filter(l => l.goles > 0)
    .sort((a, b) => b.goles - a.goles || b.asistencias - a.asistencias || a.nombre.localeCompare(b.nombre));
  const asistidores = todos.filter(l => l.asistencias > 0)
    .sort((a, b) => b.asistencias - a.asistencias || b.goles - a.goles || a.nombre.localeCompare(b.nombre));
  return { goleadores, asistidores };
}

/**
 * Reparte los goles de un club entre sus figuras.
 *
 * El motor simula MARCADORES, no goleadores: sabe que el Palmeiras ganó 3-1 pero no quién los hizo.
 * Sin este reparto, la tabla de la Libertadores tendría un solo nombre -- el del jugador -- y sería
 * un ranking de uno.
 *
 * El reparto no es al azar puro: los primeros de `figuras` (que vienen ordenados por importancia en
 * starPlayers) tienen más chances, y los arqueros y defensores quedan afuera salvo que no haya
 * nadie más. Es una aproximación, pero da una tabla que se lee como una tabla de goleadores real:
 * unos pocos arriba con muchos goles y una cola larga con uno o dos.
 */
export function repartirGoles(
  figuras: readonly string[],
  clubName: string,
  goles: number,
  aleatorio: () => number = Math.random,
): { nombre: string; clubName: string; goles: number }[] {
  if (goles <= 0 || !figuras.length) return [];
  const ofensivos = figuras.filter(f => /\((ST|CF|LW|RW|CAM|LM|RM|CM)\)/.test(f));
  const candidatos = (ofensivos.length ? ofensivos : figuras).map(limpiarNombre);
  const cuenta = new Map<string, number>();
  for (let i = 0; i < goles; i++) {
    // Sesgo hacia los primeros: dos tiradas y se queda la más chica. Un 9 de verdad mete más que el
    // volante central, y con un uniforme puro todos terminaban con la misma cantidad.
    const a = Math.floor(aleatorio() * candidatos.length);
    const b = Math.floor(aleatorio() * candidatos.length);
    const quien = candidatos[Math.min(a, b)];
    cuenta.set(quien, (cuenta.get(quien) ?? 0) + 1);
  }
  return [...cuenta].map(([nombre, g]) => ({ nombre, clubName, goles: g }));
}

/** "Luis Muriel (ST)" -> "Luis Muriel". */
function limpiarNombre(figura: string): string {
  return figura.replace(/\s*\([^)]*\)\s*$/, '').trim();
}
