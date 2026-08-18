// Generación de las temporadas del calendario, a partir de las fechas reales.
//
// Vive en su propio módulo y no dentro de dateSchedule.ts porque leagueEngine.ts también lo
// necesita (arma la tabla con estas mismas fechas) y dateSchedule.ts ya importa de leagueEngine:
// ponerlo allá creaba un ciclo entre los dos módulos. Acá abajo solo hay datos puros
// (realCalendarDates.ts no importa nada), así que no hay ciclo posible.

import { repartesDosTitulos, torneosDelAnio } from './reglamentos';
import { DATED_CALENDARS, type DatedCompetition, type DatedMatch } from './realCalendarDates';

/** Día 1 de la carrera. Coincide con el arranque real de la temporada 2026. */
export const CAREER_START_DATE = '2026-01-12';

/**
 * Cuántas temporadas puede vivir una carrera. De los 17 a los ~45 años son 28 campañas; se deja
 * margen. Es el tope del calendario: más allá de esto un club se queda sin fechas.
 */
export const MAX_TEMPORADAS = 32;

/** Hash estable de un string -> entero positivo. */
function hashTexto(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** PRNG determinístico: misma semilla, misma secuencia. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Los clubes que participan en una competición, deducidos de sus propios partidos. */
function clubesDe(comp: DatedCompetition): string[] {
  const set = new Set<string>();
  for (const m of comp.matches) { set.add(m.home); set.add(m.away); }
  return [...set].sort();
}

/** Club -> club que ocupa su lugar en el calendario de esa temporada. */
function permutacionDeClubes(clubes: string[], semilla: number): Map<string, string> {
  const rnd = mulberry32(semilla);
  const destino = [...clubes];
  for (let i = destino.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [destino[i], destino[j]] = [destino[j], destino[i]];
  }
  const m = new Map<string, string>();
  clubes.forEach((c, i) => m.set(c, destino[i]));
  return m;
}

/** Misma fecha, `anios` años después. El 29/2 cae en 28/2 los años no bisiestos. */
function sumarAnios(date: string, anios: number): string {
  const [a, m, d] = date.split('-').map(Number);
  const anio = a + anios;
  const ultimoDiaDelMes = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  const dia = Math.min(d, ultimoDiaDelMes);
  return `${anio}-${String(m).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/**
 * La competición tal como se juega en esa temporada de carrera (1 = la real, sin tocar).
 *
 * El calendario real cubre UNA temporada y una carrera dura 20+. Las siguientes reusan las FECHAS
 * reales corridas un año y resortean quién juega contra quién permutando los clubes. La permutación
 * es determinística (semilla = id de competición + temporada), así que el mismo save siempre ve el
 * mismo calendario, sin depender de Math.random().
 *
 * Permutar clubes en vez de generar un fixture nuevo tiene una ventaja concreta: el calendario
 * resultante es estructuralmente el real, así que sigue siendo válido para cualquier formato --
 * Apertura/Clausura, conferencias de la MLS, ligas con fechas impares -- sin modelar cada uno.
 */
const cachePorTemporada = new Map<string, DatedCompetition>();

export function competicionEnTemporada(comp: DatedCompetition, temporada: number): DatedCompetition {
  if (temporada === 1) return comp;
  const clave = `${comp.id}|${temporada}`;
  const cacheado = cachePorTemporada.get(clave);
  if (cacheado) return cacheado;

  const desplazamiento = temporada - 1;
  const perm = permutacionDeClubes(clubesDe(comp), hashTexto(comp.id) + temporada * 7919);
  const matches = comp.matches.map(m => ({
    ...m,
    date: sumarAnios(m.date, desplazamiento),
    home: perm.get(m.home) ?? m.home,
    away: perm.get(m.away) ?? m.away,
  }));
  const fechas = matches.map(m => m.date).sort();
  const generada = { ...comp, matches, firstDate: fechas[0] ?? null, lastDate: fechas[fechas.length - 1] ?? null };
  cachePorTemporada.set(clave, generada);
  return generada;
}

/** Todas las competiciones de una temporada dada. */
export function competicionesDeTemporada(temporada: number): DatedCompetition[] {
  return DATED_CALENDARS.map(c => competicionEnTemporada(c, temporada));
}

// --- PLAYOFFS DE LIGA (cuadrangulares de Colombia y Argentina) ----------------------------------
//
// Vive acá, y no en dateSchedule.ts, porque hace falta en los DOS lados: el calendario los marca
// para mostrarlos distinto, y el motor de tablas necesita EXCLUIRLOS al sumar puntos. dateSchedule
// importa leagueEngine, así que leagueEngine no puede importar dateSchedule; este módulo, que no
// importa nada más que datos, es el único lugar donde los dos alcanzan la misma respuesta.
//
// El caso: en el Apertura 2026 doce clubes juegan 19 fechas y se van a casa, ocho llegan a 21,
// cuatro a 23 y dos a 25 -- cuartos, semis y final a ida y vuelta. Sumando esas fechas a la misma
// tabla, el campeón salía de comparar 25 partidos contra 19.

// La lista de ligas de dos torneos vivía acá también, y decía "misma lista que en dateSchedule.ts
// y leagueEngine.ts" siendo que le faltaba México. Ahora sale de src/reglamentos.ts.

/** El semestre al que pertenece una fecha: 'Apertura', 'Clausura', o la liga entera si no se parte. */
function semestreDe(comp: DatedCompetition, date: string): string {
  if (!comp.league || !repartesDosTitulos(comp.league)) return comp.name;
  const [primero, segundo] = torneosDelAnio(comp.league);
  return Number(date.slice(5, 7)) <= 6 ? primero : segundo;
}

/** El valor que más se repite. Con empate gana el más chico: la fase regular es el piso. */
function moda(valores: number[]): number {
  const cuenta = new Map<number, number>();
  for (const v of valores) cuenta.set(v, (cuenta.get(v) ?? 0) + 1);
  let mejor = valores[0] ?? 0;
  let mejorN = -1;
  for (const [v, n] of [...cuenta].sort((a, b) => a[0] - b[0])) {
    if (n > mejorN) { mejor = v; mejorN = n; }
  }
  return mejor;
}

const cachePlayoffs = new Map<string, Set<number>>();

/**
 * Los ÍNDICES (dentro de `comp.matches`) de los partidos de PLAYOFF de esta competición.
 *
 * Índices y no fechas a propósito. `competicionEnTemporada` arma cada temporada mapeando la lista
 * original uno a uno -- misma longitud, mismo orden, sólo cambian los nombres y el año -- así que
 * la posición 384 es el mismo partido del cuadro en todas. Calculándolo por FECHA había que
 * rehacer la agrupación para cada una de las 32 temporadas, y eso llevó el armado del calendario
 * de 545 a 762 ms, por encima del tope de 600 que vigila el validador. Por índice se calcula una
 * sola vez, sobre la competición original.
 *
 * La regla sale de los DATOS y no de una suposición sobre el formato: la cantidad más común de
 * fechas por club en ese semestre es la fase regular, y lo que un club juegue por encima es
 * playoff. Funciona igual con 20 clubes que con 30, con zonas o sin ellas, y una liga donde todos
 * juegan lo mismo (Brasil, Premier) no marca nada -- medido, cero en las dos.
 */
export function partidosDePlayoff(comp: DatedCompetition): Set<number> {
  const cacheado = cachePlayoffs.get(comp.id);
  if (cacheado) return cacheado;

  const indices = new Set<number>();
  if (comp.kind === 'league') {
    // semestre -> club -> índices de sus partidos, en orden de fecha
    const porSemestre = new Map<string, Map<string, number[]>>();
    comp.matches.forEach((m, i) => {
      const s = semestreDe(comp, m.date);
      let clubes = porSemestre.get(s);
      if (!clubes) { clubes = new Map(); porSemestre.set(s, clubes); }
      for (const club of [m.home, m.away]) {
        const suyos = clubes.get(club);
        if (suyos) suyos.push(i); else clubes.set(club, [i]);
      }
    });

    for (const clubes of porSemestre.values()) {
      const cuentas = [...clubes.values()].map(is => is.length);
      if (cuentas.length < 4) continue;
      const regulares = moda(cuentas);
      if (!cuentas.some(n => n > regulares)) continue;
      for (const is of clubes.values()) {
        if (is.length <= regulares) continue;
        const enOrden = [...is].sort((a, b) => comp.matches[a].date.localeCompare(comp.matches[b].date));
        for (let k = regulares; k < enOrden.length; k++) indices.add(enOrden[k]);
      }
    }
  }
  cachePlayoffs.set(comp.id, indices);
  return indices;
}

/** La competición de LIGA de un conjunto de clubes, buscada por sus nombres. Null si no hay. */
export function ligaDeClubes(nombresDeClubes: Set<string>): DatedCompetition | null {
  let mejor: DatedCompetition | null = null;
  let mejorCoincidencias = 0;
  for (const comp of DATED_CALENDARS) {
    if (comp.kind !== 'league') continue;
    let coincidencias = 0;
    for (const club of clubesDe(comp)) if (nombresDeClubes.has(club)) coincidencias++;
    // Se exige mayoría: una copa nacional comparte clubes con la liga, y un par de coincidencias
    // sueltas no alcanzan para decir que ESTA es la liga de estos clubes.
    if (coincidencias > mejorCoincidencias && coincidencias >= nombresDeClubes.size / 2) {
      mejor = comp;
      mejorCoincidencias = coincidencias;
    }
  }
  return mejor;
}
