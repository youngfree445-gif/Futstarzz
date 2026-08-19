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

import { CLUBS_DATABASE } from '../src/data';
import {
  fixturesForClub, fixturesAtStep, pickPrimary, esUltimaFechaDelTorneo,
  esUltimoPartidoDeLaCopa, torneoDelClubEnFecha, partidosDeLaMismaLlave, fechasDePlayoffDelTorneo,
} from '../src/dateSchedule';
import {
  simulateMatch, getOrCreateSeasonForLeague, resolvePlayerWeekForLeague, leagueKeyFor, sortTable,
  getOrCreateCupState, getUpcomingCupMatch, isClubStillInCup, resolveCupWeek,
  getLibertadoresParticipants, getSudamericanaParticipants,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState,
  getUpcomingUefaCupMatch, isClubStillInUefaCup, resolveUefaCupWeek,
  prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, crucePlayoffDeLiga, rondaDelPlayoff, resolverPasoCopaNacional,
  terminarTorneoSinElJugador,
  CAREER_START_YEAR, roundLabelByMatchCount,
} from '../src/leagueEngine';
import { crearCopaNacional, cruceActual, rondaActual, sigueEnCopa } from '../src/copaNacional';
import { clubesDeLiga } from '../src/clubesJugables';
import type { Club } from '../src/types';

const NOMBRE = process.argv[2] || 'Junior de Barranquilla';
const club = CLUBS_DATABASE.find(c => c.name === NOMBRE)!;
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

const jugados: Record<string, number> = {};
const resultados: string[] = [];
let pasosDeCopa = 0;

const fechas = fixturesForClub(club.name).filter(f => f.temporada === 1);
console.log(`===== CARRERA: ${jugador.nombre} · ${club.name} · temporada ${CAREER_START_YEAR} =====`);
console.log(`${fechas.length} fechas en el calendario · copa continental: ${cupIdMio ?? uefaIdMio ?? 'ninguna'}\n`);

// ------------------------------------------------------------------ se juega
for (let paso = 1; paso <= fechas.length + 5; paso++) {
  const hoy = fixturesAtStep(club.name, paso);
  if (!hoy || hoy.fixtures[0]?.temporada !== 1) break;
  const fx = pickPrimary(hoy.fixtures);
  if (!fx) continue;

  const esLiga = fx.competition.kind === 'league';
  const esPlayoff = hoy.fixtures.some(f => f.esPlayoff);
  const esContinental = fx.competition.kind === 'continental_cup';
  const esNacional = fx.competition.kind === 'domestic_cup';
  const esMundial = fx.competition.kind === 'national_tournament';
  if (esMundial) continue;   // el Mundial es con la selección, no con el club

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
  } else if (esContinental && cupIdMio) {
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
  } else if (esContinental && uefaIdMio && uefa) {
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
    const r = CLUBS_DATABASE.find(c => c.name === fx.opponentName);
    rivalId = r?.id ?? null;
    if (!rivalId) { raro(`rival del calendario sin club en la base: "${fx.opponentName}" (${fx.competition.name}, ${hoy.date})`); continue; }
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
  } else if (esContinental && cupIdMio) {
    continental = resolveCupWeek(continental, CLUBS_DATABASE as Club[], club.id, local, misGoles, susGoles);
  } else if (esContinental && uefaIdMio && uefa) {
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

const jugadasDeLiga = jugados['Liga BetPlay Dimayor'] ?? jugados[Object.keys(jugados).find(k => /Liga|Primera|LaLiga|Serie|Premier/.test(k)) ?? ''] ?? 0;
if (jugadasDeLiga < 30) raro(`sólo ${jugadasDeLiga} fechas de liga jugadas en toda la temporada`);

// Los titulos se leen del ESTADO FINAL, no se van anotando durante la temporada: una final que se
// resuelve al cerrar el torneo (terminarTorneoSinElJugador) no pasa por el paso del partido, y el
// informe decia "CAMPEON" arriba y "titulos: ninguno" abajo.
jugador.titulos = [];
if (copaNacional.championId === club.id) jugador.titulos.push(`Copa nacional ${CAREER_START_YEAR}`);
if (continental.knockout?.championId === club.id) jugador.titulos.push(`Copa ${cupIdMio} ${CAREER_START_YEAR}`);
for (const [sem, b] of Object.entries(playoffs)) if (b.championId === club.id) jugador.titulos.push(`${sem} ${CAREER_START_YEAR}`);

console.log('\n--- TU JUGADOR ---');
console.log(`   ${jugador.nombre}, ${jugador.edad} años, ${jugador.posicion} · ${club.name}`);
console.log(`   ${jugador.partidos} partidos · ${jugador.goles} goles · ${jugador.asistencias} asistencias`);
console.log(`   títulos: ${jugador.titulos.length ? jugador.titulos.join(', ') : 'ninguno'}`);

console.log('\n--- RAREZAS ENCONTRADAS ---');
if (!rarezas.length) console.log('   ninguna');
for (const r of rarezas) console.log(`   · ${r}`);
process.exit(rarezas.length ? 1 : 0);
