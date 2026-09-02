/**
 * Lo que data.ts sabe y todo script de datos necesita: la lista de clubes del juego y los
 * diccionarios que traducen el nombre de un club al que usa la base de jugadores.
 *
 * Vive acá y no adentro de cada script porque data.ts es LA fuente de verdad de los homónimos
 * (EQUIPO_SYNONYMS_POR_ID sabe que 'liverpool_eng' es "Liverpool" y 'liverpool_uru' es
 * "Liverpool F.C."). Dos lectores distintos de la misma fuente es exactamente cómo este proyecto se
 * rompió antes: se arregla uno y el otro se queda con el bug.
 */

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
    if (!nombre) continue;
    clubes.push({ id: mid[1], nombre: nombre[1], liga: liga ? liga[1] : '' });
  }
  return clubes;
}

/**
 * Uno de los diccionarios de sinónimos de data.ts, como Map.
 *
 * Con los DOS PUNTOS en la búsqueda. Sin ellos, buscar "const EQUIPO_SYNONYMS" encuentra primero a
 * "const EQUIPO_SYNONYMS_POR_ID", que está veinte líneas más arriba y empieza igual: el diccionario
 * por nombre nunca se leía y "Junior de Barranquilla" no encontraba a "Junior".
 */
export function leerMapa(dataTs, nombreDelMapa) {
  const i = dataTs.indexOf(`const ${nombreDelMapa}:`);
  if (i < 0) return new Map();
  // El cierre puede venir indentado (" };"), así que se busca por el patrón y no por la cadena
  // exacta: cortando en el lugar equivocado el mapa se lee entero o no se lee nada.
  const resto = dataTs.slice(i);
  const fin = /\n\s*\};/.exec(resto);
  const bloque = resto.slice(0, fin ? fin.index : resto.length);
  const m = new Map();
  // Comillas simples O DOBLES: EQUIPO_SYNONYMS_POR_ID usa simples y EQUIPO_SYNONYMS usa dobles.
  for (const x of bloque.matchAll(/["']([^"']+)["']:\s*["']([^"']+)["']/g)) m.set(x[1], x[2]);
  return m;
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
export function nombreEnLaBase(club, porId, porNombre) {
  return porId.get(club.id) || porNombre.get(club.nombre) || club.nombre;
}
