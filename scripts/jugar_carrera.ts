// Juega una temporada completa contra el motor real y exige que TODO tenga desenlace.
//
//   npm run jugar
//
// No reemplaza jugar a mano -- no toca React ni la UI -- pero recorre el calendario del club paso a
// paso igual que App.tsx: mira qué se juega ese día, saca el rival de donde corresponda (calendario,
// cuadro de copa, cuadro de playoff), simula el partido y avanza el estado del motor. Al final
// pregunta lo único que importa de una temporada: ¿cómo terminó cada competición?
//
// Existe porque "la copa desapareció del calendario" es un bug que ningún validador de estructura
// podía ver: el calendario estaba perfecto, los cuadros estaban perfectos, y sin embargo el torneo
// se congelaba a mitad de camino. Lo único que lo delata es jugarlo hasta el final.

import {
  CLUBS_DATABASE, WORLD_CUP_TEAMS_DATABASE, ALL_NATIONAL_TEAMS_DATABASE,
  NATIONALITY_TO_WORLD_CUP_TEAM_ID,
} from '../src/data';
import {
  fixturesForClub, fixturesAtStep, pickPrimary, esUltimaFechaDelTorneo,
  esUltimoPartidoDeLaCopa, torneoDelClubEnFecha, partidosDeLaMismaLlave, fechasDePlayoffDelTorneo,
  RIVAL_POR_SORTEAR,
  torneoDeSeleccionesDelDia, pasosDeMundialTranscurridos, pasosDeContinentalTranscurridos,
  mercadoAbierto, fechaDelPaso, pasoAlCambiarDeClub,
  cicloDeEliminatorias, pasosDeEliminatoriasTranscurridos, anioDeCarrera,
} from '../src/dateSchedule';
import {
  simulateMatch, getOrCreateSeasonForLeague, resolvePlayerWeekForLeague, leagueKeyFor, sortTable,
  getOrCreateCupState, getUpcomingCupMatch, isClubStillInCup, resolveCupWeek,
  getLibertadoresParticipants, getSudamericanaParticipants,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState,
  getUpcomingUefaCupMatch, isClubStillInUefaCup, resolveUefaCupWeek,
  terminarCopaContinental, terminarCopaUefa,
  prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, crucePlayoffDeLiga, rondaDelPlayoff, resolverPasoCopaNacional,
  terminarTorneoSinElJugador,
  CAREER_START_YEAR, roundLabelByMatchCount,
  getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek,
  type TorneoDeSelecciones,
} from '../src/leagueEngine';
import { crearCopaNacional, cruceActual, rondaActual, sigueEnCopa } from '../src/copaNacional';
import { clubesDeLiga } from '../src/clubesJugables';
import { generateTransferOffers, rendimientoDe } from '../src/transferMarket';
import {
  CONFEDERACION_POR_SELECCION, torneoContinentalDe,
  seleccionesDeLaEurocopa, seleccionesDeLaCopaAmerica,
  crearEliminatoria, ponerAlDiaLaEliminatoria, proximoPartidoDeEliminatoria,
  tablaDeEliminatoria, resolverPasoEliminatoria, eliminatoriaTerminada,
} from '../src/eliminatorias';
import type { Club } from '../src/types';

const NOMBRE = process.argv[2] || 'Junior de Barranquilla';
const club = CLUBS_DATABASE.find(c => c.name === NOMBRE)!;
// Un nombre mal escrito reventaba con "Cannot read properties of undefined (reading 'league')" seis
// llamadas mas adentro, en el motor, que no tiene nada que ver. Costo un rato entender que el club
// simplemente no existia con ese nombre.
if (!club) {
  const parecidos = CLUBS_DATABASE
    .filter(c => NOMBRE.split(/\s+/).some(t => t.length > 3 && c.name.toLowerCase().includes(t.toLowerCase())))
    .slice(0, 6).map(c => c.name);
  console.log(`No hay ningun club llamado "${NOMBRE}".`);
  if (parecidos.length) console.log(`Quisiste decir: ${parecidos.join(' · ')}`);
  process.exit(1);
}
const leagueKey = leagueKeyFor(club);
const leagueClubs = clubesDeLiga(leagueKey);
const nom = (id: string) => CLUBS_DATABASE.find(c => c.id === id)?.name ?? id;

const rarezas: string[] = [];
const raro = (q: string) => { if (!rarezas.includes(q)) rarezas.push(q); };

// ------------------------------------------------------------------ el jugador
const jugador = {
  nombre: 'Camilo Restrepo', posicion: 'MC', edad: 17,
  goles: 0, asistencias: 0, partidos: 0, titulos: [] as string[],
};

// ------------------------------------------------------------------ estado del motor
let season = getOrCreateSeasonForLeague(leagueClubs, undefined, 1);
let copaNacional = crearCopaNacional(club.league, 1, CLUBS_DATABASE, c => (c.division === 2 ? 2 : 1));
let continental = getOrCreateCupState('libertadores', 1, CLUBS_DATABASE as Club[], undefined, 0);
// Un cuadro POR SEMESTRE, igual que App.tsx (clave liga|temporada|torneo): el Apertura y el
// Clausura son dos torneos distintos y cada uno corona su propio campeon.
const playoffs: Record<string, any> = {};
const cupIdMio = getLibertadoresParticipants(CLUBS_DATABASE as Club[], 1, undefined).includes(club.id)
  ? 'libertadores'
  : getSudamericanaParticipants(CLUBS_DATABASE as Club[], 1, undefined).includes(club.id) ? 'sudamericana' : null;
