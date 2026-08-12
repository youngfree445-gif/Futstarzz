// Validador de COPAS. Se corre con `npm run validar:copas`.
//
// Existe por un error concreto: el 11 de agosto de 2026 se cambió el calendario para que las copas
// de la temporada 2 en adelante las armara el cuadro del motor, y el efecto real fue dejar a los
// clubes SIN NINGUNA COPA. Los diez chequeos que "verificaron" ese cambio comprobaban que las copas
// salían del calendario -- o sea, que el código hacía lo programado. Ninguno preguntó lo único que
// importa: ¿el jugador puede jugar una copa?
//
// Esto lo pregunta. Camina la carrera paso a paso como lo hace App.tsx -- mismo calendario, misma
// decisión de rama, mismo cuadro -- y cuenta partidos de copa REALMENTE jugados, rondas superadas y
// campeones coronados. Si una copa no se puede jugar, acá sale en cero.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { fechasDeCopaNacionalRestantes, fechasDeCopaTranscurridas, fixturesAtStep, hasDatedLeagueSchedule, pickPrimary, temporadaDelPaso } from '../src/dateSchedule';
import { crearCopaNacional, cruceActual, piernaDelCruce, rondaActual, sigueEnCopa, tamanoDelCuadro, tieneCopaNacionalReal, type DomesticCupState } from '../src/copaNacional';
import { resolverPasoCopaNacional, simulateMatch, getOrCreateCupState, getUpcomingCupMatch, getLibertadoresParticipants, getSudamericanaParticipants, isClubStillInCup, resolveCupWeek, CAREER_START_YEAR } from '../src/leagueEngine';
import type { Club } from '../src/types';

const TEMPORADAS = 3;
// El detalle se imprime para uno por cada forma de calendario que hay: Brasil (liga corrida + copa
// larga), Colombia (Apertura/Clausura), España e Inglaterra (temporada europea a caballo de dos
// años). El resumen recorre TODOS los clubes con copa modelada, que es donde se ven los casos raros.
const CLUBES = ['Santos', 'Junior de Barranquilla', 'FC Barcelona', 'Manchester City'];

interface Registro {
  club: string;
  temporada: number;
  /** Partidos de copa nacional que el jugador jugó de verdad. */
  partidosDeCopa: number;
  /** Rondas distintas que llegó a disputar (Dieciseisavos, Octavos...). */
  rondas: string[];
  /** Si el cuadro llegó a coronar a alguien, y si fue el jugador. */
  campeon: string | null;
  campeonSoyYo: boolean;
  /** Cómo terminó: eliminado, campeón, o el torneo se quedó sin fechas a mitad. */
  desenlace: 'campeón' | 'eliminado' | 'sin terminar' | 'nunca jugó';
  /** Veces que se ofreció el MISMO cruce ya resuelto: son partidos fantasma. */
  repeticiones: number;
}

/** El club de la base por nombre de calendario. */
function clubDe(nombre: string): Club | undefined {
  return CLUBS.find(c => c.name === nombre);
}

/**
 * Camina la carrera de un club paso a paso y anota lo que pasa con su copa nacional.
 *
 * Replica la decisión de rama de App.tsx: si el paso de hoy trae un partido de copa nacional del
 * CALENDARIO se juega ése; si trae una reserva de cuadro, manda el bracket del motor.
 */
