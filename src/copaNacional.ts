// Copa nacional: el torneo de eliminación directa que cruza Primera y Segunda.
//
// La Copa BetPlay no es una fase de grupos ni un par de partidos sueltos: son los 36 clubes del
// país (20 de Liga + 16 de Torneo) sorteados en un cuadro de eliminación directa a IDA Y VUELTA
// hasta la final. El calendario real importado solo traía los dos partidos del jugador contra un
// rival, así que ganar la llave no llevaba a ningún lado -- no había cuadro que avanzar ni campeón
// que coronar.
//
// Acá se arma el cuadro entero y se resuelve ronda por ronda con el mismo motor de llaves que ya
// usan los playoffs de Apertura/Clausura y la Champions (TwoLegBracket): global de los dos partidos
// y penales si termina igualado.

import type { Club, TwoLegBracket, TwoLegTie } from './types';

export interface DomesticCupState {
  /** Liga a la que pertenece la copa ('Colombiana'), para no cruzar países. */
  league: string;
  /** Año de carrera en el que se juega esta edición. */
  year: number;
  bracket: TwoLegBracket;
  championId: string | null;
  /** Clubes que entraron al sorteo, en el orden en que quedaron emparejados. */
  participants: string[];
}

/**
 * ¿Cuántos clubes entran al cuadro?
 *
 * Se recorta a la potencia de 2 más cercana por abajo para que el cuadro cierre sin byes: con 36
 * clubes se juegan 32, y los 4 que quedan afuera son los peor rankeados. Es lo que hace la Copa
 * BetPlay real con sus rondas previas, sin tener que modelarlas aparte.
 */
export function tamanoDelCuadro(n: number): number {
  let p = 2;
  while (p * 2 <= n) p *= 2;
  return p;
}

/**
 * Sorteo del cuadro. NO es un sembrado por ranking: en la copa nacional el sorteo es abierto, así
 * que un club de Segunda puede cruzarse con un grande en primera ronda -- que es justamente la
 * gracia del torneo.
 *
 * El orden sale de una permutación determinística por año, para que la misma carrera reproduzca
 * siempre el mismo cuadro (recargar la página no puede cambiar el rival que te tocó).
 */