if (cupIdMio) continental = getOrCreateCupState(cupIdMio as any, 1, CLUBS_DATABASE as Club[], undefined, 0);

// LAS COPAS EUROPEAS TAMBIEN SE JUEGAN. Este validador no las conocia -- cero referencias a UEFA --
// asi que con un club europeo cada dia de Champions apartado caia al camino del calendario, cuyo
// rival ese dia es el cartel "Por definir", y salia como rareza. Osea que la unica herramienta que
// juega temporadas enteras estaba CIEGA a las dos copas de media Europa: ni el cuadro, ni el
// campeon, ni los partidos del jugador se comprobaban nunca.
const uefaIdMio: 'champions' | 'europa' | null =
  getChampionsParticipants(CLUBS_DATABASE as Club[], 1).includes(club.id) ? 'champions'
  : getEuropaParticipants(CLUBS_DATABASE as Club[], 1).includes(club.id) ? 'europa' : null;
let uefa = uefaIdMio ? getOrCreateUefaCupState(uefaIdMio, CLUBS_DATABASE as Club[], undefined, 0) : null;

// El nombre de MI copa. Sin el, cualquier dia continental se trataba como dia de mi copa, y los
// partidos de la OTRA -- la Sudamericana a la que baja el tercero del grupo de Libertadores -- le
// hacian avanzar un paso al cuadro que no era. Es el mismo error que tenia el motor en
// fechasDeCopaTranscurridas, replicado aca adentro.
const nombreDeMiCopa = cupIdMio === 'libertadores' ? 'Copa Libertadores'
  : cupIdMio === 'sudamericana' ? 'Copa Sudamericana'
  : uefaIdMio === 'champions' ? 'Champions League'
  : uefaIdMio === 'europa' ? 'Europa League' : null;
const esDeMiCopa = (n: string) => n === nombreDeMiCopa;

const jugados: Record<string, number> = {};
// Las copas continentales que el club juega SIN cuadro en el motor.
//
// Pasa de verdad y con doce clubes de Conmebol: el tercero de un grupo de Libertadores baja a la
// Sudamericana, y el calendario real trae esos partidos. El motor no le arma cuadro -- el club no
// figura entre los participantes de esa otra copa -- asi que los partidos se juegan contra el rival
// del calendario y nadie sabe como termino. El validador los jugaba en silencio: aparecian en la
// lista de partidos y no en la de desenlaces, que es la mitad que importa.
const copasSinCuadro: Record<string, number> = {};
const resultados: string[] = [];
let pasosDeCopa = 0;

// ------------------------------------------------------------------ el mercado de pases
//
// El otro punto ciego que tenia este validador. El mercado es la parte del juego que MUEVE al
// jugador de un club a otro, y nunca se habia ejercitado de punta a punta: ni las ofertas, ni el
// umbral que las vuelve alcanzables, ni -- sobre todo -- que pasa con el reloj de la carrera cuando
// el traspaso se acepta.
//
// Ese ultimo punto ya dio un bug de los grandes: un "paso" es la N-esima FECHA DE TU CLUB, asi que
// el mismo numero cae en momentos distintos del anio segun donde juegues (el paso 40 es el 17 de
// febrero para el Benfica y el 2 de agosto para el Santos). Al fichar, el juego seguia con el mismo
// numero contra el calendario nuevo, y la carrera saltaba meses. Ver pasoAlCambiarDeClub.
//
// ACLARACION SOBRE EL ALCANCE: aca se comprueban las ofertas y a donde caeria el traspaso. La
// temporada se sigue jugando con UN club: mudarse a mitad de anio obliga a rehacer el estado de liga,
// copa y cuadrangular, y eso es otro trabajo. Lo que este validador cubre, lo cubre de verdad; lo
// que no, no lo simula.
const perfilDeMercado = () => ({
  currentClubId: club.id,
  prestige: Math.min(99, 30 + jugador.goles * 2 + jugador.titulos.length * 5),
  agent: null,
  attributes: { ritmo: 70, tiro: 70, pase: 70, regate: 70, defensa: 60, fisico: 70 },
  careerStats: {
    partidosHistoricos: jugador.partidos,
    golesHistoricos: jugador.goles,
    asistenciasHistoricos: jugador.asistencias,
    campeonatos: jugador.titulos.length,
  },
} as any);

const mercado = {
  pasosAbiertos: 0,
  ofertas: 0,
  alcanzables: 0,
  mejor: null as null | { club: string; salario: number; req: number },
  traspasos: [] as string[],
};

