/**
 * Lo que data.ts y clubAliases.ts saben y todo script de datos necesita: la lista de clubes del
 * juego y los otros nombres con los que cada uno figura afuera.
 *
 * Vive acá y no adentro de cada script porque src/clubAliases.ts es LA fuente de verdad de los
 * nombres, homónimos incluidos: sabe que 'liverpool_eng' es "Liverpool" en la base de jugadores y
 * 'liverpool_uru' es "Liverpool F.C.". Dos lectores distintos de la misma fuente es exactamente cómo
 * este proyecto se rompió antes: se arregla uno y el otro se queda con el bug.
 */
import { readFile } from 'fs/promises';

/**
 * Los clubes del juego: { id, nombre, liga }.
 *
 * Se lee por BLOQUES y no por líneas: la mayoría de los clubes están escritos en una sola línea
 * larguísima, pero unos cuantos están repartidos en varias. Leyendo por línea esos no existían, y
 * el Everton chileno era uno: al no encontrarlo, la búsqueda seguía de largo hasta el Everton de
 * Goodison Park y sus fichajes cruzaban el Atlántico.
 *
 * La LIGA importa tanto como el nombre: Transfermarkt le dice "Club Nacional" al de MONTEVIDEO y el
 * juego le dice así al de ASUNCIÓN. El país es lo único que los distingue.
 */
export function leerClubesDelJuego(dataTs) {
  const clubes = [];
  for (const bloque of dataTs.split(/\n\s*\{\s*/)) {
    const mid = /^\s*(?:themeColor: \{[^}]*\},\s*)?id: '([^']+)'/.exec(bloque)
      ?? /^id: '([^']+)'/.exec(bloque);
    if (!mid) continue;
    const nombre = /\bname: '((?:[^'\\]|\\.)*)'/.exec(bloque);
    const liga = /\bleague: '([^']+)'/.exec(bloque);
    // SIN LIGA NO ES UN CLUB. data.ts guarda con la misma forma -- `id` y `name` -- los logros
    // ("Hat-Trick"), los patrocinadores ("Nutricionista de Estrellas"), los personajes y las
    // inversiones: 168 objetos que no son clubes. Sin este filtro la lista pasa de 697 a 865, y los
    // scripts de datos se ponen a buscar en Transfermarkt un club llamado "Corazón Ocupado".
    //
    // Los 697 clubes de CLUBS_DATABASE tienen todos su liga, así que el filtro no deja ninguno afuera.
    if (!nombre || !liga) continue;
    clubes.push({ id: mid[1], nombre: nombre[1], liga: liga[1] });
  }
  return clubes;
}

/**
 * La tabla de nombres de src/clubAliases.ts, como Map de id -> { nombre, calendario, plantel, otros }.
 *
 * Se parsea con JSON.parse, no con una expresión regular, y por eso la tabla está escrita con las
 * claves entre comillas. El lector viejo era regular y cortaba en la primera comilla simple: leía
 * "Borussia M" en vez de "Borussia M'gladbach" y el Mönchengladbach se quedó sin recibir un solo
 * fichaje de toda la ventana. O'Higgins y Newell's tenían el mismo problema.
 */
export async function leerNombresDeClub(ruta = 'src/clubAliases.ts') {
  const texto = await readFile(ruta, 'utf8');
  const i = texto.indexOf('export const NOMBRES_DE_CLUB');
  if (i < 0) throw new Error(`no encontré NOMBRES_DE_CLUB en ${ruta}`);
  const desde = texto.indexOf('{', i);
  const hasta = texto.indexOf('\n};', desde);
  if (desde < 0 || hasta < 0) throw new Error(`no pude delimitar NOMBRES_DE_CLUB en ${ruta}`);
  // Se le sacan los comentarios (van siempre en su propio renglón) y la coma final de la última
  // entrada, que JSON no acepta.
  const cuerpo = texto.slice(desde + 1, hasta)
    .split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
    .replace(/,\s*$/, '');
  const tabla = JSON.parse('{' + cuerpo + '}');
  return new Map(Object.entries(tabla));
}

/**
 * Las selecciones que declara data.ts.
 *
 * Hacen falta porque un jugador figura DOS veces en la base: en su club y en su selección. Mover la
 * fila de la selección lo saca del Mundial, y contarla como club le da a "Brasil" un plantel de 26
 * que compite con los clubes en cada cuenta.
 *
 * Sale de data.ts y no de una lista escrita a mano: los ids no sirven para reconocerlas (Brasil es
 * 1370, Países Bajos 105035) y una lista a mano se olvida justo de la que hace falta.
 */
export function leerSelecciones(dataTs) {
  const s = new Set(['Agentes libres']);
  for (const m of dataTs.matchAll(/countryName: '([^']+)'/g)) s.add(m[1]);
  return s;
}

/** El nombre con el que la base de jugadores llama al plantel de este club. */
export function nombreEnLaBase(club, nombres) {
  return nombres.get(club.id)?.plantel ?? club.nombre;
}

/**
 * Todos los nombres por los que se puede llegar a un club: el visible, el del calendario, el de la
 * base de jugadores y los que usan las fuentes externas.
 *
 * Es lo que evita tener una tabla de alias por script. El Bayern, el PSV, el Inter y el Lyon no
 * recibieron un solo fichaje de toda la ventana porque su nombre de Transfermarkt estaba cargado
 * nada más en la tabla del calendario, que el script de fichajes no leía.
 */
export function nombresDeBusqueda(club, nombres) {
  const c = nombres.get(club.id);
  if (!c) return [club.nombre];
  return [c.nombre, c.calendario, c.plantel, ...(c.otros ?? [])].filter(Boolean);
}
