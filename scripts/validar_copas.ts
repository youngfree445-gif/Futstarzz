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

import { ULTIMATE_CLUBS_DATABASE as CLUBS, WORLD_CUP_TEAMS_DATABASE, ALL_NATIONAL_TEAMS_DATABASE } from '../src/data';
import { seleccionesDeLaEurocopa, seleccionesDeLaCopaAmerica } from '../src/eliminatorias';
import { esAnioDeTorneoContinental, fechasDeCopaNacionalRestantes, fechasDeCopaTranscurridas, fixturesAtStep, fixturesForClub, hasDatedLeagueSchedule, partidosDeLaMismaLlave, pickPrimary, temporadaDelPaso } from '../src/dateSchedule';
import { crearCopaNacional, cruceActual, piernaDelCruce, rondaActual, sigueEnCopa, tamanoDelCuadro, tieneCopaNacionalReal, type DomesticCupState } from '../src/copaNacional';
import { resolverPasoCopaNacional, simulateMatch, getOrCreateCupState, tercerosDeGrupo, sortTable, getOrCreateWorldCupState, sigueEnElTorneoDeSelecciones, FORMATO_DE_TORNEO, getUpcomingCupMatch, getLibertadoresParticipants, getSudamericanaParticipants, isClubStillInCup, resolveCupWeek, CAREER_START_YEAR } from '../src/leagueEngine';
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

// ---------------------------------------------------------------------------------------------
// FASE DE GRUPOS: no hay global.
//
// En un grupo también se juega dos veces contra cada rival, uno de local y otro de visitante, pero
// esos partidos no forman una llave: valen tres puntos cada uno. La pantalla del partido anunciaba
// "Global 7-2" en la segunda vuelta del grupo, porque el global se armaba con "mismo rival, misma
// temporada". Reportado: "en fase de grupos no hay global".
//
// Lo que distingue una llave de un grupo es que las dos piernas de la llave son CONSECUTIVAS.
// ---------------------------------------------------------------------------------------------
console.log('\n--- Fase de grupos: no debe haber global ---');
{
  const JUNIOR = 'Junior de Barranquilla';
  const suyos = fixturesForClub(JUNIOR).filter(f => f.temporada === 1);
  const grupos = suyos.filter(f => /Libertadores/.test(f.competition.name));
  let fallas = 0;

  // Segundo cruce con un rival ya enfrentado en el grupo: entre medio se jugó contra otros.
  const vistos = new Set<string>();
  for (const f of grupos) {
    const repetido = vistos.has(f.opponentName);
    vistos.add(f.opponentName);
    if (!repetido) continue;
    const previos = partidosDeLaMismaLlave(JUNIOR, f.competition.id, f.date);
    const ok = previos.length === 0;
    if (!ok) fallas++;
    console.log(`${ok ? 'OK  ' : 'FALLA'} ${f.date} 2do partido de grupo vs ${f.opponentName}: ${previos.length === 0 ? 'sin global' : `global con ${previos.join(', ')}`}`);
  }

  // Contraprueba: una llave de verdad (ida y vuelta consecutivas) SÍ tiene que sumar global.
  const copa = suyos.filter(f => f.competition.name === 'Copa BetPlay');
  if (copa.length >= 2) {
    const previos = partidosDeLaMismaLlave(JUNIOR, copa[1].competition.id, copa[1].date);
    const ok = previos.length === 1 && previos[0] === copa[0].date;
    if (!ok) fallas++;
    console.log(`${ok ? 'OK  ' : 'FALLA'} ${copa[1].date} vuelta de Copa BetPlay: ${ok ? 'suma la ida ' + copa[0].date : 'NO suma la ida'}`);
  }

  if (fallas) { console.log(`\n${fallas} FALLAS en el global de fase de grupos`); process.exit(1); }
}