// ------------------------------------------------------------------ el torneo de selecciones
//
// LA TEMPORADA NO ES SOLO DEL CLUB. En junio se para todo y se juega el Mundial -- o, en los anos
// del medio, la Eurocopa y la Copa America -- y este validador lo SALTEABA: la linea decia "el
// Mundial es con la seleccion, no con el club" y seguia de largo. Osea que la unica herramienta que
// juega temporadas enteras nunca jugo un Mundial.
//
// Lo que costo esa ceguera: el Mundial no coronaba campeon NUNCA. Le faltaba la funcion que arma la
// ronda siguiente de un cuadro a partido unico, se congelaba en la ronda de 32 y ahi se quedaba
// hasta que la temporada terminaba. Un torneo entero, en todas las carreras, desde siempre.
//
// La nacionalidad sale del CLUB, que es de donde tiene que salir en un validador: `league` guarda el
// gentilicio ('Colombiana', 'Espanola') y es la misma clave con la que el juego busca tu seleccion.
// Asi, jugar con Junior prueba la Copa America y jugar con el Barcelona prueba la Eurocopa.
const miSeleccionId: string | null = NATIONALITY_TO_WORLD_CUP_TEAM_ID[club.league] ?? null;
const nomSel = (id: string) => ALL_NATIONAL_TEAMS_DATABASE.find(s => s.id === id)?.name ?? nom(id);

const NOMBRE_DEL_TORNEO: Record<TorneoDeSelecciones, string> = {
  mundial: 'Copa Mundial FIFA', eurocopa: 'Eurocopa', copaamerica: 'Copa America',
};

const equiposDe = (t: TorneoDeSelecciones): Club[] =>
  t === 'mundial' ? (WORLD_CUP_TEAMS_DATABASE as Club[])
  : t === 'eurocopa' ? seleccionesDeLaEurocopa(ALL_NATIONAL_TEAMS_DATABASE)
  : seleccionesDeLaCopaAmerica(ALL_NATIONAL_TEAMS_DATABASE);

/**
 * Cual de los tres torneos ocupa el dia, o null si a tu seleccion no le toca ninguno.
 *
 * El calendario aparta la ventana y dice si es la del Mundial o la de los continentales; CUAL de
 * los dos continentales te toca lo decide tu confederacion, no el calendario. Un asiatico o un
 * africano no juega ninguno de los dos: para el es un parate a secas.
 */
const torneoDeHoy = (paso: number): TorneoDeSelecciones | null => {
  const cual = torneoDeSeleccionesDelDia(club.name, paso);
  if (!cual) return null;
  if (cual === 'mundial') return 'mundial';
  return torneoContinentalDe(CONFEDERACION_POR_SELECCION[miSeleccionId ?? '']);
};

// Un estado por torneo, aunque en una temporada solo pueda haber uno: el Mundial y los
// continentales nunca caen el mismo ano.
const selecciones: Record<string, any> = {};

// ------------------------------------------------------------------ las eliminatorias
//
// El otro punto ciego que quedaba. Las fechas FIFA son dias de `national_tournament` igual que el
// Mundial, pero torneoDeSeleccionesDelDia devuelve null para ellas, asi que el bucle las salteaba
// sin decir nada: la clasificacion al Mundial -- que es un torneo de dieciocho fechas -- no se
// jugaba nunca en este validador.
//
// Y ahi hay algo que solo se ve jugandolo: la eliminatoria tiene que TERMINAR. Una tabla que se
// queda a mitad de camino deja al jugador sin saber si clasifico, y el Mundial de la temporada
// siguiente no se entera.
const eliminatoria = {
  clave: null as string | null,
  estado: null as any,
  partidos: 0,
  golesMios: 0,
};

// LA TEMPORADA A JUGAR. Por defecto la 1, y se puede pedir otra:
//
//   node scripts/jugar_carrera.ts "Junior de Barranquilla" 2
//
// Esto no es un lujo. Este validador SOLO habia jugado la temporada 1 en toda su vida, y la
// temporada 1 es un caso particular: es la unica con calendario importado de verdad. De la 2 en
// adelante las copas salen del cuadro del motor en vez del fragmento scrapeado, los clubes se
// permutan y las fechas se corren un anio -- es otro camino de codigo entero, sin probar.
//
// Y ademas es la unica forma de llegar a las ELIMINATORIAS: 2026 es anio de Mundial y no tiene
// ninguna fecha FIFA. Medido en el Junior: T1 tiene 0 fechas de eliminatorias, T2 tiene 4 y T4
// tiene 10.
const TEMPORADA = Math.max(1, Number(process.argv[3]) || 1);

const todasLasFechas = fixturesForClub(club.name);
const fechas = todasLasFechas.filter(f => f.temporada === TEMPORADA);
if (!fechas.length) {
  console.log(`El ${club.name} no tiene fechas en la temporada ${TEMPORADA}.`);
  process.exit(1);
}

// El paso de una carrera se cuenta de corrido a traves de las temporadas, asi que para arrancar en
// la temporada N hay que saltear los dias de las anteriores. Se cuentan DIAS distintos, no fixtures:
// un dia con dos partidos es un solo paso (ver fixturesAtStep).
const diasPrevios = new Set(todasLasFechas.filter(f => f.temporada < TEMPORADA).map(f => f.date));
const PASO_INICIAL = diasPrevios.size + 1;

console.log(`===== CARRERA: ${jugador.nombre} · ${club.name} · temporada ${CAREER_START_YEAR + TEMPORADA - 1} =====`);
console.log(`${fechas.length} fechas en el calendario · copa continental: ${cupIdMio ?? uefaIdMio ?? 'ninguna'}\n`);

