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
// copaNacional sólo importa ./types, así que no hay ciclo posible en esta dirección.
import { nombreCopaNacional } from './copaNacional';

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
  /**
   * Fecha RESERVADA para la copa: el día está apartado, pero el rival lo decide el cuadro del motor
   * (copaNacional.ts), no el calendario. Ver RESERVAS DE COPA más abajo.
   *
   * `opponentName` en estos casos es un cartel de relleno y no debe usarse para buscar un club.
   */
  esReservaDeCuadro?: boolean;
}

// Se re-exporta para no romper a los módulos que ya la importaban de acá; la definición vive en
// seasonCalendar.ts, que es de donde la toma también leagueEngine sin crear un ciclo.
export { CAREER_START_DATE };

const MS_POR_DIA = 86_400_000;

// Las dos conversiones de abajo se llaman decenas de miles de veces al armar el calendario (el
// reparto de fechas de copa recorre ventanas de meses día por día), y tanto Date.parse como
// toISOString son caros. Con memo el conjunto de valores distintos es chico -- unas 10.000 fechas
// para las 32 temporadas -- y se reusa entre clubes de la misma liga, que juegan los mismos días.
const diaPorFecha = new Map<string, number>();
const fechaPorDia = new Map<number, string>();

/** Fecha (YYYY-MM-DD) del día N de carrera. day=1 es CAREER_START_DATE. */
export function dateForDay(day: number): string {
  const cacheado = fechaPorDia.get(day);
  if (cacheado !== undefined) return cacheado;
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  const fecha = new Date(base + (day - 1) * MS_POR_DIA).toISOString().slice(0, 10);
  fechaPorDia.set(day, fecha);
  return fecha;
}

/** Día de carrera de una fecha. Inverso de dateForDay. */
export function dayForDate(date: string): number {
  const cacheado = diaPorFecha.get(date);
  if (cacheado !== undefined) return cacheado;
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  const dia = Math.round((Date.parse(`${date}T00:00:00Z`) - base) / MS_POR_DIA) + 1;
  diaPorFecha.set(date, dia);
  return dia;
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

  // Las copas que corren por cuadro se juntan acá y se resuelven en una SEGUNDA pasada: para
  // reservarle fechas a un club hay que saber primero qué días tiene ya ocupados.
  const conCuadro: DatedCompetition[] = [];

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
    // REVERTIDO (11 ago 2026). Acá se filtraban las copas desde la temporada 2 para que las armara
    // el cuadro del motor, y el efecto real fue dejar a esos clubes SIN copas.
    //
    // El motivo: fixturesAtStep mapea el paso N a la N-ésima FECHA del club, corrido entre
    // temporadas, así que un club con calendario real tiene partido en todos los pasos. Medido en
    // la temporada 2: 52 pasos, 52 con liga, 0 libres. La rama que ofrece el partido del cuadro
    // exige `!datedPrimary` -- que nunca se cumple -- así que el bracket no llegaba a jugar nunca.
    //
    // El arreglo de verdad no es filtrar: es RESERVARLES fechas en el calendario, para que liga y
    // copa corran por el mismo reloj y pickPrimary elija entre las dos cuando caen el mismo día
    // (que es exactamente como funciona la temporada 1). Es lo que hace la segunda pasada de abajo.
    const comp = competicionEnTemporada(original, temporada);

    if (usaCuadroDelMotor(original)) {
      conCuadro.push(comp);
      // Temporada 1: los partidos de copa REALES se juegan igual -- rival, ronda y fecha salen de
      // Transfermarkt, y esa es la mejor materia prima que hay. Lo que se agrega después son las
      // fechas para CONTINUAR el torneo cuando el fragmento scrapeado se acaba.
      // Temporada 2+: no hay nada real que conservar (la permutación repartía un fragmento
      // congelado), así que la copa entera sale del cuadro.
      if (temporada !== 1) continue;
    }

    for (const match of comp.matches) {
      // En la temporada 1 se descartan las fechas anteriores al arranque de la carrera (media
      // temporada europea ya jugada). De la 2 en adelante todas las fechas son futuras.
      if (temporada === 1 && match.date < CAREER_START_DATE) continue;
      agregar(match.home, { competition: comp, match, date: match.date, isHome: true, opponentName: match.away, temporada });
      agregar(match.away, { competition: comp, match, date: match.date, isHome: false, opponentName: match.home, temporada });
    }
  }
  // Las reservas se calculan ANTES de ordenar y se ordena una sola vez al final: ordenar el índice
  // entero dos veces por temporada, con 32 temporadas, se nota al abrir el juego.
  for (const comp of conCuadro) reservarFechasDeCopa(comp, temporada, indice, agregar);
  for (const lista of indice.values()) lista.sort((a, b) => a.date.localeCompare(b.date));

  indicePorTemporada.set(temporada, indice);
  return indice;
}

