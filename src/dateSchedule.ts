// Calendario por FECHAS REALES: qué juega un club cada día, en vez de cada semana.
//
// El motor viejo modelaba el tiempo en semanas y permitía UN partido por semana. Con eso la liga
// disponía de ~31 de las 52 semanas del año (isCupWeek se quedaba con 2 de cada 5), pero la liga
// colombiana necesita 40 fechas por año entre Apertura y Clausura. Faltaban ~9: por eso la tabla se
// congelaba y las copas no cerraban.
//
// Los datos reales lo confirman: en los 20 clubes de Colombia hay 253 semanas con 2+ partidos y
// picos de 4 (liga el domingo, Libertadores el jueves). Ninguno de esos partidos entraba.
//
// Acá la unidad es el DÍA. Cada partido está anclado a su fecha, y una misma semana puede tener
// tantos partidos como tenga en la realidad.

import { DATED_CALENDARS, type DatedCompetition, type DatedMatch } from './realCalendarDates';
import { CAREER_START_YEAR, getSeasonYear } from './leagueEngine';
import { CAREER_START_DATE, MAX_TEMPORADAS, competicionEnTemporada } from './seasonCalendar';

export interface DatedFixture {
  competition: DatedCompetition;
  match: DatedMatch;
  date: string;      // YYYY-MM-DD
  isHome: boolean;
  opponentName: string;
  /**
   * Temporada de carrera a la que pertenece (1 = el calendario real; 2+ = generadas).
   *
   * Hace falta porque fixturesForClub devuelve TODAS las temporadas concatenadas: sin esto, "el
   * último partido de la copa" salía ser el de 2057 en vez del de este año, y ninguna copa coronaba
   * campeón. Bug reportado: "gané ambos partidos de la Superliga y no me dijo que quedé campeón".
   */
  temporada: number;
}

// Se re-exporta para no romper a los módulos que ya la importaban de acá; la definición vive en
// seasonCalendar.ts, que es de donde la toma también leagueEngine sin crear un ciclo.
export { CAREER_START_DATE };

const MS_POR_DIA = 86_400_000;

/** Fecha (YYYY-MM-DD) del día N de carrera. day=1 es CAREER_START_DATE. */
export function dateForDay(day: number): string {
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  return new Date(base + (day - 1) * MS_POR_DIA).toISOString().slice(0, 10);
}

/** Día de carrera de una fecha. Inverso de dateForDay. */
export function dayForDate(date: string): number {
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  return Math.round((Date.parse(`${date}T00:00:00Z`) - base) / MS_POR_DIA) + 1;
}

// Índice club -> partidos de UNA temporada, ordenados por fecha. Se cachea por temporada: recorrer
// los 7808 partidos en cada avance de día se nota en móvil.
const indicePorTemporada = new Map<number, Map<string, DatedFixture[]>>();