// ------------------------------------------------------------------ se juega
for (let paso = PASO_INICIAL; paso <= PASO_INICIAL + fechas.length + 5; paso++) {
  const hoy = fixturesAtStep(club.name, paso);
  if (!hoy || hoy.fixtures[0]?.temporada !== TEMPORADA) break;
  const fx = pickPrimary(hoy.fixtures);
  if (!fx) continue;

  // ---- el mercado, cuando esta abierto
  if (mercadoAbierto(club.name, paso)) {
    mercado.pasosAbiertos++;
    const perfil = perfilDeMercado();
    const ofertas = generateTransferOffers(perfil, club, CLUBS_DATABASE as Club[], paso)
      .sort((a, b) => (b.possible === a.possible ? b.reqPrestige - a.reqPrestige : b.possible ? 1 : -1))
      .slice(0, 3);
    mercado.ofertas += ofertas.length;
    for (const o of ofertas) {
      if (!o.possible) continue;
      mercado.alcanzables++;
      const destino = CLUBS_DATABASE.find(c => c.id === o.clubId);
      if (!destino) { raro(`oferta de un club que no existe: ${o.clubId}`); continue; }
      if (!mercado.mejor || o.reqPrestige > mercado.mejor.req) {
        mercado.mejor = { club: destino.name, salario: o.salaryOffer, req: o.reqPrestige };
      }
      // A DONDE CAERIA el traspaso. No se muda el jugador (ver la aclaracion de alcance arriba),
      // pero SI se comprueba lo que rompia: que la carrera no viaje en el tiempo al cambiar de club.
      const hoy = fechaDelPaso(club.name, paso);
      const pasoAlla = pasoAlCambiarDeClub(destino.name, hoy);
      if (hoy && pasoAlla) {
        const alla = fechaDelPaso(destino.name, pasoAlla);
        if (alla && alla < hoy) raro(`fichar por ${destino.name} el ${hoy} devolveria la carrera a ${alla}`);
        if (alla) mercado.traspasos.push(`${destino.name} (${hoy} -> ${alla})`);
      } else if (hoy && !pasoAlla) {
        raro(`fichar por ${destino.name} el ${hoy} no encuentra ninguna fecha en su calendario`);
      }
    }
  }

  const esLiga = fx.competition.kind === 'league';
  const esPlayoff = hoy.fixtures.some(f => f.esPlayoff);
  const esContinental = fx.competition.kind === 'continental_cup';
  const esNacional = fx.competition.kind === 'domestic_cup';
  // ---- el torneo de selecciones, por el MISMO camino que App.tsx
  //
  // No se llama al motor de una para que resuelva el torneo entero: se recorre dia por dia igual
  // que el juego -- cuantas fechas pasaron, quien es el rival de hoy, se juega, se avanza -- porque
  // es en ese camino donde estaban los bugs, no en el motor resolviendo de corrido. El atajo pasa
  // en verde mientras el jugador ve un torneo congelado.
  if (fx.competition.kind === 'national_tournament') {
    // ---- FECHA FIFA: eliminatorias, no Mundial. Va primero porque comparte el `kind`.
    if (fx.competition.id === 'eliminatorias') {
      const conf = CONFEDERACION_POR_SELECCION[miSeleccionId ?? ''];
      const ciclo = cicloDeEliminatorias(anioDeCarrera(club.name, paso));
      if (!miSeleccionId || !conf || !ciclo) continue;

      const clave = `${conf}-${ciclo.mundial}`;
      if (eliminatoria.clave !== clave) { eliminatoria.clave = clave; eliminatoria.estado = null; }
      eliminatoria.estado = ponerAlDiaLaEliminatoria(
        eliminatoria.estado ?? crearEliminatoria(conf, ciclo.mundial, ALL_NATIONAL_TEAMS_DATABASE),
        ALL_NATIONAL_TEAMS_DATABASE,
        pasosDeEliminatoriasTranscurridos(club.name, paso),
        miSeleccionId,
      );

      const prox = proximoPartidoDeEliminatoria(eliminatoria.estado, miSeleccionId);
      if (!prox) continue;
      const yo = ALL_NATIONAL_TEAMS_DATABASE.find(t => t.id === miSeleccionId);
      const su = ALL_NATIONAL_TEAMS_DATABASE.find(t => t.id === prox.opponentId);
      if (!yo || !su) { raro(`${hoy.date}: rival de eliminatoria sin seleccion en la base`); continue; }
      if (prox.opponentId === miSeleccionId) raro(`${hoy.date}: tu seleccion se enfrenta a SI MISMA en eliminatorias`);

      const simE = prox.isHome ? simulateMatch(yo, su) : simulateMatch(su, yo);
      const misE = prox.isHome ? simE.homeGoals : simE.awayGoals;
      const susE = prox.isHome ? simE.awayGoals : simE.homeGoals;
      // La firma pide teamId/goals/opponentGoals -- la localia ya la sabe el fixture.
      eliminatoria.estado = resolverPasoEliminatoria(
        eliminatoria.estado, ALL_NATIONAL_TEAMS_DATABASE,
        { teamId: miSeleccionId, goals: misE, opponentGoals: susE });
      eliminatoria.partidos++;
      eliminatoria.golesMios += misE;
      jugador.partidos++;
      if (misE > 0 && Math.random() < 0.3) jugador.goles++;
      jugados['Eliminatorias'] = (jugados['Eliminatorias'] ?? 0) + 1;
      continue;
    }

    const cual = torneoDeHoy(paso);
    if (!cual) continue;
    const equipos = equiposDe(cual);
    const pasos = cual === 'mundial'
      ? pasosDeMundialTranscurridos(club.name, paso)
      : pasosDeContinentalTranscurridos(club.name, paso);
    // El torneo avanza SIEMPRE, juegue tu seleccion o no: si no clasificaste, el Mundial se juega
    // igual y tiene campeon. Es lo mismo que hacen los cuadros de copa cuando quedas eliminado.
    selecciones[cual] = getOrCreateWorldCupState(1, equipos, selecciones[cual], pasos, cual);

    const juego = miSeleccionId && equipos.some(e => e.id === miSeleccionId);
    const prox = juego ? getUpcomingWorldCupMatch(selecciones[cual], miSeleccionId!) : null;
    if (!prox) continue;

    const yo = equipos.find(e => e.id === miSeleccionId)!;
    const rivalSel = equipos.find(e => e.id === prox.opponentId);
    if (!rivalSel) { raro(`${hoy.date}: rival sin seleccion en la base en ${NOMBRE_DEL_TORNEO[cual]}`); continue; }
    if (prox.opponentId === miSeleccionId) raro(`${hoy.date}: tu seleccion se enfrenta a SI MISMA en ${NOMBRE_DEL_TORNEO[cual]}`);

    const simS = prox.isHome ? simulateMatch(yo, rivalSel) : simulateMatch(rivalSel, yo);
    const misS = prox.isHome ? simS.homeGoals : simS.awayGoals;
    const susS = prox.isHome ? simS.awayGoals : simS.homeGoals;
    jugador.partidos++;
    if (misS > 0 && Math.random() < 0.35) jugador.goles++;
    jugados[NOMBRE_DEL_TORNEO[cual]] = (jugados[NOMBRE_DEL_TORNEO[cual]] ?? 0) + 1;
    selecciones[cual] = resolveWorldCupWeek(selecciones[cual], equipos, miSeleccionId!, prox.isHome, misS, susS);
    continue;
  }

  // ---- de dónde sale el rival
  let rivalId: string | null = null;
  let local = fx.isHome;
  let etiqueta = fx.competition.name;

  if (esPlayoff) {
    const sem = torneoDelClubEnFecha(club.name, hoy.date) ?? 'Playoff';
    // El cuadro se dimensiona a las fechas que el semestre tenga apartadas, igual que en App.tsx:
    // sin eso, un semestre corto (la Primera Nacional en año de Mundial) arma un cuadro de ocho que
    // no le entra y se queda sin campeon.
    playoffs[sem] = prepararPlayoffDeLiga(
      playoffs[sem], season.table, fechasDePlayoffDelTorneo(club.name, hoy.date));
    const cruce = crucePlayoffDeLiga(playoffs[sem], club.id);
    // Eliminado: el cuadrangular sigue sin vos hasta la final, igual que en App.tsx.
    if (!cruce) { playoffs[sem] = terminarTorneoSinElJugador(playoffs[sem], (b: any) => resolverPasoPlayoffDeLiga(b, leagueClubs)); continue; }
    rivalId = cruce.clubAId === club.id ? cruce.clubBId : cruce.clubAId;
    local = cruce.firstLegGoalsA === null ? cruce.clubAId === club.id : cruce.clubBId === club.id;
    etiqueta = `Cuadrangular ${sem} · ${rondaDelPlayoff(playoffs[sem])}`;
  } else if (esContinental && cupIdMio && esDeMiCopa(fx.competition.name)) {
    // El cuadro avanza SIEMPRE que llega un dia de copa, haya partido tuyo o no: cuando terminan
    // los grupos hace falta un paso para sembrar el knockout, y si ese paso no se da la copa se
    // queda congelada en 'groups' para siempre. Es lo que hace App.tsx con pasosDeCopaTranscurridos.
    pasosDeCopa++;
    continental = getOrCreateCupState(cupIdMio as any, 1, CLUBS_DATABASE as Club[], continental, pasosDeCopa);
    if (!isClubStillInCup(continental, club.id)) { continue; }
    const prox = getUpcomingCupMatch(continental, club.id);
    if (!prox) { continue; }
    rivalId = prox.opponentId; local = prox.isHome;
    etiqueta = fx.competition.name;
  } else if (esContinental && uefaIdMio && uefa && esDeMiCopa(fx.competition.name)) {
    // Mismo trato que la Conmebol: el cuadro avanza cada dia de copa, haya partido tuyo o no.
    pasosDeCopa++;
    uefa = getOrCreateUefaCupState(uefaIdMio, CLUBS_DATABASE as Club[], uefa, pasosDeCopa, undefined, undefined, club.id);
    if (!isClubStillInUefaCup(uefa, club.id)) { continue; }
    const prox = getUpcomingUefaCupMatch(uefa, club.id);
    if (!prox) { continue; }
    rivalId = prox.opponentId; local = prox.isHome;
    etiqueta = fx.competition.name;
  } else if (esNacional && !/Superliga/i.test(fx.competition.name)) {
    if (!sigueEnCopa(copaNacional, club.id) || copaNacional.championId) {
      copaNacional = terminarTorneoSinElJugador(copaNacional, c => resolverPasoCopaNacional(c, CLUBS_DATABASE));
      continue;
    }
    const cruce = cruceActual(copaNacional, club.id);
    if (!cruce) { continue; }
    rivalId = cruce.clubAId === club.id ? cruce.clubBId : cruce.clubAId;
    local = cruce.firstLegGoalsA === null ? cruce.clubAId === club.id : cruce.clubBId === club.id;
    etiqueta = `${fx.competition.name} · ${rondaActual(copaNacional)}`;
  } else {
    // Un dia RESERVADO al que no lo reclamo ningun cuadro es un DIA LIBRE, no un dato roto: el
    // calendario le aparta dias a las dos copas continentales del pais y el club juega una sola. En
    // el juego es la tarjeta de "Hoy no se juega". Avisarlo como rareza llenaba la lista de ruido y
    // es justo lo que le saca valor a una lista de rarezas.
    if (fx.opponentName === RIVAL_POR_SORTEAR) { continue; }
    const r = CLUBS_DATABASE.find(c => c.name === fx.opponentName);
    rivalId = r?.id ?? null;
    if (!rivalId) { raro(`rival del calendario sin club en la base: "${fx.opponentName}" (${fx.competition.name}, ${hoy.date})`); continue; }
    if (esContinental) copasSinCuadro[fx.competition.name] = (copasSinCuadro[fx.competition.name] ?? 0) + 1;
  }

  const rival = CLUBS_DATABASE.find(c => c.id === rivalId);
  if (!rival) continue;
  if (rivalId === club.id) raro(`${hoy.date}: el club se enfrenta a SI MISMO en ${etiqueta}`);

  // ---- se simula
  const sim = local ? simulateMatch(club, rival) : simulateMatch(rival, club);
  const misGoles = local ? sim.homeGoals : sim.awayGoals;
  const susGoles = local ? sim.awayGoals : sim.homeGoals;
  jugador.partidos++;
  const mios = Math.min(misGoles, Math.random() < 0.35 ? 1 : 0);
  jugador.goles += mios;
  if (!mios && misGoles > 0 && Math.random() < 0.3) jugador.asistencias++;
  jugados[etiqueta.split(' · ')[0]] = (jugados[etiqueta.split(' · ')[0]] ?? 0) + 1;

  // ---- se avanza el estado
  if (esPlayoff) {
    const sem = torneoDelClubEnFecha(club.name, hoy.date) ?? 'Playoff';
    playoffs[sem] = resolverPasoPlayoffDeLiga(playoffs[sem], leagueClubs, { clubId: club.id, isHome: local, goals: misGoles, opponentGoals: susGoles });
    if (playoffs[sem].championId === club.id) jugador.titulos.push(`${sem} ${CAREER_START_YEAR}`);
  } else if (esLiga) {
    season = resolvePlayerWeekForLeague(season, leagueClubs, paso, club.id, local, misGoles, susGoles, undefined,
      { fecha: hoy.date, temporada: 1 });
    if (esUltimaFechaDelTorneo(club.name, hoy.date)) {
      const t = sortTable([...season.table]);
      const torneo = torneoDelClubEnFecha(club.name, hoy.date);
      resultados.push(`${torneo} ${CAREER_START_YEAR}: ${t.findIndex(r => r.clubId === club.id) + 1}º de ${t.length}  (campeón de la fase regular: ${t[0]?.name})`);
    }
  } else if (esContinental && cupIdMio && esDeMiCopa(fx.competition.name)) {
    continental = resolveCupWeek(continental, CLUBS_DATABASE as Club[], club.id, local, misGoles, susGoles);
  } else if (esContinental && uefaIdMio && uefa && esDeMiCopa(fx.competition.name)) {
    uefa = resolveUefaCupWeek(uefa, CLUBS_DATABASE as Club[], club.id, local, misGoles, susGoles);
    if (uefa.championId === club.id) jugador.titulos.push(`${fx.competition.name} ${CAREER_START_YEAR}`);
  } else if (esNacional && !/Superliga/i.test(fx.competition.name)) {
    copaNacional = resolverPasoCopaNacional(copaNacional, CLUBS_DATABASE, { clubId: club.id, isHome: local, goals: misGoles, opponentGoals: susGoles });
    if (copaNacional.championId === club.id) jugador.titulos.push(`${fx.competition.name} ${CAREER_START_YEAR}`);
  } else if (esUltimoPartidoDeLaCopa(club.name, fx.competition.id, hoy.date)) {
    // Superliga: llave del calendario real, se corona por global igual que en App.tsx
    const previas = partidosDeLaMismaLlave(club.name, fx.competition.id, hoy.date);
    if (misGoles >= susGoles && previas.length <= 1) jugador.titulos.push(`${fx.competition.name} ${CAREER_START_YEAR}`);
  }
}