function simular(nombreClub: string): Registro[] {
  const club = clubDe(nombreClub);
  if (!club) return [];

  const porTemporada = new Map<number, Registro>();
  const copas = new Map<string, DomesticCupState>();
  let paso = 1;

  const registro = (temporada: number): Registro => {
    let r = porTemporada.get(temporada);
    if (!r) {
      r = {
        club: nombreClub, temporada, partidosDeCopa: 0, rondas: [], campeon: null,
        campeonSoyYo: false, desenlace: 'nunca jugó', repeticiones: 0,
      };
      porTemporada.set(temporada, r);
    }
    return r;
  };

  // Se camina hasta cubrir TEMPORADAS temporadas completas. El tope de pasos es generoso a
  // propósito: un club puede tener 40 fechas por año o 60, y cortar por número fijo sesgaría el
  // conteo del último año.
  const MAX_PASOS = 400;
  while (paso <= MAX_PASOS) {
    const t = temporadaDelPaso(nombreClub, paso);
    if (!t || t.temporada > TEMPORADAS) break;
    const step = fixturesAtStep(nombreClub, paso);
    if (!step) break;

    const primary = pickPrimary(step.fixtures);
    if (primary && primary.competition.kind === 'domestic_cup') {
      const r = registro(t.temporada);
      const esReserva = !!primary.esReservaDeCuadro;

      if (!esReserva) {
        // Partido de copa que sale del calendario real: rival y fecha vienen de Transfermarkt.
        r.partidosDeCopa++;
        r.rondas.push(primary.match.round ?? 'sin ronda');
        if (r.desenlace === 'nunca jugó') r.desenlace = 'sin terminar';
      } else {
        jugarPasoDeCuadro(club, t.temporada, step.date, copas, r);
      }
    }
    paso++;
  }

  // Desenlace final por temporada, leyendo el cuadro que quedó.
  for (const [temporada, r] of porTemporada) {
    const cup = copas.get(`${club.league}-${temporada}`);
    if (!cup) continue;
    r.campeon = cup.championId ? (CLUBS.find(c => c.id === cup.championId)?.name ?? cup.championId) : null;
    r.campeonSoyYo = cup.championId === club.id;
    r.desenlace = cup.championId === club.id ? 'campeón'
      : !sigueEnCopa(cup, club.id) ? 'eliminado'
      : r.partidosDeCopa > 0 ? 'sin terminar'
      : 'nunca jugó';
  }

  return [...porTemporada.values()].sort((a, b) => a.temporada - b.temporada);
}

/**
 * Un paso de copa resuelto por el CUADRO del motor, como lo hace App.tsx.
 *
 * El jugador juega su cruce; el resto de las llaves las simula el motor en la misma llamada.
 */
function jugarPasoDeCuadro(club: Club, temporada: number, hoy: string, copas: Map<string, DomesticCupState>, r: Registro) {
  if (!tieneCopaNacionalReal(club.league)) return;
  const cupKey = `${club.league}-${temporada}`;

  // Mismo criterio que App.tsx: el cuadro se dimensiona a las fechas que quedan.
  const continuar = (() => {
    const quedan = fechasDeCopaNacionalRestantes(club.name, temporada, hoy);
    const delPais = CLUBS.filter(c => c.league === club.league);
    const cupo = Math.min(
      2 ** Math.max(1, Math.min(6, Math.floor(quedan / 2))),
      tamanoDelCuadro(delPais.length),
    );
    return [
      club.id,
      ...delPais.filter(c => c.id !== club.id)
        .sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))
        .slice(0, cupo - 1)
        .map(c => c.id),
    ];
  })();

  let cup = copas.get(cupKey)
    ?? crearCopaNacional(club.league, temporada, CLUBS, c => (c.division === 2 ? 2 : 1), continuar);

  // Si la ronda anterior ya está completa, se arma la siguiente ANTES de preguntar por el cruce.
  // Sin esto, cruceActual devuelve la llave ya jugada y el jugador la disputa DE NUEVO -- un
  // partido fantasma por cada cambio de ronda.
  const ultima = cup.bracket.tiesByRound[cup.bracket.tiesByRound.length - 1];
  if (!cup.championId && ultima?.every(t => t.played)) {
    cup = resolverPasoCopaNacional(cup, CLUBS as Club[]);
  }
  copas.set(cupKey, cup);

  // Sin cruce para vos (campeón, eliminado, o fuera del cuadro): el torneo sigue igual, una pierna
  // por fecha reservada, como hace App.tsx en el día de descanso.
  const sinCruce = () => {
    if (!cup.championId) copas.set(cupKey, resolverPasoCopaNacional(cup, CLUBS as Club[]));
  };

  if (cup.championId) return;
  if (!sigueEnCopa(cup, club.id)) { sinCruce(); return; }
  const tie = cruceActual(cup, club.id);
  if (!tie) { sinCruce(); return; }
  if (tie.played) { r.repeticiones++; return; }     // no debería pasar: es el fantasma de arriba

  const rivalId = tie.clubAId === club.id ? tie.clubBId : tie.clubAId;
  const rival = CLUBS.find(c => c.id === rivalId);
  if (!rival) return;

  const esIda = piernaDelCruce(tie) === 'ida';
  const soyLocal = esIda ? tie.clubAId === club.id : tie.clubBId === club.id;
  const sim = soyLocal ? simulateMatch(club, rival) : simulateMatch(rival, club);
  const misGoles = soyLocal ? sim.homeGoals : sim.awayGoals;
  const susGoles = soyLocal ? sim.awayGoals : sim.homeGoals;

  const ronda = rondaActual(cup);
  if (r.rondas[r.rondas.length - 1] !== ronda) r.rondas.push(ronda);
  r.partidosDeCopa++;

  copas.set(cupKey, resolverPasoCopaNacional(cup, CLUBS as Club[], {
    clubId: club.id, isHome: soyLocal, goals: misGoles, opponentGoals: susGoles,
  }));
}

