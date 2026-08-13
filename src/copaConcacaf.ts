// Concacaf Champions Cup: la copa continental de México y Estados Unidos.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE ESTE ARCHIVO
// ---------------------------------------------------------------------------------------------
//
// México y Estados Unidos eran los únicos dos países con liga y copa nacional COMPLETAS que
// figuraban como incompletos, y les faltaba una sola cosa: su copa continental. Sudamérica tiene
// Libertadores y Sudamericana, Europa tiene Champions y Europa League, y el área de Concacaf no
// tenía nada -- así que un jugador del Rayados o del LAFC no podía jugar copa internacional nunca.
//
// ---------------------------------------------------------------------------------------------
// EL FORMATO, Y EN QUÉ SE DIFERENCIA DE LAS OTRAS
// ---------------------------------------------------------------------------------------------
//
// No tiene fase de grupos. Son cinco rondas de eliminación directa seguidas, todas a ida y vuelta
// menos la final, que se juega a partido único. En 2025 la disputaron 27 equipos de 10
// asociaciones, del 4 de febrero al 1 de junio, y la ganó Cruz Azul 5-0 al Vancouver Whitecaps.
//
// Acá se modela con 16: la base tiene clubes mexicanos y estadounidenses, pero no centroamericanos
// ni caribeños, y armar un cuadro de 27 con 16 clubes reales significaría inventar once. Con 16
// entran cuatro rondas limpias (octavos, cuartos, semis y final) y todos los cruces son entre
// clubes que existen de verdad. Los cupos siguen la proporción real: la MLS pone más equipos que
// la Liga MX (9 contra 8 en 2025), pero la Liga MX gana casi siempre.
//
// De la temporada 2 en adelante los cupos se ganan jugando, igual que los de Libertadores: salen de
// cómo terminó la tabla del año anterior (ver posicionesFinales).

import type { PosicionesFinales } from './copasConmebol';

/** Cuántos clubes pone cada liga. Suman 16. */
export const CUPOS_CONCACAF: Readonly<Record<string, number>> = {
  'Estadounidense': 8,
  'Mexicana': 8,
};

/**
 * Los 16 de la edición 1, DECLARADOS -- no elegidos por reputación.
 *
 * Hace falta que sea una lista y no un ranking porque los 30 clubes de la MLS tienen exactamente la
 * MISMA reputación en la base (4, los treinta). Ordenarlos por fuerza daba orden alfabético: entraban
 * Atlanta, Austin, Charlotte y Chicago, y quedaban afuera LAFC e Inter Miami. Con la Liga MX no
 * pasa -- ahí las reputaciones van de 2 a 5 y el orden sale bien -- pero se declara igual, para que
 * las dos mitades del cuadro se lean de la misma manera.
 *
 * Los elegidos son los que de verdad juegan la Concacaf: campeones de conferencia, ganadores de
 * Leagues Cup y los grandes de cada liga.
 */
const CONCACAF_EDICION_1: Readonly<Record<string, readonly string[]>> = {
  'Mexicana': ['america_mex', 'tigres', 'monterrey', 'cruz_azul', 'chivas', 'pumas', 'toluca', 'leon'],
  'Estadounidense': ['lafc', 'inter_miami_cf', 'columbus_crew', 'la_galaxy', 'seattle_sounders',
                     'philadelphia', 'fc_cincinnati', 'new_york_city_fc'],
};

/** Respaldo por si algún id de la lista dejara de existir: se completa con los de más reputación. */
function mejoresDe(league: string, cuantos: number, todos: readonly { id: string; league: string; reputation?: number }[]): string[] {
  const declarados = (CONCACAF_EDICION_1[league] ?? []).filter(id => todos.some(c => c.id === id));
  if (declarados.length >= cuantos) return declarados.slice(0, cuantos);
  const resto = todos
    .filter(c => c.league === league && !declarados.includes(c.id))
    .sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))
    .map(c => c.id);
  return [...declarados, ...resto].slice(0, cuantos);
}

/**
 * Quiénes juegan la Concacaf Champions Cup de esa edición.
 *
 * Temporada 1: los mejores de cada liga por reputación. De la 2 en adelante, los que terminaron
 * arriba en TU carrera -- mismo criterio que reparte los cupos de Libertadores.
 */
export function participantesConcacaf(
  year: number,
  posiciones: PosicionesFinales | undefined,
  todos: readonly { id: string; league: string; reputation?: number }[],
): string[] {
  const elegidos: string[] = [];
  for (const [league, cupo] of Object.entries(CUPOS_CONCACAF)) {
    const tabla = posiciones?.[`${league}-${year - 1}`];
    const porMerito = year > 1 && tabla?.length
      // La tabla del año anterior manda; si quedó corta, se completa por reputación.
      ? [...tabla.slice(0, cupo), ...mejoresDe(league, cupo, todos)]
      : mejoresDe(league, cupo, todos);
    for (const id of porMerito) {
      if (elegidos.length >= sumaDeCupos()) break;
      if (!elegidos.includes(id)) elegidos.push(id);
      if (elegidos.filter(x => todos.find(c => c.id === x)?.league === league).length >= cupo) break;
    }
  }
  return elegidos;
}

export function sumaDeCupos(): number {
  return Object.values(CUPOS_CONCACAF).reduce((a, b) => a + b, 0);
}

/**
 * Cuándo se juega, y por qué NO es la ventana real del torneo.
 *
 * La de verdad va del 4 de febrero al 1 de junio. Acá no se puede usar: la Liga MX que tenemos
 * cargada es sólo el Apertura, del 17 de julio al 23 de noviembre, así que en febrero un club
 * mexicano no está jugando nada y no hay dónde meterle la copa. Se probó y el resultado fue que
 * América disputaba su Concacaf en octubre igual, pero contra una ventana declarada que decía otra
 * cosa -- lo peor de los dos mundos: ni real ni coherente.
 *
 * Así que la ventana es el tramo donde las DOS ligas están jugando de verdad: la MLS va de febrero
 * a noviembre y la Liga MX de julio a noviembre, con lo cual se solapan de agosto a noviembre. Son
 * catorce semanas para siete fechas de cuadro, que entran holgadas.
 *
 * El día que se cargue el Clausura mexicano, esto vuelve a ser febrero-junio y se acabó el parche.
 */
export const VENTANA_CONCACAF = { desde: '08-01', hasta: '11-08' } as const;