// ------------------------------------------------------------------ desenlaces
// Fin de temporada: los torneos que el jugador dejo a mitad se terminan igual.
copaNacional = terminarTorneoSinElJugador(copaNacional, c => resolverPasoCopaNacional(c, CLUBS_DATABASE));
// Las continentales tambien, igual que hace App.tsx cuando se quedan sin fechas (ver
// cerrarCopasContinentalesVencidas). Sin esto el validador reportaba "SIN TERMINAR" una copa que en
// el juego SI corona: el aviso apuntaba al motor cuando el que no cerraba era el validador.
if (cupIdMio) continental = terminarCopaContinental(continental, CLUBS_DATABASE as Club[]);
if (uefaIdMio && uefa) uefa = terminarCopaUefa(uefa, CLUBS_DATABASE as Club[]);
for (const k of Object.keys(playoffs)) playoffs[k] = terminarTorneoSinElJugador(playoffs[k], (b: any) => resolverPasoPlayoffDeLiga(b, leagueClubs));

console.log('--- PARTIDOS JUGADOS POR COMPETICIÓN ---');
for (const [k, v] of Object.entries(jugados)) console.log(`   ${String(v).padStart(3)}  ${k}`);

console.log('\n--- DESENLACE DE CADA COMPETICIÓN ---');
for (const r of resultados) console.log(`   ${r}`);