function getIndice(temporada = 1): Map<string, DatedFixture[]> {
  const cacheado = indicePorTemporada.get(temporada);
  if (cacheado) return cacheado;

  const indice = new Map<string, DatedFixture[]>();
  const agregar = (club: string, fx: DatedFixture) => {
    const lista = indice.get(club);
    if (lista) lista.push(fx);
    else indice.set(club, [fx]);
  };

  for (const original of DATED_CALENDARS) {
    // De la temporada 2 en adelante, las COPAS no salen del calendario: las arma el cuadro del
    // motor (copaNacional.ts y getOrCreateCupState).
    //
    // El generador de temporadas permuta los clubes del calendario real y le corre las fechas un
    // año. Para una LIGA eso es perfecto: la estructura del round-robin se conserva intacta --
    // medido, 380 partidos, 38 por club y cada par exactamente dos veces, en la temporada 1, la 2
    // y la 5.
    //
    // Para una copa de eliminación no significa nada. El calendario real de una copa es una foto
    // PARCIAL (sólo las rondas ya sorteadas al scrapear) y además su forma la decidieron los
    // resultados de ese año: quién llegó a la final jugó cinco partidos y el eliminado en primera
    // ronda, uno. Al permutar nombres sobre esa forma, el club al que le toca el lugar del
    // finalista juega cinco partidos TODAS las temporadas y el que hereda el lugar del eliminado
    // juega uno, sin importar qué tan bueno sea. Medido en la Copa do Brasil: 46 partidos y entre
    // 1 y 5 por club, idéntico en las temporadas 1, 2 y 5. No es una copa, es un fragmento
    // congelado repartido al azar -- sin final y sin campeón posible.
    //
    // La temporada 1 sí conserva sus cruces reales: son de verdad hasta donde llegan.
    if (temporada >= 2 && original.kind !== 'league') continue;
    const comp = competicionEnTemporada(original, temporada);
    for (const match of comp.matches) {
      // En la temporada 1 se descartan las fechas anteriores al arranque de la carrera (media
      // temporada europea ya jugada). De la 2 en adelante todas las fechas son futuras.
      if (temporada === 1 && match.date < CAREER_START_DATE) continue;
      agregar(match.home, { competition: comp, match, date: match.date, isHome: true, opponentName: match.away, temporada });
      agregar(match.away, { competition: comp, match, date: match.date, isHome: false, opponentName: match.home, temporada });
    }
  }
  for (const lista of indice.values()) lista.sort((a, b) => a.date.localeCompare(b.date));
  indicePorTemporada.set(temporada, indice);
  return indice;
}

/** Las fechas distintas de una lista de partidos: dos partidos el mismo día son UN paso. */
function fechasDistintas(fixtures: DatedFixture[]): string[] {
  const fechas: string[] = [];
  for (const f of fixtures) if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);
  return fechas;
}

/** ¿Este club tiene calendario con fechas reales? */
export function hasDatedSchedule(clubName: string): boolean {
  return (getIndice().get(clubName)?.length ?? 0) > 0;
}

/**
 * ¿Este club tiene calendario real de LIGA (no solo copa)?
 *
 * Los clubes de Segunda como Barranquilla FC o Real Cartagena figuran con calendario propio por dos
 * fechas sueltas de Copa BetPlay -- hasDatedSchedule da true -- pero su LIGA entera la corre el
 * motor por semanas, sin fechas reales. Todo lo que decide "qué fecha/rival es AHORA" (el reloj de
 * la carrera, la tarjeta de próximo partido, el paso de la semana) tiene que usar esta función y no
 * hasDatedSchedule: con la genérica, fixturesAtStep(club, 1) devolvía el primer partido REAL que
 * tiene el club -- la Copa BetPlay de julio -- y la carrera "arrancaba" en julio en vez de enero.
 * Bug reportado: "por que inicia la carrera alli y no en enero?".
 */
export function hasDatedLeagueSchedule(clubName: string): boolean {
  return fixturesForClub(clubName).some(f => f.competition.kind === 'league');
}

/** Todos los partidos del club, en orden cronológico. */
export function fixturesForClub(clubName: string): DatedFixture[] {
  const cacheado = todasLasTemporadasPorClub.get(clubName);
  if (cacheado) return cacheado;

  // Se concatenan TODAS las temporadas, no solo la real. Antes esto devolvía únicamente la
  // temporada 1 y por eso, a partir de enero de 2027, la pantalla de Calendario se veía vacía
  // aunque el club sí tuviera partidos: fixturesAtStep ya recorría las temporadas generadas, pero
  // todo lo que lista fechas (el calendario, pasoDeFecha, esUltimaFechaDelTorneo) seguía mirando
  // solo la primera. Bug reportado: "después de la primera temporada el calendario se ve vacío".
  //
  // El orden queda cronológico solo, porque cada temporada va corrida un año respecto de la
  // anterior; es el mismo orden en el que fixturesAtStep numera los pasos, así que los índices de
  // las dos funciones siguen coincidiendo.
  const todas: DatedFixture[] = [];
  for (let temporada = 1; temporada <= MAX_TEMPORADAS; temporada++) {
    const deLaTemporada = getIndice(temporada).get(clubName);
    if (deLaTemporada) todas.push(...deLaTemporada);
    else if (temporada === 1) break; // sin calendario real: no hay nada que generar
  }
  todasLasTemporadasPorClub.set(clubName, todas);
  return todas;
}