// ---------------------------------------------------------------------------------------------
// PISO DURO: una copa que no llega a su final es una copa que desapareció.
//
// Antes acá sólo se IMPRIMÍA el porcentaje de ediciones coronadas y el validador salía con 0 pase
// lo que pasara, así que una caída se leía como un número más en la pantalla. Y cayó: el reparto de
// días le daba la bolsa entera al primer torneo que la pedía, la copa nacional se quedaba con cero
// días y el cuadro se congelaba después de la vuelta real. Reportado: "en el calendario la copa
// Colombia desaparece". Ahora eso rompe el validador, que es lo único que impide que vuelva.
//
// El piso es 90% y no 100% a propósito: quedan ligas cuyo fragmento real termina tan tarde que el
// cuadro no entra en la ventana del torneo. Lo que no puede pasar es que se DERRUMBE.
const PISO_DE_CORONACION = 0.90;
const logrado = nCoronadas / nTotal;
if (logrado < PISO_DE_CORONACION) {
  console.log(`\nFALLA: sólo el ${Math.round(logrado * 100)}% de las ediciones corona campeón (piso ${PISO_DE_CORONACION * 100}%).`);
  console.log('Alguna copa se está quedando sin días de calendario donde jugarse.');
  process.exit(1);
}
if (nSinCopa > 0) {
  console.log(`\nFALLA: ${nSinCopa} club-temporadas sin NI UN partido de copa.`);
  process.exit(1);
}
console.log(`\nPiso de coronación OK: ${Math.round(logrado * 100)}% (mínimo ${PISO_DE_CORONACION * 100}%).`);


// =================================================================================================
// EL REPECHAJE DE LA SUDAMERICANA
// =================================================================================================
//
// El tercero de cada grupo de Libertadores no queda eliminado: baja a la Sudamericana y se cruza
// con uno de sus ocho segundos, a ida y vuelta. Es el formato real, y la razon por la que doce
// clubes tienen partidos de las DOS copas en el calendario de 2026 -- partidos que el juego jugaba
// sin cuadro detras: sin ronda, sin eliminacion y sin campeon posible.

console.log('\n=== EL REPECHAJE DE LA SUDAMERICANA ===');
{
  let fallasRep = 0;
  const okRep = (n: string, c: boolean, d = '') => { if (!c) fallasRep++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };
  const db = CLUBS as Club[];
  const nom = (id: string) => db.find(c => c.id === id)?.name ?? id;

  const lib = getOrCreateCupState('libertadores', 1, db, undefined, 6, {}, undefined, undefined, undefined);
  const terceros = tercerosDeGrupo(lib);
  okRep('la Libertadores deja OCHO terceros al cerrar los grupos', terceros.length === 8,
     terceros.map(nom).join(', '));

  const sud = getOrCreateCupState('sudamericana', 1, db, undefined, 6, {}, undefined, undefined, undefined, terceros);
  okRep('la Sudamericana entra en repechaje, no directo al cuadro', sud.stage === 'playoff', `etapa ${sud.stage}`);
  okRep('y son OCHO llaves', (sud.playoff?.length ?? 0) === 8);

  const enRepechaje = new Set((sud.playoff ?? []).flatMap(t => [t.clubAId, t.clubBId]));
  okRep('los ocho terceros estan adentro', terceros.every(id => enRepechaje.has(id)));
  const ganadores = sud.groups.map(g => sortTable(g.table)[0].clubId!);
  okRep('los ganadores de grupo NO: pasan directo a octavos', !ganadores.some(id => enRepechaje.has(id)));
  okRep('y siguen contando como vivos mientras se juega el repechaje',
     ganadores.every(id => isClubStillInCup(sud, id)));

  // La cuenta: 6 de grupos + 2 de repechaje + 2 + 2 + 2 + 1 = 15.
  const alFinal = getOrCreateCupState('sudamericana', 1, db, undefined, 15, {}, undefined, undefined, undefined, terceros);
  okRep('con quince pasos corona campeon', !!alFinal.championId, alFinal.championId ? nom(alFinal.championId) : 'sin campeon');
  const catorce = getOrCreateCupState('sudamericana', 1, db, undefined, 14, {}, undefined, undefined, undefined, terceros);
  okRep('con catorce todavia no: el repechaje agrega una ronda de verdad', !catorce.championId);

  // Sin terceros -- la Libertadores, la Concacaf, o una Sudamericana que todavia no los tiene --
  // todo tiene que seguir exactamente como antes.
  const sinRepechaje = getOrCreateCupState('sudamericana', 1, db, undefined, 6, {}, undefined, undefined, undefined);
  okRep('sin terceros, la Sudamericana siembra su cuadro como siempre',
     sinRepechaje.stage === 'knockout' && !sinRepechaje.playoff);
  const soloLib = getOrCreateCupState('libertadores', 1, db, undefined, 13, {}, undefined, undefined, undefined, terceros);
  okRep('la Libertadores no tiene repechaje aunque se le pasen terceros',
     !soloLib.playoff && !!soloLib.championId);

  if (fallasRep) { console.log(`\nFALLA: ${fallasRep} en el repechaje.`); process.exit(1); }
}