const desenlace = (nombre: string, campeon: string | null, sigo: boolean, ronda: string) =>
  console.log(`   ${nombre.padEnd(26)} ${campeon === club.id ? 'CAMPEÓN' : campeon ? `eliminado · campeón ${nom(campeon)}` : sigo ? `SIN TERMINAR (quedó en ${ronda})` : `eliminado en ${ronda}`}`);

desenlace('Copa nacional', copaNacional.championId, sigueEnCopa(copaNacional, club.id), rondaActual(copaNacional));
if (cupIdMio) {
  const ronda = continental.knockout?.tiesByRound[continental.knockout.tiesByRound.length - 1];
  desenlace(`Copa ${cupIdMio}`, continental.knockout?.championId ?? null,
    isClubStillInCup(continental, club.id), ronda ? roundLabelByMatchCount(ronda.length) : (continental.stage ?? '?'));
}
if (uefaIdMio && uefa) {
  const ronda = uefa.knockout?.tiesByRound[uefa.knockout.tiesByRound.length - 1];
  desenlace(uefaIdMio === 'champions' ? 'Champions League' : 'Europa League',
    uefa.championId ?? uefa.knockout?.championId ?? null,
    isClubStillInUefaCup(uefa, club.id), ronda ? roundLabelByMatchCount(ronda.length) : (uefa.stage ?? '?'));
}
// EL TORNEO DE SELECCIONES TIENE QUE CORONAR. Es el invariante que faltaba: el Mundial se congelaba
// en la ronda de 32 y la temporada terminaba sin campeon, sin que nada lo dijera.
for (const [t, estado] of Object.entries(selecciones)) {
  const campeon: string | null = estado.championId ?? estado.knockout?.championId ?? null;
  const etiqueta = NOMBRE_DEL_TORNEO[t as TorneoDeSelecciones];
  console.log(`   ${etiqueta.padEnd(26)} ${
    campeon === miSeleccionId ? 'CAMPEON con tu seleccion'
    : campeon ? `campeon ${nomSel(campeon)}`
    : `SIN CAMPEON (quedo en ${estado.stage})`}`);
  if (!campeon) raro(`${etiqueta} termino la temporada SIN campeon (quedo en ${estado.stage})`);
}
// Que el torneo no se juegue tampoco puede pasar en silencio: si el calendario aparta las fechas y
// tu seleccion existe, algo tuvo que pasar esos dias.
// Las fechas FIFA NO son un torneo de selecciones: comparten el `kind` pero son otra cosa. Sin
// excluirlas, cualquier temporada sin Mundial ni continental -- que son la mitad -- avisaba que
// "no se jugo ningun torneo" teniendo la eliminatoria jugada al lado.
if (!Object.keys(selecciones).length && miSeleccionId
    && fechas.some(f => f.competition.kind === 'national_tournament' && f.competition.id !== 'eliminatorias')) {
  raro('el calendario aparta fechas de selecciones y no se jugo ningun torneo');
}