// --- RESERVAS DE COPA -------------------------------------------------------------------------
//
// El calendario real de una copa nacional no es un torneo: es un FRAGMENTO. Sólo trae las rondas
// que ya estaban sorteadas el día que se scrapeó, y su forma la decidieron los resultados de ese
// año. Medido en la Copa do Brasil: 46 partidos entre 33 clubes, de 1 a 5 por club. En la Copa del
// Rey, 12 partidos entre 16 clubes.
//
// De ahí salían dos cosas que el jugador reportó:
//   - La copa se terminaba sola: "gané esos partidos de la Copa do Brasil pero en el calendario
//     jamás salió mi siguiente rival".
//   - Nadie salía campeón nunca. Medido antes de este cambio con `npm run validar:copas`:
//     0 de 12 ediciones coronaron a alguien, en cuatro países distintos.
//
// El motor SÍ tiene un cuadro de verdad (copaNacional.ts): los clubes del país, ida y vuelta,
// eliminación real y campeón. Nunca llegaba a usarse, porque fixturesAtStep numera los pasos por
// FECHA CON PARTIDO -- un club con calendario real tiene partido en TODOS los pasos -- y la rama de
// App.tsx que ofrece el cuadro exigía un paso libre que no existía jamás.
//
// La salida no es sacar la copa del calendario: eso ya se intentó (ver el comentario largo de
// arriba) y dejó a los clubes sin ninguna copa. Es al revés. El calendario le RESERVA días a la
// copa; el cuadro decide contra quién se juega. Cada pregunta con una sola fuente, y las dos
// corriendo por el mismo reloj.

/**
 * Fechas de copa que se le apartan a cada club por temporada.
 *
 * Es UNA SOLA BOLSA para todas las copas, no una por torneo. El día queda apartado y, cuando llega,
 * el juego pregunta en orden: ¿tengo partido de copa continental? ¿y de copa nacional? ¿no? entonces
 * descanso. Es como funciona de verdad -- el miércoles es de copa, la que te toque -- y evita el
 * problema de tener que adivinar de antemano a qué torneo pertenece cada día, que es imposible:
 * quién juega la Libertadores depende de cómo terminó la tabla del año anterior, y el calendario es
 * una función pura del nombre del club.
 *
 * Base 12: alcanza para un cuadro nacional de 32 (5 rondas de ida y vuelta = 10) más holgura.
 */
const FECHAS_DE_COPA_BASE = 12;

/**
 * Las de más para los clubes cuyo país juega copas continentales.
 *
 * Una Libertadores son 6 fechas de grupo más 4 de eliminación; una Champions, 8 de fase de liga más
 * el playoff y cuatro rondas de ida y vuelta. Con la bolsa base sola, un club que juega las dos
 * copas se quedaba sin fechas para la nacional -- o al revés.
 *
 * Los clubes de esos países que NO clasifican ese año no pierden nada: sus fechas sobrantes son
 * días de descanso, que es exactamente lo que le pasa a un club sin copa internacional.
 */
const FECHAS_DE_COPA_CONTINENTAL = 10;