// fixturesForClub se llama en cada render de varias pantallas; armar las 32 temporadas cada vez se
// nota en móvil.
const todasLasTemporadasPorClub = new Map<string, DatedFixture[]>();

/**
 * Los partidos de un club en un día concreto.
 *
 * Casi siempre es 0 o 1, pero se devuelve lista porque nada impide que un club tenga dos partidos
 * el mismo día en los datos, y descartar en silencio es peor que mostrarlos.
 */
export function fixturesOnDate(clubName: string, date: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date === date);
}

/** El próximo partido del club en o después de `date`. */
export function nextFixture(clubName: string, date: string): DatedFixture | null {
  return fixturesForClub(clubName).find(f => f.date >= date) ?? null;
}

/** Partidos del club dentro de un rango de fechas, inclusive. */
export function fixturesBetween(clubName: string, desde: string, hasta: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date >= desde && f.date <= hasta);
}

/**
 * Cuántos días hay que avanzar desde `date` para llegar al próximo partido del club.
 *
 * Es lo que reemplaza al "avanzar una semana": en vez de saltar 7 días fijos, se salta hasta el
 * siguiente partido real. Devuelve null si el club ya no tiene más partidos.
 */
export function daysUntilNextFixture(clubName: string, date: string): number | null {
  const prox = nextFixture(clubName, date);
  if (!prox) return null;
  return dayForDate(prox.date) - dayForDate(date);
}

/**
 * El paso de carrera en el que cae una fecha de este club, o null si no juega ese día.
 *
 * Sirve para saber si un partido del calendario ya se jugó: su paso es menor al actual.
 */
export function pasoDeFecha(clubName: string, date: string): number | null {
  // Mismo filtro que fixturesAtStep: si una cuenta desde el arranque de la carrera y la otra desde
  // el principio del calendario, los pasos no coinciden y el calendario en pantalla marca como
  // "ya jugado" un partido que todavía no llegó (o al revés).
  const fechas: string[] = [];
  for (const f of fixturesForClub(clubName)) {
    if (f.date < CAREER_START_DATE) continue;
    if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);
  }
  const i = fechas.indexOf(date);
  return i < 0 ? null : i + 1;
}

/**
 * Cuántas fechas de LIGA (no copa) del calendario real ya se jugaron antes de `currentWeek`.
 *
 * El motor sintético de Apertura/Clausura (getOrCreateApeturaClausuraSeason) cuenta su catch-up en
 * "pasos" = casi una semana de carrera cada uno (apeturaClausuraStepsElapsed), sin distinguir liga
 * de copa -- currentWeek=32 contaba 31 pasos de liga sintética transcurridos. Pero el calendario
 * REAL intercala fechas de copa entre las de liga (Libertadores, Copa Colombia): de esos 32 pasos
 * reales del club, solo 24 eran de liga. El motor sintético avanzaba 7 pasos de MÁS -- de fondo,
 * sin el jugador -- y resolvía toda una ronda de knockout (ida y vuelta) antes de que el calendario
 * real llegara a esa fecha. El jugador veía en pantalla su partido real de Cuartos (con fecha y
 * rival de Transfermarkt) mientras el motor, por detrás, ya había resuelto Cuartos Y Semifinal
 * solo, y lo que el jugador terminaba jugando quedaba desincronizado del estado real de la llave.
 * Bug reportado: "me dio el campeonaao y habiamos empatado en el global, y el global nunca
 * aparecio" -- el global mostrado (si se mostraba) era el de una llave que ya no era la vigente.
 *
 * Se usa para topar el currentWeek que se le pasa al motor sintético: nunca debe avanzar el
 * catch-up de knockout más allá de las fechas de liga que el calendario real ya cubrió.
 */
