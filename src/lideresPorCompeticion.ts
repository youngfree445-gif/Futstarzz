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
  amarillas: number;
  rojas: number;
  /** Sólo para arqueros: partidos jugados y goles recibidos, para la portería menos vencida. */
  partidosDeArquero?: number;
  golesRecibidos?: number;
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
  lineas: readonly {
    nombre: string; clubName: string;
    goles?: number; asistencias?: number; amarillas?: number; rojas?: number;
    partidosDeArquero?: number; golesRecibidos?: number; esVos?: boolean;
  }[],
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
      amarillas: (antes?.amarillas ?? 0) + (l.amarillas ?? 0),
      rojas: (antes?.rojas ?? 0) + (l.rojas ?? 0),
      partidosDeArquero: (antes?.partidosDeArquero ?? 0) + (l.partidosDeArquero ?? 0),
      golesRecibidos: (antes?.golesRecibidos ?? 0) + (l.golesRecibidos ?? 0),
      esVos: l.esVos || antes?.esVos,
    };
  }
  return { ...(tablas ?? {}), [clave]: tabla };
}

/** Los mejores de una competición, ordenados. Vacío si todavía no se jugó nada. */
export function lideresDe(
  tablas: LideresPorCompeticion | undefined,
  clave: string,
): {
  goleadores: LineaDeLider[]; asistidores: LineaDeLider[];
  amonestados: LineaDeLider[]; expulsados: LineaDeLider[]; arqueros: LineaDeLider[];
} {
  const vacio = { goleadores: [], asistidores: [], amonestados: [], expulsados: [], arqueros: [] };
  const tabla = tablas?.[clave];
  if (!tabla) return vacio;
  const todos = Object.values(tabla);
  // Desempate por nombre para que el orden sea estable entre renders: sin esto, dos jugadores con
  // los mismos goles se turnaban el primer puesto cada vez que la pantalla se volvía a dibujar.
  const goleadores = todos.filter(l => l.goles > 0)
    .sort((a, b) => b.goles - a.goles || b.asistencias - a.asistencias || a.nombre.localeCompare(b.nombre));
  const asistidores = todos.filter(l => l.asistencias > 0)
    .sort((a, b) => b.asistencias - a.asistencias || b.goles - a.goles || a.nombre.localeCompare(b.nombre));
  const amonestados = todos.filter(l => l.amarillas > 0)
    .sort((a, b) => b.amarillas - a.amarillas || a.nombre.localeCompare(b.nombre));
  const expulsados = todos.filter(l => l.rojas > 0)
    .sort((a, b) => b.rojas - a.rojas || a.nombre.localeCompare(b.nombre));
  // PORTERÍA MENOS VENCIDA: promedio de goles recibidos, no total. Con el total ganaba siempre el
  // arquero que menos jugó -- uno con dos partidos y un gol le pasaba por delante a uno con veinte
  // partidos y diez. Se pide un mínimo de partidos por lo mismo.
  const MINIMO_DE_PARTIDOS = 3;
  const arqueros = todos
    .filter(l => (l.partidosDeArquero ?? 0) >= MINIMO_DE_PARTIDOS)
    .sort((a, b) =>
      (a.golesRecibidos! / a.partidosDeArquero!) - (b.golesRecibidos! / b.partidosDeArquero!)
      || b.partidosDeArquero! - a.partidosDeArquero!
      || a.nombre.localeCompare(b.nombre));
  return { goleadores, asistidores, amonestados, expulsados, arqueros };
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

/**
 * Reparte tarjetas simuladas de un club.
 *
 * El motor tampoco simula tarjetas de los rivales -- sólo las tuyas, que salen de tus decisiones en
 * el partido. Sin este reparto, "más amarillas" del torneo serías siempre vos con una sola, o
 * quedaría vacío. Las amarillas caen sobre todo en defensores y volantes, que es donde caen de
 * verdad, y las rojas son raras a propósito: una cada tantos partidos, no una por fecha.
 */
/**
 * EL TOPE DE AMARILLAS DE UNA TEMPORADA, y por qué existe uno de verdad.
 *
 * Reportado jugando: al cerrar la temporada aparecían jugadores con veinte y pico de amarillas.
 * La cuenta explica por qué -- el reparto elige entre los DEFENSORES Y VOLANTES de `starPlayers`,
 * que son cinco o seis nombres, y les da dos amarillas por partido durante treinta y ocho fechas.
 * Setenta y seis amarillas repartidas entre cinco jugadores dan quince cada uno, y al más castigado
 * lo dejan arriba de veinticinco.
 *
 * Y NO ES SOLO QUE SE VEA FEO: es que en el fútbol eso no puede pasar. Al llegar al tope de
 * acumulación te suspenden Y LA CUENTA SE REINICIA, así que nadie termina un torneo con veinticinco.
 * El tope no es un maquillaje sobre el número: es la regla que faltaba modelar.
 *
 * Doce es lo que lleva un central muy amonestado en una temporada larga de verdad.
 */
export const TOPE_DE_AMARILLAS = 12;
/** Y las rojas: tres en una temporada ya es una barbaridad. */
export const TOPE_DE_ROJAS = 3;

export function repartirTarjetas(
  figuras: readonly string[],
  clubName: string,
  aleatorio: () => number = Math.random,
  /**
   * Lo que cada jugador YA lleva en esta competición. Al que llegó al tope no se le dan más: en el
   * fútbol de verdad ya cumplió la suspensión y su cuenta arrancó de cero.
   */
  yaTiene?: Record<string, { amarillas: number; rojas: number }>,
): { nombre: string; clubName: string; amarillas: number; rojas: number }[] {
  if (!figuras.length) return [];
  const propensos = figuras.filter(f => /\((CB|LB|RB|CDM|CM|LM|RM)\)/.test(f));
  const candidatos = (propensos.length ? propensos : figuras).map(limpiarNombre);

  const salida: { nombre: string; clubName: string; amarillas: number; rojas: number }[] = [];
  // Un partido de fútbol reparte dos o tres amarillas por equipo. Se modela así y no con una
  // probabilidad por jugador, que daba equipos con nueve amonestados.
  const cuantas = aleatorio() < 0.35 ? 1 : aleatorio() < 0.85 ? 2 : 3;
  // LAS DE ESTE MISMO PARTIDO CUENTAN. La primera versión filtraba una sola vez antes del bucle, así
  // que un jugador con once amarillas seguía siendo candidato para las tres de la fecha y terminaba
  // en catorce. Lo atrapó el caso, que medía el peor de una temporada entera: daba 13.
  const enEstePartido: Record<string, number> = {};
  for (let i = 0; i < cuantas; i++) {
    const conLugar = candidatos.filter(n =>
      (yaTiene?.[n]?.amarillas ?? 0) + (enEstePartido[n] ?? 0) < TOPE_DE_AMARILLAS);
    // Si TODOS llegaron al tope, la fecha no reparte más amarillas. Es lo correcto y no un caso
    // raro: con cinco candidatos y treinta y ocho fechas, pasa sobre el final de la temporada.
    if (!conLugar.length) break;
    const quien = conLugar[Math.floor(aleatorio() * conLugar.length)];
    enEstePartido[quien] = (enEstePartido[quien] ?? 0) + 1;
    salida.push({ nombre: quien, clubName, amarillas: 1, rojas: 0 });
  }
  if (aleatorio() < 0.06) {
    const sinRojas = candidatos.filter(n => (yaTiene?.[n]?.rojas ?? 0) < TOPE_DE_ROJAS);
    if (sinRojas.length) {
      const quien = sinRojas[Math.floor(aleatorio() * sinRojas.length)];
      salida.push({ nombre: quien, clubName, amarillas: 0, rojas: 1 });
    }
  }
  return salida;
}

/** El arquero de un plantel, o null si la lista no trae ninguno. */
export function arqueroDe(figuras: readonly string[]): string | null {
  const gk = figuras.find(f => /\(GK\)/.test(f));
  return gk ? limpiarNombre(gk) : null;
}