/**
 * Los clubes que pueden llegar a jugar una copa continental, y por eso necesitan la bolsa grande.
 *
 * Se decide por COMPETICIÓN de liga, no por país: la Serie A italiana pone clubes en la Champions
 * y la Serie B no, aunque las dos sean "Italiana". Preguntando por país, Sampdoria -- que sólo
 * juega la Coppa -- se llevaba 22 fechas de copa para una temporada de 18 partidos de liga: doce
 * días de descanso inventados en el medio.
 *
 * Alcanza con que UN club de esa competición aparezca en una copa continental. No se pregunta club
 * por club a propósito: quién clasifica depende de la tabla del año anterior, así que cualquier
 * club de Primera puede terminar jugándola. Los que no clasifican ese año usan esas fechas para la
 * copa nacional, y lo que sobre queda como descanso.
 */
let cacheClubesConBono: Set<string> | null = null;

function clubesConBonoContinental(): Set<string> {
  if (cacheClubesConBono) return cacheClubesConBono;

  const enCopa = new Set<string>();
  for (const c of DATED_CALENDARS) {
    if (c.kind !== 'continental_cup') continue;
    for (const m of c.matches) { enCopa.add(m.home); enCopa.add(m.away); }
  }

  const conBono = new Set<string>();
  for (const c of DATED_CALENDARS) {
    if (c.kind !== 'league') continue;
    const suyos = new Set<string>();
    let alguno = false;
    for (const m of c.matches) {
      suyos.add(m.home); suyos.add(m.away);
      if (enCopa.has(m.home) || enCopa.has(m.away)) alguno = true;
    }
    if (alguno) for (const n of suyos) conBono.add(n);
  }
  cacheClubesConBono = conBono;
  return conBono;
}

function fechasDeCopaReservadas(club: string): number {
  return FECHAS_DE_COPA_BASE
    + (clubesConBonoContinental().has(club) ? FECHAS_DE_COPA_CONTINENTAL : 0);
}

/** Días mínimos entre una fecha de copa y cualquier otro partido del club. */
const DESCANSO_MINIMO_DIAS = 3;

/**
 * Días entre una fecha de copa y la siguiente. Se prueban de mayor a menor: lo natural es que una
 * ida y su vuelta estén a una semana, pero un club europeo con liga + Champions casi no tiene
 * huecos, y ahí vale más apretar el torneo que dejarlo sin terminar. Medido en el Manchester City
 * de la temporada 1 (que arranca en enero, a media temporada): con 7 días fijos entraban 4 fechas
 * de FA Cup y el cuadro necesita 6.
 */
const ESPACIADOS_DE_COPA_DIAS = [7, 5, 4, 3];

/** Cartel del rival en una fecha reservada. No es un club: el cuadro todavía no sorteó el cruce. */
export const RIVAL_POR_SORTEAR = 'Por definir';

/**
 * ¿Esta copa la tiene que armar el cuadro del motor en vez del calendario?
 *
 * El síntoma de un fragmento es que los clubes no juegan la misma cantidad de partidos: el que
 * heredó el lugar del finalista tiene cinco y el del eliminado en primera ronda, uno. Un torneo de
 * verdad cargado entero no se ve así.
 *
 * La Superliga de Colombia queda afuera y debe quedar afuera: son 2 clubes y 2 partidos, o sea la
 * final de ida y vuelta COMPLETA. No hay nada que generar ahí.
 *
 * Y se exige que sea LA copa nacional del país, la que el motor modela (nombreCopaNacional). En
 * Inglaterra hay dos en el calendario, FA Cup y EFL Cup, pero un solo cuadro: sin este filtro las
 * dos se repartían las fechas reservadas contra el mismo bracket -- medido, la EFL se quedaba con
 * las 12 del Manchester City y la FA Cup con ninguna -- y encima el partido de una salía rotulado
 * con el nombre de la otra. La segunda copa se queda como estaba: imperfecta, pero suya.
 */
const cacheUsaCuadro = new Map<string, boolean>();