export function fechasDeLigaTranscurridas(clubName: string, currentWeek: number): number {
  let n = 0;
  for (let w = 1; w < currentWeek; w++) {
    const paso = fixturesAtStep(clubName, w);
    if (paso && paso.fixtures.some(f => f.competition.kind === 'league')) n++;
  }
  return n;
}

/**
 * En Colombia y Argentina el año tiene DOS torneos de liga, no uno: el Apertura (enero a junio) y
 * el Clausura (julio a noviembre), cada uno con su campeón. Decir solo "Primera División" deja al
 * jugador sin saber cuál está jugando ni cuál puede ganar.
 *
 * El corte sale de las fechas reales: entre el último partido del Apertura (8 de junio) y el
 * primero del Clausura (24 de julio) hay un parón de 46 días.
 */
export function torneoDeFecha(competition: DatedCompetition, date: string): string {
  if (competition.kind !== 'league') return competition.name;
  // El corte por mes solo vale donde el año tiene DOS torneos. Las ligas europeas van de agosto a
  // mayo -- la temporada cruza el año -- así que partirlas por junio daba dos torneos donde hay
  // uno: LaLiga quedaba con un cierre falso el 21 de diciembre, coronando campeón a mitad de
  // temporada. Se detecta por la forma del calendario, no por una lista de ligas.
  if (!esCalendarioDeDosTorneos(competition)) return competition.name;
  const mes = Number(date.slice(5, 7));
  return mes <= 6 ? 'Apertura' : 'Clausura';
}

/**
 * Ligas que reparten DOS títulos por año (Apertura y Clausura).
 *
 * Va como lista explícita a propósito. Se intentó deducirlo de la forma del calendario y no se
 * puede: el Brasileirão va de enero a diciembre igual que la Liga BetPlay, y los dos tienen un
 * parón de mitad de año de 46 días exactos. Por forma son idénticos, pero Brasil corona UN campeón
 * y Colombia DOS. Deducirlo partía el Brasileirão en dos y coronaba dos campeones inventados.
 *
 * Es la misma lista que isApeturaClausuraLeague en leagueEngine, y tiene que seguir coincidiendo:
 * acá no se importa para no crear una dependencia circular entre los dos módulos.
 */
const LIGAS_DE_DOS_TORNEOS = new Set(['Colombiana', 'Argentina']);

function esCalendarioDeDosTorneos(competition: DatedCompetition): boolean {
  return LIGAS_DE_DOS_TORNEOS.has(competition.league);
}

/**
 * ¿Con este partido el club cierra su torneo de liga?
 *
 * En las ligas de Apertura/Clausura hay DOS cierres por año, no uno: el último partido de junio
 * corona el Apertura y el de noviembre el Clausura. Sin esto el campeón salía de `fixtures` del
 * motor, que tiene su propio calendario más corto (20 partidos contra los 44 reales del Nacional)
 * y nunca coincidía con el cierre real -- se terminaba el Apertura ganando todo y no se coronaba
 * a nadie.
 *
 * En las ligas de temporada corrida devuelve true solo en el último partido del año.
 */
export function esUltimaFechaDelTorneo(clubName: string, date: string): boolean {
  const deLiga = fixturesForClub(clubName).filter(f => f.competition.kind === 'league');
  if (!deLiga.length) return false;

  const esteFixture = deLiga.find(f => f.date === date);
  if (!esteFixture) return false;

  // Misma razón que en esUltimoPartidoDeLaCopa: hay que quedarse dentro de la temporada en curso,
  // o el "último partido del torneo" cae siempre en la última temporada generada.
  const torneo = torneoDeFecha(esteFixture.competition, date);
  const mismos = deLiga.filter(f =>
    f.temporada === esteFixture.temporada && torneoDeFecha(f.competition, f.date) === torneo);
  return mismos[mismos.length - 1]?.date === date;
}