// =================================================================================================
// EL MUNDIAL TIENE QUE CORONAR
// =================================================================================================
//
// Se congelaba en la ronda de 32 PARA SIEMPRE: resolveBracketRound resuelve la ronda y corta a
// proposito, y nadie llamaba despues a armar la siguiente. Medido antes del arreglo: con 20 pasos
// el cuadro seguia teniendo una sola ronda de 16 partidos. Osea que "Campeon del Mundo" era un
// logro inalcanzable y ningun Mundial de ninguna carrera tuvo campeon nunca.
//
// Es EL MISMO agujero que tenian las copas de Conmebol, y su comentario decia que ese era "el unico
// lugar donde faltaba". Faltaba en dos.

console.log('\n=== EL MUNDIAL ===');
{
  let fallasWC = 0;
  const okWC = (n: string, c: boolean, d = '') => { if (!c) fallasWC++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };
  const equipos = WORLD_CUP_TEAMS_DATABASE as unknown as Club[];
  const nomEq = (id: string) => equipos.find(e => e.id === id)?.name ?? id;

  const aMitad = getOrCreateWorldCupState(2026, equipos, undefined, 5);
  okWC('el cuadro AVANZA de ronda', (aMitad.knockout?.matchesByRound.length ?? 0) > 1,
     `rondas: ${(aMitad.knockout?.matchesByRound ?? []).map(r => r.length).join(' -> ')}`);

  const entero = getOrCreateWorldCupState(2026, equipos, undefined, 8);
  okWC('con ocho pasos hay campeon del mundo', !!entero.championId,
     entero.championId ? nomEq(entero.championId) : 'sin campeon');
  okWC('y el cuadro llego hasta la final',
     (entero.knockout?.matchesByRound ?? []).map(r => r.length).join(',') === '16,8,4,2,1');

  // Nueve dias reserva el calendario para el Mundial: tienen que alcanzar.
  okWC('el calendario le reserva mas dias de los que necesita',
     fixturesForClub('Junior de Barranquilla')
       .filter(f => f.temporada === 1 && f.competition.kind === 'national_tournament').length >= 8);

  if (fallasWC) { console.log(`\nFALLA: ${fallasWC} en el Mundial.`); process.exit(1); }
}


// =================================================================================================
// LA EUROCOPA Y LA COPA AMERICA
// =================================================================================================
//
// Los dos torneos continentales de selecciones. Son el MISMO torneo que el Mundial con otros
// numeros -- grupos de cuatro a una vuelta y despues eliminacion a partido unico -- asi que
// comparten motor: lo unico que cambia es cuantos grupos hay y cuantos terceros pasan.
//
// Van en junio/julio de los anos pares que no son de Mundial, que es lo que fija el Calendario
// Internacional de la FIFA (docs/CALENDARIO_INTERNACIONAL_FIFA.md). Ese documento no da los dias de
// la edicion 2028 -- dice "junio/julio" --, asi que el calendario reserva la ventana y el motor
// sortea adentro.