// --- Salida ---
console.log('=== Copa nacional: ¿el jugador puede jugarla? ===');
console.log(`${TEMPORADAS} temporadas por club. Los partidos se simulan; lo que se mide es el ACCESO.\n`);
console.log('club'.padEnd(24), 'T'.padStart(2), 'partidos'.padStart(9), 'rondas'.padStart(7),
  'desenlace'.padStart(13), '  campeón');

let sinCopa = 0;
let fantasmas = 0;
let coronadas = 0;
let total = 0;

for (const nombre of CLUBES) {
  const filas = simular(nombre);
  if (!filas.length) { console.log(`${nombre.padEnd(24)}  (sin calendario)`); continue; }
  for (const r of filas) {
    total++;
    if (r.partidosDeCopa === 0) sinCopa++;
    fantasmas += r.repeticiones;
    if (r.campeon) coronadas++;
    console.log(
      r.club.padEnd(24),
      String(r.temporada).padStart(2),
      String(r.partidosDeCopa).padStart(9),
      String(new Set(r.rondas).size).padStart(7),
      r.desenlace.padStart(13),
      '  ' + (r.campeon ?? '—') + (r.campeonSoyYo ? ' (VOS)' : ''),
      r.repeticiones ? `  ${r.repeticiones} REPETIDOS` : '',
    );
  }
  console.log('');
}

console.log('--- Los cuatro de arriba ---');
console.log(`club-temporadas revisadas:            ${total}`);
console.log(`sin NI UN partido de copa:            ${sinCopa}${sinCopa ? '   <-- la copa no se puede jugar' : ''}`);
console.log(`ediciones que coronaron campeón:      ${coronadas} de ${total}`);
console.log(`partidos fantasma (cruce repetido):   ${fantasmas}${fantasmas ? '   <-- el jugador juega dos veces la misma llave' : ''}`);

// --- Barrido completo: todos los clubes con copa nacional modelada y calendario real ---
console.log('\n--- Barrido completo ---');
const todos = CLUBS.filter(c =>
  tieneCopaNacionalReal(c.league) && hasDatedLeagueSchedule(c.name));

let nTotal = 0, nSinCopa = 0, nCoronadas = 0, nFantasmas = 0, nPartidos = 0;
const sinCoronarPorLiga = new Map<string, number>();
const revisadasPorLiga = new Map<string, number>();

for (const club of todos) {
  for (const r of simular(club.name)) {
    nTotal++;
    nPartidos += r.partidosDeCopa;
    nFantasmas += r.repeticiones;
    revisadasPorLiga.set(club.league, (revisadasPorLiga.get(club.league) ?? 0) + 1);
    if (r.partidosDeCopa === 0) nSinCopa++;
    if (r.campeon) nCoronadas++;
    else sinCoronarPorLiga.set(club.league, (sinCoronarPorLiga.get(club.league) ?? 0) + 1);
  }
}

console.log(`${todos.length} clubes con copa modelada y calendario real, ${TEMPORADAS} temporadas cada uno\n`);
console.log(`club-temporadas:                      ${nTotal}`);
console.log(`sin NI UN partido de copa:            ${nSinCopa}${nSinCopa ? '   <-- la copa no se puede jugar' : ''}`);
console.log(`ediciones que coronaron campeón:      ${nCoronadas} (${Math.round(nCoronadas / nTotal * 100)}%)`);
console.log(`partidos de copa por temporada:       ${(nPartidos / nTotal).toFixed(1)} de promedio`);
console.log(`partidos fantasma (cruce repetido):   ${nFantasmas}${nFantasmas ? '   <-- el jugador juega dos veces la misma llave' : ''}`);