/**
 * ¿Ya se jugó la última fecha real de LIGA de este club, y el paso actual quedó después de ella?
 *
 * Sirve para "Finalizar Temporada" (Dashboard.tsx). fixturesAtStep(club, currentWeek) da null tanto
 * si el calendario real se agotó como si todavía no arrancó (currentWeek=1) -- no alcanza por sí
 * solo. Y no sirve contar solo las fechas de kind='league' contra currentWeek: fixturesAtStep
 * numera los PASOS mezclando liga y copa (un club con 38 fechas de liga puede tener 40 pasos
 * totales con las 2 de copa intercaladas), así que comparar currentWeek contra "38" adelantaba el
 * cierre dos pasos antes de la fecha real. Se cuenta el paso exacto en el que cae la ÚLTIMA fecha
 * de liga -- ver pasoDeFecha -- y se compara currentWeek contra ESE paso, no contra la cantidad de
 * fechas de liga.
 *
 * No se usa getRealDate(currentWeek) como fecha de referencia a propósito: ese reloj cuenta
 * semanas sintéticas de 52 por año, sin relación con los pasos reales de un calendario que puede
 * tener más o menos de 52 -- comparar contra él daba falsos negativos.
 */
export function calendarioDeLigaAgotado(clubName: string, currentWeek: number): boolean {
  // Se mira SOLO la temporada en curso. Antes se tomaba la última fecha de liga de todo
  // fixturesForClub, que desde que concatena las 32 temporadas es una fecha de 2057: el paso actual
  // nunca la superaba y "Finalizar Temporada" no aparecía nunca más.
  const t = temporadaDelPaso(clubName, currentWeek);
  if (!t) return false;

  const deLiga = fixturesForClub(clubName).filter(f =>
    f.competition.kind === 'league' && f.temporada === t.temporada && f.date >= CAREER_START_DATE);
  if (!deLiga.length) return false;

  const pasoDeLaUltima = pasoDeFecha(clubName, deLiga[deLiga.length - 1].date);
  if (pasoDeLaUltima === null) return false;
  return currentWeek > pasoDeLaUltima;
}

/** El torneo de liga que el club juega en esa fecha ('Apertura', 'Clausura' o el nombre de la liga). */
export function torneoDelClubEnFecha(clubName: string, date: string): string | null {
  const f = fixturesForClub(clubName).find(x => x.date === date && x.competition.kind === 'league');
  return f ? torneoDeFecha(f.competition, date) : null;
}

/**
 * El año calendario del paso actual, sacado de la FECHA del partido.
 *
 * getSeasonYear cuenta semanas de 52, pero con calendario real un paso es una FECHA CON PARTIDO, no
 * una semana: el Junior juega 54 pasos en todo 2026, así que a partir del paso 53 el contador de
 * semanas creía que ya era el año 2 y los últimos partidos del Clausura quedaban fechados en 2027
 * (el título salía como "Clausura 2027" jugándose el 8 de noviembre de 2026).
 *
 * Devuelve null si el club no tiene calendario real o si ya lo agotó: ahí manda getSeasonYear.
 */
export function anioDelPaso(clubName: string, step: number): number | null {
  const paso = fixturesAtStep(clubName, step);
  return paso ? Number(paso.date.slice(0, 4)) : null;
}

/** Un partido cuya ronda es la final del torneo. Las rondas vienen del calendario importado. */
function esRondaFinal(round: string | undefined): boolean {
  if (!round) return false;
  const r = round.toLowerCase();
  // "Final (Vuelta)" cuenta; "Semifinal" y "Cuartos de Final" NO -- de ahí el \b y el descarte
  // explícito de semi, que contiene la palabra "final" adentro.
  if (/semi|cuartos|octavos|dieciseisavos|ronda/.test(r)) return false;
  return /\bfinal\b/.test(r);
}

/**
 * ¿Este partido corona al campeón de esa copa?
 *
 * El motor no lleva las llaves de las copas del calendario real, así que no hay bracket que
 * consultar: hay que deducirlo del propio calendario. Se exige que el partido sea **la final**,
 * identificada por el nombre de la ronda que trae el calendario importado.
 *
 * ANTES alcanzaba con que fuera tu ÚLTIMO partido de la copa, y eso coronaba campeones falsos: la
 * Copa Libertadores del juego son 34 partidos de fase de grupos, sin una sola llave cargada, así
 * que el último partido del grupo pasaba por final y ganarlo te daba la copa. Igual la Copa BetPlay
 * y la Copa do Brasil. Solo las copas con rondas nombradas (Copa del Rey, FA Cup, DFB-Pokal,
 * Coppa Italia, EFL) pueden coronar, y solo en la ronda que se llama "Final".
 *
 * Con ida y vuelta marca solo la VUELTA, que es donde se define.
 */