for (const [nombre, n] of Object.entries(copasSinCuadro)) {
  console.log(`   ${nombre.padEnd(26)} ${n} partido(s) del calendario · SIN CUADRO en el motor, no hay campeon`);
}
for (const [sem, b] of Object.entries(playoffs)) {
  desenlace(`Cuadrangular ${sem}`, b.championId, !!crucePlayoffDeLiga(b, club.id), rondaDelPlayoff(b));
}
// Solo es raro donde el semestre SE DEFINE con un cuadro. LaLiga y el Brasileirao coronan por
// tabla, y avisar ahi convertia la lista de rarezas en algo que hay que aprender a ignorar --
// que es justo lo que le saca valor a una lista de rarezas.
if (fechas.some(f => f.esPlayoff) && !Object.keys(playoffs).length) {
  raro('la liga tiene fechas de cuadrangular pero no se jugo ninguno');
}
for (const [sem, b] of Object.entries(playoffs)) if (!b.championId) raro(`el cuadrangular del ${sem} termino SIN campeon`);

// ---- invariantes: lo que NO puede pasar
if (!copaNacional.championId) raro(`la copa nacional terminó la temporada SIN campeón (quedó en ${rondaActual(copaNacional)})`);
if (cupIdMio && !continental.knockout?.championId) raro(`la ${cupIdMio} terminó la temporada SIN campeón`);