console.log('\n=== EUROCOPA Y COPA AMERICA ===');
{
  let fallasTC = 0;
  const okTC = (n: string, c: boolean, d = '') => { if (!c) fallasTC++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };
  const todas = ALL_NATIONAL_TEAMS_DATABASE;
  const nomSel = (id: string) => todas.find(t => t.id === id)?.name.replace('Seleccion de ', '') ?? id;

  const euro = seleccionesDeLaEurocopa(todas);
  const copa = seleccionesDeLaCopaAmerica(todas);
  okTC('la Eurocopa junta 24 selecciones de la UEFA', euro.length === 24);
  okTC('la Copa America junta 16: las 10 de Conmebol mas 6 invitadas', copa.length === 16);
  okTC('y las diez sudamericanas estan todas',
     ['Argentina', 'Brasil', 'Uruguay', 'Colombia', 'Chile', 'Perú', 'Ecuador', 'Paraguay', 'Venezuela', 'Bolivia']
       .every(n => copa.some(c => c.name.includes(n))));

  const euroEntera = getOrCreateWorldCupState(1, euro, undefined, FORMATO_DE_TORNEO.eurocopa.pasos, 'eurocopa');
  okTC('la Eurocopa corona campeon con sus siete pasos', !!euroEntera.championId, nomSel(euroEntera.championId ?? ''));
  okTC('y su cuadro es 16 -> 8 -> 4 -> 2 -> 1 (seis grupos y cuatro mejores terceros)',
     euroEntera.groups.length === 6
     && (euroEntera.knockout?.matchesByRound ?? []).map(r => r.length).join(',') === '8,4,2,1');

  const copaEntera = getOrCreateWorldCupState(1, copa, undefined, FORMATO_DE_TORNEO.copaamerica.pasos, 'copaamerica');
  okTC('la Copa America corona campeon con sus seis pasos', !!copaEntera.championId, nomSel(copaEntera.championId ?? ''));
  okTC('y su cuadro arranca en CUARTOS: cuatro grupos, sin terceros ni octavos',
     copaEntera.groups.length === 4
     && (copaEntera.knockout?.matchesByRound ?? []).map(r => r.length).join(',') === '4,2,1');

  // El Mundial no se entera de que esto existe.
  const mundial = getOrCreateWorldCupState(1, WORLD_CUP_TEAMS_DATABASE as unknown as Club[], undefined, 8);

  // ---------------------------------------------------------------------------------------------
  // SI TE ELIMINAN DEL MUNDIAL, TE TIENEN QUE AVISAR
  // ---------------------------------------------------------------------------------------------
  //
  // Estos torneos tenian pantalla de campeon y nada para el que queda afuera: el Mundial
  // simplemente dejaba de aparecer. El aviso se dispara comparando el estado de antes con el de
  // despues, y quien contesta si seguis vivo es sigueEnElTorneoDeSelecciones. Se prueba que
  // distinga los cuatro estados, que es de lo que depende a quien se le avisa.
  const campeonDelMundo = mundial.knockout?.championId ?? '';
  okTC('el campeon sigue "vivo": lo suyo lo cuenta la pantalla de campeon',
     sigueEnElTorneoDeSelecciones(mundial, campeonDelMundo), nomSel(campeonDelMundo));

  // El finalista perdio el ultimo partido: quedo afuera.
  const finalDelMundial = (mundial.knockout?.matchesByRound ?? []).at(-1)?.[0];
  const finalista = finalDelMundial
    ? (finalDelMundial.homeTeamId === campeonDelMundo ? finalDelMundial.awayTeamId : finalDelMundial.homeTeamId)
    : '';
  okTC('el que perdio la final ya no sigue', !sigueEnElTorneoDeSelecciones(mundial, finalista), nomSel(finalista));

  // Una seleccion que no llego al cuadro: se quedo en la fase de grupos.
  const enElCuadro = new Set((mundial.knockout?.matchesByRound ?? []).flat()
    .flatMap(m => [m.homeTeamId, m.awayTeamId]));
  const quedoEnGrupos = mundial.groups.flatMap(g => g.clubIds).find(id => !enElCuadro.has(id)) ?? '';
  okTC('el que no paso de grupos tampoco sigue',
     !!quedoEnGrupos && !sigueEnElTorneoDeSelecciones(mundial, quedoEnGrupos), nomSel(quedoEnGrupos));

  // Y en pleno torneo, antes de que se juegue nada, TODOS los que estan en un grupo siguen vivos:
  // en fase de grupos no hay a quien anunciarle una eliminacion.
  const recienEmpezado = getOrCreateWorldCupState(1, WORLD_CUP_TEAMS_DATABASE as unknown as Club[], undefined, 0);
  okTC('recien empezado, nadie esta eliminado',
     recienEmpezado.groups.flatMap(g => g.clubIds).every(id => sigueEnElTorneoDeSelecciones(recienEmpezado, id)),
     `${recienEmpezado.groups.flatMap(g => g.clubIds).length} selecciones`);
  okTC('el Mundial sigue con sus doce grupos y su ronda de 32',
     mundial.groups.length === 12
     && (mundial.knockout?.matchesByRound ?? []).map(r => r.length).join(',') === '16,8,4,2,1');

  // Y el calendario les reserva dias en el ano que toca.
  okTC('2028 y 2032 son anios de torneo continental; 2026 y 2030 no',
     esAnioDeTorneoContinental(2028) && esAnioDeTorneoContinental(2032)
     && !esAnioDeTorneoContinental(2026) && !esAnioDeTorneoContinental(2030));
  const diasT3 = fixturesForClub('Junior de Barranquilla')
    .filter(f => f.temporada === 3 && f.competition.id === 'continental_selecciones');
  okTC('el calendario reserva dias suficientes en la temporada del torneo',
     diasT3.length >= FORMATO_DE_TORNEO.eurocopa.pasos,
     `${diasT3.length} dias · ${diasT3[0]?.date} a ${diasT3[diasT3.length - 1]?.date}`);

  if (fallasTC) { console.log(`\nFALLA: ${fallasTC} en los torneos continentales.`); process.exit(1); }
}