function usaCuadroDelMotor(comp: DatedCompetition): boolean {
  const cacheado = cacheUsaCuadro.get(comp.id);
  if (cacheado !== undefined) return cacheado;

  let r = false;
  if (comp.kind === 'domestic_cup' && !!comp.league && comp.name === nombreCopaNacional(comp.league)) {
    const porClub = new Map<string, number>();
    for (const m of comp.matches) {
      porClub.set(m.home, (porClub.get(m.home) ?? 0) + 1);
      porClub.set(m.away, (porClub.get(m.away) ?? 0) + 1);
    }
    const cuentas = [...porClub.values()];
    // Menos de 4 clubes no es un cuadro con rondas, es una final: se deja como está.
    r = cuentas.length >= 4 && Math.min(...cuentas) !== Math.max(...cuentas);
  }
  cacheUsaCuadro.set(comp.id, r);
  return r;
}

/**
 * Los clubes a los que hay que reservarles fechas de esta copa.
 *
 * No alcanza con los que aparecen en el fragmento scrapeado: el cuadro del motor se arma con los
 * clubes del PAÍS, y la Copa del Rey real sólo trae 16 nombres de los ~40 españoles que hay en la
 * base. Un club que entra al cuadro pero no figura en el fragmento se quedaría sin ninguna fecha
 * reservada -- o sea, sin copa, que es justo el bug que esto viene a arreglar.
 */
const cacheClubesDelPais = new Map<string, string[]>();

function clubesDelPais(comp: DatedCompetition): string[] {
  const cacheado = cacheClubesDelPais.get(comp.id);
  if (cacheado) return cacheado;

  const set = new Set<string>();
  for (const otra of DATED_CALENDARS) {
    const mismaCopa = otra.id === comp.id;
    const mismoPais = !!comp.league && otra.league === comp.league;
    if (!mismaCopa && !mismoPais) continue;
    for (const m of otra.matches) { set.add(m.home); set.add(m.away); }
  }
  const lista = [...set];
  cacheClubesDelPais.set(comp.id, lista);
  return lista;
}

/**
 * Le aparta a cada club del país sus días de copa en esta temporada.
 *
 * Las fechas se eligen POR CLUB, no una grilla común: si se le pusiera a todo el país el mismo día,
 * chocaría con la fecha de liga de la mitad de ellos y pickPrimary -- que le da prioridad a la copa
 * -- se comería ese partido de liga. Al elegirlas contra el calendario propio de cada club, no se
 * pisa nada. Que dos clubes de la misma llave las tengan en días distintos no se nota: el jugador
 * sólo ve su propio calendario, y el resto de las llaves las simula el motor en el mismo paso.
 */