// LAS FECHAS DE LIGA QUE EL CALENDARIO TRAIA, contra las que se jugaron.
//
// Antes el nombre de la liga se adivinaba con una expresion regular -- /Liga|Primera|LaLiga|Serie|
// Premier/ -- y se comparaba contra un minimo fijo de 30. La Bundesliga, la Ligue 1 y la Eredivisie
// no entran en esa lista: con el Bayern, el PSG o el Ajax el informe decia "solo 0 fechas de liga
// jugadas" habiendose jugado las 34. Tres avisos falsos de una, que es exactamente lo que ensena a
// ignorar la lista de rarezas.
//
// Ahora no se adivina nada: el nombre sale del calendario y el numero tambien. Y de paso el aviso
// pasa a ser una pregunta que vale la pena -- ¿se jugaron TODAS? -- en vez de un minimo inventado.
const nombreDeLaLiga = fechas.find(f => f.competition.kind === 'league')?.competition.name ?? null;
const fechasDeLigaDelCalendario = fechas.filter(f => f.competition.kind === 'league' && !f.esPlayoff).length;
const jugadasDeLiga = nombreDeLaLiga ? (jugados[nombreDeLaLiga] ?? 0) : 0;

// LAS FECHAS QUE OCUPA UNA FECHA FIFA NO SE PIERDEN. Ese dia te vas con tu seleccion y el club juega
// igual, sin vos (ver partidoDeLigaSinVos en App.tsx): el partido de liga se juega, sos vos el que
// no esta. Contarlas como perdidas hacia que la temporada 2 del Junior avisara que faltaban dos
// fechas de liga cuando en realidad eran los dos dias de eliminatorias.
const diasDeFechaFifa = new Set(
  fechas.filter(f => f.competition.id === 'eliminatorias').map(f => f.date));
const fechasDeLigaJugables = fechas.filter(f =>
  f.competition.kind === 'league' && !f.esPlayoff && !diasDeFechaFifa.has(f.date)).length;

if (nombreDeLaLiga && jugadasDeLiga < fechasDeLigaJugables) {
  raro(`${nombreDeLaLiga}: el calendario traía ${fechasDeLigaJugables} fechas jugables y se jugaron ${jugadasDeLiga}`);
}

// Los titulos se leen del ESTADO FINAL, no se van anotando durante la temporada: una final que se
// resuelve al cerrar el torneo (terminarTorneoSinElJugador) no pasa por el paso del partido, y el
// informe decia "CAMPEON" arriba y "titulos: ninguno" abajo.
jugador.titulos = [];
if (copaNacional.championId === club.id) jugador.titulos.push(`Copa nacional ${CAREER_START_YEAR}`);
if (continental.knockout?.championId === club.id) jugador.titulos.push(`Copa ${cupIdMio} ${CAREER_START_YEAR}`);
for (const [sem, b] of Object.entries(playoffs)) if (b.championId === club.id) jugador.titulos.push(`${sem} ${CAREER_START_YEAR}`);
for (const [t, estado] of Object.entries(selecciones)) {
  const campeon = estado.championId ?? estado.knockout?.championId ?? null;
  if (campeon && campeon === miSeleccionId) jugador.titulos.push(`${NOMBRE_DEL_TORNEO[t as TorneoDeSelecciones]} ${CAREER_START_YEAR}`);
}

if (eliminatoria.estado) {
  const tabla = tablaDeEliminatoria(eliminatoria.estado, miSeleccionId!) ?? [];
  const puesto = tabla.findIndex((r: any) => r.clubId === miSeleccionId) + 1;
  console.log('\n--- ELIMINATORIAS ---');
  console.log(`   ${eliminatoria.partidos} partidos jugados · ${puesto || '?'}o de ${tabla.length}`);
  for (const r of tabla.slice(0, 4)) {
    console.log(`      ${(r.name ?? r.clubId).padEnd(24)} ${String(r.puntos).padStart(3)} pts`);
  }
  // Una eliminatoria que no llega a jugarse entera deja al jugador sin saber si clasifico, y el
  // Mundial de la temporada siguiente no se entera.
  if (eliminatoria.partidos === 0) raro('el calendario tiene fechas FIFA y no se jugo ni un partido de eliminatorias');
}

console.log('\n--- EL MERCADO DE PASES ---');
console.log(`   ${mercado.pasosAbiertos} fechas con el mercado abierto · ${mercado.ofertas} ofertas · ${mercado.alcanzables} alcanzables`);
if (mercado.mejor) console.log(`   la mas grande: ${mercado.mejor.club} (exige ${mercado.mejor.req}, ofrece ${mercado.mejor.salario})`);
for (const t of mercado.traspasos.slice(0, 3)) console.log(`   iria a ${t}`);
// Un mercado que nunca ofrece nada esta roto, y un mercado donde todo es alcanzable tambien.
if (mercado.pasosAbiertos && !mercado.ofertas) raro('el mercado estuvo abierto y no genero ni una oferta');

console.log('\n--- TU JUGADOR ---');
console.log(`   ${jugador.nombre}, ${jugador.edad} años, ${jugador.posicion} · ${club.name}`);
console.log(`   ${jugador.partidos} partidos · ${jugador.goles} goles · ${jugador.asistencias} asistencias`);
console.log(`   títulos: ${jugador.titulos.length ? jugador.titulos.join(', ') : 'ninguno'}`);

console.log('\n--- RAREZAS ENCONTRADAS ---');
if (!rarezas.length) console.log('   ninguna');
for (const r of rarezas) console.log(`   · ${r}`);
process.exit(rarezas.length ? 1 : 0);