if (sinCoronarPorLiga.size) {
  console.log('\nEdiciones sin campeón, por liga:');
  for (const [liga, n] of [...sinCoronarPorLiga].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${liga.padEnd(14)} ${String(n).padStart(4)} de ${revisadasPorLiga.get(liga)}`);
  }
}

// --- Copas continentales: ¿el motor se adelanta al jugador? ---
//
// La copa Conmebol avanza por CONTEO DE SEMANAS (cupWeeksElapsedInYear) mientras el jugador avanza
// por fechas del calendario. Si getOrCreateCupState no recibe el club del jugador, se come de fondo
// todos los pasos que "corresponden" a la semana actual -- incluida la fase de grupos entera -- y el
// jugador gana su primer partido de grupos para enterarse enseguida de que quedó eliminado en
// octavos. Reportado tal cual con el Junior en la Libertadores.
//
// Se corre el mismo escenario CON y SIN la guardia para que la diferencia quede a la vista.
// Ahora se camina el CALENDARIO, que es lo que cambió: las copas continentales ya no corren por
// un reparto de semanas sino por las fechas de copa del club, igual que la nacional. Se cuenta lo
// único que importa: cuántos partidos de su copa continental llega a jugar el jugador.
//
// El caso testigo es el Santos: está en la Sudamericana y su calendario sólo trae Brasileirão y
// Copa do Brasil, así que antes NO la jugaba nunca -- primero se le jugaba sola de fondo, después
// quedó congelada. Tiene que dar mayor que cero.
console.log('\n--- Copas continentales: ¿se juegan de verdad? ---');
console.log('club'.padEnd(24), 'copa'.padStart(13), 'jugados'.padStart(8), 'fase final'.padStart(12), '  desenlace');

let sinJugarContinental = 0;

for (const nombre of ['Santos', 'Junior de Barranquilla', 'Flamengo', 'FC Barcelona']) {
  const club = clubDe(nombre);
  if (!club) continue;
  const libs = getLibertadoresParticipants(CLUBS as Club[]);
  const suda = getSudamericanaParticipants(CLUBS as Club[]);
  const cupId: 'libertadores' | 'sudamericana' | null =
    libs.includes(club.id) ? 'libertadores' : suda.includes(club.id) ? 'sudamericana' : null;
  if (!cupId) { console.log(`${nombre.padEnd(24)}   (no juega copa Conmebol)`); continue; }

  let cup: ReturnType<typeof getOrCreateCupState> | undefined;
  let jugados = 0;
  let desenlace = 'seguía dentro';

  for (let paso = 1; paso <= 120; paso++) {
    const t = temporadaDelPaso(nombre, paso);
    if (!t || t.temporada > 1) break;
    const step = fixturesAtStep(nombre, paso);
    if (!step) break;
    const primary = pickPrimary(step.fixtures);
    const esDiaDeCopa = !!primary && (primary.competition.kind === 'continental_cup'
      || (primary.competition.kind === 'domestic_cup' && primary.esReservaDeCuadro));
    if (!esDiaDeCopa) continue;

    // Mismo cálculo que App.tsx: el paso del cuadro sale del calendario, no de semanas.
    cup = getOrCreateCupState(cupId, 1, CLUBS as Club[], cup,
      fechasDeCopaTranscurridas(nombre, paso, true), undefined, undefined, club.id);
    const up = getUpcomingCupMatch(cup, club.id);
    if (!up) {
      if (desenlace === 'seguía dentro' && !isClubStillInCup(cup, club.id)) desenlace = `eliminado en ${cup.stage}`;
      continue;
    }
    const rival = CLUBS.find(c => c.id === up.opponentId);
    if (!rival) continue;
    const sim = up.isHome ? simulateMatch(club, rival) : simulateMatch(rival, club);
    cup = resolveCupWeek(cup, CLUBS as Club[], club.id, up.isHome,
      up.isHome ? sim.homeGoals : sim.awayGoals, up.isHome ? sim.awayGoals : sim.homeGoals);
    jugados++;
  }

  if (cup?.championId === club.id) desenlace = 'CAMPEÓN';
  if (jugados === 0) sinJugarContinental++;
  console.log(
    nombre.padEnd(24), cupId.padStart(13), String(jugados).padStart(8),
    (cup?.stage ?? '-').padStart(12), '  ' + desenlace,
    jugados === 0 ? '   <-- NO la juega' : '');
}

console.log(`
${sinJugarContinental === 0
  ? 'Todos juegan su copa continental por el calendario.'
  : `ATENCIÓN: ${sinJugarContinental} clubes clasificados que NO llegan a jugar ni un partido.`}`);

const anio = (t: number) => CAREER_START_YEAR + t - 1;
console.log(`\n(temporada 1 = ${anio(1)}, calendario real; ${anio(2)}+ generadas)`);