function reservarFechasDeCopa(
  comp: DatedCompetition,
  temporada: number,
  indice: Map<string, DatedFixture[]>,
  agregar: (club: string, fx: DatedFixture) => void,
) {
  for (const club of clubesDelPais(comp)) {
    const propios = indice.get(club) ?? [];
    // Un club sin ningún partido esta temporada no está jugando: no hay dónde meterle la copa.
    if (!propios.length) continue;

    const deEstaCopa = propios.filter(f => f.competition.id === comp.id);
    // Si el fragmento real ya lo llevó hasta la FINAL, la copa terminó para este club: reservarle
    // fechas después la haría empezar de nuevo y coronar un segundo campeón del mismo torneo en el
    // mismo año. Pasa en la temporada 1 con la Copa del Rey y la Coppa Italia, que en el calendario
    // real llegan hasta la final.
    if (deEstaCopa.some(f => esRondaFinal(f.match.round))) continue;

    const fechasDeEstaCopa = deEstaCopa.map(f => f.date).sort();
    const faltan = fechasDeCopaReservadas(club) - fechasDeEstaCopa.length;
    if (faltan <= 0) continue;

    // De acá para abajo se trabaja con NÚMEROS DE DÍA, no con strings de fecha. El bucle recorre
    // ventanas de varios meses día por día, y hacerlo con aritmética de Date multiplicaba por ocho
    // el tiempo de armar el calendario: medido, 253 ms -> 2124 ms en la primera pantalla.
    //
    // El índice todavía no está ordenado en este punto (se ordena una sola vez, después), así que
    // el primer y el último día se sacan a mano en la misma pasada que arma los vetados.
    const vetados = new Set<number>();
    let primerDia = Infinity;
    let ultimoDia = -Infinity;
    for (const f of propios) {
      const dia = dayForDate(f.date);
      if (dia < primerDia) primerDia = dia;
      if (dia > ultimoDia) ultimoDia = dia;
      for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
    }

    // Se arranca DESPUÉS del último partido real de esta copa: primero lo que sorteó la vida, y
    // recién cuando se acaba, lo generado.
    const ultimaReal = fechasDeEstaCopa[fechasDeEstaCopa.length - 1];
    const desde = ultimaReal
      ? dayForDate(ultimaReal) + ESPACIADOS_DE_COPA_DIAS[0]
      : (comp.firstDate ? dayForDate(comp.firstDate) : primerDia);

    // El techo es el final de la temporada del club. Se deja llegar hasta ahí -- y no sólo hasta la
    // última fecha real de la copa -- porque si no, un fragmento que termina en agosto no deja
    // espacio para las rondas que faltan. Pasado ese punto ya empieza la temporada siguiente y las
    // fechas se cruzarían entre sí.
    const hasta = Math.max(ultimoDia, desde);

    for (const dia of elegirDias(desde, hasta, vetados, faltan)) {
      const date = dateForDay(dia);
      const match: DatedMatch = { date, home: club, away: RIVAL_POR_SORTEAR };
      agregar(club, {
        competition: comp, match, date, isHome: true,
        opponentName: RIVAL_POR_SORTEAR, temporada, esReservaDeCuadro: true,
      });
    }
  }
}

/**
 * Hasta `cuantas` días libres entre `desde` y `hasta`, lo más espaciados que se pueda.
 *
 * Se prueba primero con la separación cómoda y se va apretando sólo si no entran todos. Devolver de
 * menos no rompe nada -- la copa simplemente no llega a la final ese año -- pero es lo que hay que
 * evitar, así que conviene apretar antes que quedarse corto.
 */
function elegirDias(desde: number, hasta: number, vetados: Set<number>, cuantas: number): number[] {
  let mejor: number[] = [];
  for (const espaciado of ESPACIADOS_DE_COPA_DIAS) {
    const elegidos: number[] = [];
    let ultimo = -Infinity;
    for (let d = desde; d <= hasta && elegidos.length < cuantas; d++) {
      if (vetados.has(d)) continue;
      if (d - ultimo < espaciado) continue;
      elegidos.push(d);
      ultimo = d;
    }
    if (elegidos.length > mejor.length) mejor = elegidos;
    if (mejor.length >= cuantas) break;
  }
  return mejor;
}

const esCopaConCuadro = (comp: DatedCompetition) =>
  comp.kind === 'domestic_cup' && usaCuadroDelMotor(comp);

/**
 * La fecha del paso, o la ÚLTIMA que el club tenga si el calendario ya se agotó.
 *
 * El agotamiento sólo pasa pasadas las 32 temporadas de MAX_TEMPORADAS, o sea después del final de
 * cualquier carrera. Existe igual porque la pantalla necesita SIEMPRE una fecha que mostrar, y el
 * respaldo que había antes era getRealDate -- el reloj de semanas -- que en ese punto ya llevaba
 * años de desfase contra el calendario. Devolver la última fecha real dice la verdad: ahí terminó.
 */
export function fechaDelPaso(clubName: string, paso: number): string | null {
  const s = fixturesAtStep(clubName, paso);
  if (s) return s.date;
  const todas = fixturesForClub(clubName);
  return todas.length ? todas[todas.length - 1].date : null;
}