export function esUltimoPartidoDeLaCopa(clubName: string, competitionId: string, date: string): boolean {
  const todosLosAnios = fixturesForClub(clubName).filter(f => f.competition.id === competitionId);
  // Acotar a la temporada de ESTA fecha: fixturesForClub concatena las 32 temporadas, así que sin
  // esto "el último partido de la copa" era el de 2057 y ninguna edición coronaba campeón.
  const temporadaDeHoy = todosLosAnios.find(f => f.date === date)?.temporada;
  if (temporadaDeHoy === undefined) return false;
  const delTorneo = todosLosAnios.filter(f => f.temporada === temporadaDeHoy);
  if (!delTorneo.length) return false;

  const finales = delTorneo.filter(f => esRondaFinal(f.match.round));
  if (finales.length) {
    // La ida de la final no corona: solo la última.
    return finales[finales.length - 1].date === date;
  }

  // Sin rondas nombradas hay que mirar la FORMA del torneo. Un torneo entero de dos clubes es una
  // final de ida y vuelta y nada más -- la Superliga de Colombia son exactamente 2 partidos entre
  // Junior y Santa Fe --, así que su último partido sí corona. Es distinto de la Libertadores, que
  // son 34 partidos entre 21 clubes de pura fase de grupos: ahí el último partido del grupo no
  // define nada y coronarlo daba campeones falsos.
  const clubes = new Set<string>();
  for (const f of todasLasFechas(competitionId)) { clubes.add(f.home); clubes.add(f.away); }
  if (clubes.size === 2) {
    return delTorneo[delTorneo.length - 1].date === date;
  }

  // Cualquier otro torneo sin rondas: no se puede saber dónde estuvo la final, no se corona a
  // nadie. Es preferible quedarse sin campeón a inventar uno por ganar un partido de grupos.
  return false;
}

/** Todos los partidos de una competición, sin filtrar por club. */
function todasLasFechas(competitionId: string): DatedMatch[] {
  return DATED_CALENDARS.find(c => c.id === competitionId)?.matches ?? [];
}

/**
 * Las fechas ANTERIORES de la misma llave: la ida de la final que se define en `date`.
 *
 * Hace falta para sumar el global -- una final de ida y vuelta se gana por la suma de los dos
 * partidos, no por el de vuelta. El criterio es el mismo rival en la misma competición, mirando
 * hacia atrás desde la vuelta.
 *
 * Devuelve solo fechas pasadas, nunca la propia `date`.
 */
export function partidosDeLaMismaLlave(clubName: string, competitionId: string, date: string): string[] {
  const delTorneo = fixturesForClub(clubName).filter(f => f.competition.id === competitionId);
  const vuelta = delTorneo.find(f => f.date === date);
  if (!vuelta) return [];
  // Acotado a la MISMA temporada: fixturesForClub concatena las 32, y como la Superliga vuelve a
  // jugarse cada enero contra un rival que puede repetirse, sin este filtro la ida de 2026 entraba
  // en el global de la final de 2027 y el marcador global salía inflado.
  return delTorneo
    .filter(f => f.temporada === vuelta.temporada && f.date < date && f.opponentName === vuelta.opponentName)
    .map(f => f.date);
}

/** Todas las competiciones en las que participa el club, sumando todas las temporadas. */
export function competitionsForClub(clubName: string): DatedCompetition[] {
  const vistas = new Map<string, DatedCompetition>();
  for (const f of fixturesForClub(clubName)) vistas.set(f.competition.id, f.competition);
  return [...vistas.values()];
}