function sortear(clubIds: string[], year: number): string[] {
  const arr = [...clubIds];
  // Generador congruencial simple, sembrado con el año: mismo año -> mismo sorteo.
  let semilla = year * 2654435761 % 2147483647;
  const siguiente = () => (semilla = (semilla * 48271) % 2147483647) / 2147483647;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(siguiente() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function armarRonda(clubIds: string[]): TwoLegTie[] {
  const ties: TwoLegTie[] = [];
  for (let i = 0; i < clubIds.length; i += 2) {
    ties.push({
      clubAId: clubIds[i], clubBId: clubIds[i + 1],
      firstLegGoalsA: null, firstLegGoalsB: null, secondLegGoalsA: null, secondLegGoalsB: null,
      played: false, winnerId: null,
    });
  }
  return ties;
}

/**
 * Arranca una edición de la copa con todos los clubes del país, de las dos divisiones.
 *
 * @param allClubs  Base completa; se filtran los de esa liga.
 * @param divisionDe Devuelve la división vigente del club (puede diferir de Club.division si hubo
 *                   ascensos: ver divisionOverrides).
 */
export function crearCopaNacional(
  league: string,
  year: number,
  allClubs: readonly Club[],
  divisionDe: (c: Club) => 1 | 2 = c => (c.division === 2 ? 2 : 1),
  /**
   * Clubes que arrancan el cuadro, si en vez de una edición desde cero hay que CONTINUAR una que
   * ya venía jugándose.
   *
   * El caso es la temporada 1: el calendario real de una copa nacional trae sólo las rondas que ya
   * estaban sorteadas al scrapear (el Santos tiene 4 fechas de Copa do Brasil y se acaban), así que
   * al agotarse hay que seguir el torneo desde donde quedó. Sin esto la única opción era arrancar
   * otra edición completa desde dieciseisavos, y el jugador terminaba disputando la misma copa dos
   * veces en el mismo año.
   *
   * Se recorta a la potencia de dos más cercana hacia abajo, así el cuadro siempre cierra en una
   * final y nadie recibe un pase libre inventado.
   */
  soloEstosClubes?: readonly string[],
): DomesticCupState {
  const delPais = allClubs.filter(c => c.league === league);
  // Los de Primera entran primero para que, al recortar, los que queden afuera sean de Segunda.
  const ordenados = [...delPais].sort((a, b) =>
    divisionDe(a) - divisionDe(b) || (b.reputation ?? 0) - (a.reputation ?? 0));
  const base = soloEstosClubes
    ? ordenados.filter(c => soloEstosClubes.includes(c.id))
    : ordenados;
  const entran = base.slice(0, tamanoDelCuadro(base.length)).map(c => c.id);
  const sorteados = sortear(entran, year);

  return {
    league,
    year,
    participants: sorteados,
    bracket: { tiesByRound: [armarRonda(sorteados)], championId: null },
    championId: null,
  };
}

/** El cruce del club en la ronda en curso, o null si ya quedó eliminado. */
export function cruceActual(cup: DomesticCupState, clubId: string): TwoLegTie | null {
  const ronda = cup.bracket.tiesByRound[cup.bracket.tiesByRound.length - 1];
  return ronda?.find(t => t.clubAId === clubId || t.clubBId === clubId) ?? null;
}

/** ¿El club sigue vivo en la copa? */
export function sigueEnCopa(cup: DomesticCupState, clubId: string): boolean {
  if (cup.championId) return cup.championId === clubId;
  const tie = cruceActual(cup, clubId);
  return !!tie && (!tie.played || tie.winnerId === clubId);
}

/**
 * Nombre de la ronda en curso, derivado de cuántas llaves quedan.
 *
 * Sale del tamaño del cuadro y no de un contador aparte, así no hay dos fuentes que puedan
 * desincronizarse.
 */
export function nombreDeRonda(ties: number): string {
  if (ties === 1) return 'Final';
  if (ties === 2) return 'Semifinal';
  if (ties === 4) return 'Cuartos de Final';
  if (ties === 8) return 'Octavos de Final';
  if (ties === 16) return 'Dieciseisavos';
  return `Ronda de ${ties * 2}`;
}

/** La ronda que se está jugando ahora, ya nombrada. */
export function rondaActual(cup: DomesticCupState): string {
  const ronda = cup.bracket.tiesByRound[cup.bracket.tiesByRound.length - 1];
  return nombreDeRonda(ronda?.length ?? 0);
}

/** ¿A este cruce le toca la ida o la vuelta? */
export function piernaDelCruce(tie: TwoLegTie): 'ida' | 'vuelta' {
  return tie.firstLegGoalsA === null ? 'ida' : 'vuelta';
}

/** Cómo se llama la copa nacional de ese país. Sin entrada, el genérico. */
const NOMBRES: Record<string, string> = {
  Colombiana: 'Copa BetPlay',
  Argentina: 'Copa Argentina',
  Brasileña: 'Copa do Brasil',
  Inglesa: 'FA Cup',
  Española: 'Copa del Rey',
  Italiana: 'Coppa Italia',
  Alemana: 'DFB-Pokal',
  Francesa: 'Coupe de France',
  Holandesa: 'KNVB Beker',
  Portuguesa: 'Taça de Portugal',
  // Las siete de abajo se activaron el 12 de agosto de 2026, al cargar sus calendarios (estaban en
  // data/calendarios/copas/ sin usar). El nombre TIENE que coincidir exacto con el `name` de la
  // competición en realCalendarDates.ts: es la llave con la que el calendario decide a qué copa
  // reservarle fechas, y con otro nombre el país se queda sin copa en silencio.
  Chilena: 'Copa Chile',
  Ecuatoriana: 'Copa Ecuador',
  Boliviana: 'Copa Bolivia',
  Uruguaya: 'Copa Uruguay',
  Venezolana: 'Copa Venezuela',
  Mexicana: 'Copa MX',
  Estadounidense: 'US Open Cup',
  Paraguaya: 'Copa Paraguay',
  Peruana: 'Copa de la Liga',
};

export function nombreCopaNacional(league: string): string {
  return NOMBRES[league] ?? 'Copa Nacional';
}

/**
 * ¿Este país tiene el bracket real de la copa nacional (este archivo) implementado?
 *
 * Para las ligas SIN entrada acá, el calendario semanal legado (ver realSchedule.ts/realCalendar.ts)
 * sigue siendo la única fuente de partidos de copa nacional que existe -- no hay bracket que lo
 * reemplace. Pero para las 10 ligas de NOMBRES, el legado es un calendario semanal fijo de 2024 sin
 * eliminación real (todos los "round" son "Schedule", no hay Final ni campeón), mientras que el
 * bracket de este archivo SÍ elimina, define ida/vuelta y corona. Antes App.tsx dejaba correr el
 * legado primero para todo club con hasRealSchedule=true, así que el bracket real nunca se
 * ejecutaba para ninguno de esos clubes -- Barranquilla FC jugaba "Copa Colombia" contra un rival
 * fijo semanal para siempre, sin cuadro, sin ida y vuelta y sin poder salir campeón nunca.
 */
export function tieneCopaNacionalReal(league: string): boolean {
  return league in NOMBRES;
}