/**
 * ¿Hoy le toca COPA a este club?
 *
 * Es la pregunta que antes contestaba isCupWeek con aritmética -- "2 de cada 5 semanas son de
 * copa" -- sin mirar el calendario de nadie. Con eso la pantalla podía anunciar un rival de copa y
 * al apretar el botón salir a jugar la liga, porque las dos cosas se decidían por caminos
 * distintos. Ahora hay una sola fuente: lo que el calendario puso ese día.
 */
export function esDiaDeCopa(clubName: string, paso: number): boolean {
  const s = fixturesAtStep(clubName, paso);
  if (!s) return false;
  const p = pickPrimary(s.fixtures);
  return !!p && (p.competition.kind === 'continental_cup' || p.competition.kind === 'domestic_cup');
}

/**
 * Cuántas fechas de COPA del club ya pasaron, contando hasta (sin incluir) el paso actual.
 *
 * Es el reemplazo directo de cupWeeksElapsedInYear/cupWeeksElapsedTotal, y con él las copas pasan a
 * correr POR RONDA en vez de por semanas: cada fecha de copa del calendario es exactamente un paso
 * del cuadro. Antes las dos cosas iban por relojes distintos -- el jugador avanzaba por fechas y la
 * copa por un reparto aritmético de semanas -- y de ahí salía que el motor le jugara la fase de
 * grupos de fondo: en el paso 18 del Junior, el conteo de semanas ya iba por el paso 10 de copa.
 *
 * `porTemporada` para las copas que empiezan y terminan dentro del año (Libertadores, Sudamericana)
 * y el total corrido para las que arrastran estado entre temporadas (Champions, Europa).
 */
export function fechasDeCopaTranscurridas(
  clubName: string, paso: number, porTemporada: boolean,
): number {
  const t = temporadaDelPaso(clubName, paso);
  if (!t) return 0;
  const desdePaso = porTemporada ? t.primerPaso : 1;

  let n = 0;
  for (let p = desdePaso; p < paso; p++) {
    const s = fixturesAtStep(clubName, p);
    if (!s) break;
    if (s.fixtures.some(f => f.competition.kind === 'continental_cup' || f.competition.kind === 'domestic_cup')) n++;
  }
  return n;
}

/**
 * Cuántas fechas de copa nacional le quedan al club en esta temporada, contando desde `desdeFecha`.
 *
 * Es el presupuesto real del torneo, y sirve para no armar un cuadro que no entra. La temporada 1
 * arranca el 12 de enero, o sea a mitad de la temporada europea: al Manchester City le quedan 4
 * fechas de FA Cup, y un cuadro de 8 clubes necesita 6 (tres rondas de ida y vuelta). Con esas dos
 * de menos el torneo no llegaba a la final y moría en semis sin campeón. Sabiendo el presupuesto,
 * se arma un cuadro de 4 y se corona igual.
 */
export function fechasDeCopaNacionalRestantes(clubName: string, temporada: number, desdeFecha: string): number {
  const fechas = new Set<string>();
  for (const f of getIndice(temporada).get(clubName) ?? []) {
    if (esCopaConCuadro(f.competition) && f.date >= desdeFecha) fechas.add(f.date);
  }
  return fechas.size;
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
 * Versión BARATA de hasDatedLeagueSchedule, para preguntarlo de a miles.
 *
 * hasDatedLeagueSchedule pasa por fixturesForClub, que concatena las 32 temporadas del club y las
 * cachea: preguntarlo por los 1103 clubes de la base -- que es lo que hace el filtro de clubes
 * jugables -- construye 1103 listas completas que después nadie usa. Acá alcanza con mirar la
 * temporada 1, porque las siguientes son permutaciones del MISMO conjunto de clubes: si un club
 * juega liga con fechas alguna temporada, juega la 1.
 */
export function tieneLigaConFechasReales(clubName: string): boolean {
  const suyos = getIndice(1).get(clubName);
  return !!suyos && suyos.some(f => f.competition.kind === 'league');
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