/**
 * Las competiciones del club en UNA temporada concreta.
 *
 * Hace falta desde que las copas dejaron de salir del calendario a partir de la temporada 2: la
 * versión que suma todas las temporadas responde "sí, el calendario cubre esa copa" por lo que
 * había en la temporada 1, y con eso el motor no le arma el cuadro en la 2 -- el club se queda sin
 * copa. La pregunta correcta es siempre por el año en curso.
 */
export function competitionsForClubInSeason(clubName: string, temporada: number): DatedCompetition[] {
  const vistas = new Map<string, DatedCompetition>();
  for (const f of getIndice(temporada).get(clubName) ?? []) vistas.set(f.competition.id, f.competition);
  return [...vistas.values()];
}

// Prioridad cuando hay varios partidos el mismo día: una final continental pesa más que una fecha
// de liga.
const PRIORIDAD: Record<string, number> = {
  national_tournament: 4,
  continental_cup: 3,
  domestic_cup: 2,
  league: 1,
};

/** Si hay más de un partido el mismo día, cuál se le muestra al jugador. */
export function pickPrimary(fixtures: DatedFixture[]): DatedFixture | null {
  if (!fixtures.length) return null;
  return [...fixtures].sort(
    (a, b) => (PRIORIDAD[b.competition.kind] ?? 0) - (PRIORIDAD[a.competition.kind] ?? 0),
  )[0];
}

/**
 * Lo que le toca jugar al club en el paso N de su carrera.
 *
 * Solo cuentan las fechas DESDE el arranque de la carrera. Sin ese filtro, un club europeo empezaba
 * a jugar en el pasado: la temporada de LaLiga arranca en agosto de 2025 y la carrera el 12 de enero
 * de 2026, así que el paso 1 del Barcelona era Barcelona-Mallorca del 16 de agosto de 2025 y el
 * jugador se comía media temporada ya jugada antes de llegar a su primer partido "real".
 *
 * Un "paso" es una FECHA con partido, no una semana. Ésa es toda la diferencia con el motor viejo:
 * si el club juega liga el domingo y copa el jueves, son dos pasos distintos en vez de una sola
 * semana donde uno de los dos se perdía.
 *
 * Devuelve null cuando el club ya agotó su calendario real; el motor sigue avanzando por su cuenta.
 */
export function fixturesAtStep(clubName: string, step: number): { date: string; fixtures: DatedFixture[] } | null {
  if (step < 1) return null;
  // Los pasos se numeran de corrido a través de las temporadas: si la temporada 1 tiene 42 fechas,
  // el paso 43 es la primera fecha de la temporada 2. Así el reloj de la carrera nunca se queda sin
  // calendario y no hace falta un motor paralelo que tome el relevo.
  let restante = step;
  for (let temporada = 1; temporada <= MAX_TEMPORADAS; temporada++) {
    const todas = getIndice(temporada).get(clubName) ?? [];
    if (!todas.length) {
      // Un club sin fechas en la temporada 1 no tiene calendario real: no hay nada que recorrer.
      if (temporada === 1) return null;
      continue;
    }
    const fechas = fechasDistintas(todas);
    if (restante <= fechas.length) {
      const date = fechas[restante - 1];
      return { date, fixtures: todas.filter(f => f.date === date) };
    }
    restante -= fechas.length;
  }
  return null;
}

/** En qué temporada de carrera cae un paso, y cuál es el primer paso de esa temporada. */
export function temporadaDelPaso(clubName: string, step: number): { temporada: number; primerPaso: number } | null {
  if (step < 1) return null;
  let restante = step;
  let primerPaso = 1;
  for (let temporada = 1; temporada <= MAX_TEMPORADAS; temporada++) {
    const todas = getIndice(temporada).get(clubName) ?? [];
    if (!todas.length) {
      if (temporada === 1) return null;
      continue;
    }
    const fechas = fechasDistintas(todas);
    if (restante <= fechas.length) return { temporada, primerPaso };
    restante -= fechas.length;
    primerPaso += fechas.length;
  }
  return null;
}
