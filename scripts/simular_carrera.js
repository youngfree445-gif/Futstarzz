// Simula una carrera completa contra el motor real y reporta inconsistencias.
//
// No reemplaza jugar: no toca la UI ni React. Lo que hace es recorrer el calendario del club paso
// a paso, resolviendo cada partido con el motor, y verificar en cada paso que se cumplan las cosas
// que TIENEN que cumplirse (invariantes). Cuando una falla, queda anotada con el paso exacto.
//
// Uso: se compila con vite (importa data.ts, que trae PNGs) y se corre con node.

import { CLUBS_DATABASE } from '../src/data.ts';
import {
  fixturesForClub, fixturesAtStep, hasDatedSchedule, pickPrimary,
  esUltimoPartidoDeLaCopa, esUltimaFechaDelTorneo, torneoDelClubEnFecha,
  torneoDeFecha, partidosDeLaMismaLlave, CAREER_START_DATE,
} from '../src/dateSchedule.ts';
import {
  getOrCreateSeasonForLeague, resolvePlayerWeekForLeague, leagueKeyFor, getUpcomingMatchForLeague,
  sortTable, getSeasonYear, isApeturaClausuraLeague,
} from '../src/leagueEngine.ts';
import { getPalmares } from '../src/palmares.ts';
import { reglasDeLiga, tablaDeDescenso, resolverMovimientos } from '../src/promocionDescenso.ts';

const CLUB = process.argv[2] || 'Junior de Barranquilla';
const EDAD_INICIAL = 17;
const EDAD_RETIRO = 45;

const bugs = [];
const bug = (categoria, detalle) => bugs.push({ categoria, detalle });

const club = CLUBS_DATABASE.find(c => c.name === CLUB);
if (!club) { console.error(`no existe el club "${CLUB}"`); process.exit(1); }

console.log(`SIMULACION DE CARRERA -- ${club.name} (${club.league})`);
console.log(`calendario propio: ${hasDatedSchedule(club.name)}\n`);

// ---------------------------------------------------------------- 1. el calendario en si
const todas = fixturesForClub(club.name);
console.log(`--- CALENDARIO (${todas.length} partidos) ---`);
const porComp = {};
for (const f of todas) {
  const k = f.competition.name;
  (porComp[k] ??= { n: 0, kind: f.competition.kind, primera: f.date, ultima: f.date });
  porComp[k].n++;
  porComp[k].ultima = f.date;
}
for (const [nom, d] of Object.entries(porComp)) {
  console.log(`  ${nom.padEnd(24)} ${String(d.n).padStart(3)} part  ${d.primera} .. ${d.ultima}  [${d.kind}]`);
}

// Un club no puede jugar dos veces el mismo dia en la MISMA competicion.
const porFechaComp = new Map();
for (const f of todas) {
  const k = `${f.competition.id}|${f.date}`;
  if (porFechaComp.has(k)) bug('calendario', `doble partido de ${f.competition.name} el ${f.date}`);
  porFechaComp.set(k, f);
}

// Las fechas tienen que venir ordenadas: fixturesAtStep asume eso.
for (let i = 1; i < todas.length; i++) {
  if (todas[i].date < todas[i - 1].date) {
    bug('calendario', `fechas desordenadas: ${todas[i - 1].date} antes que ${todas[i].date}`);
    break;
  }
}

// El calendario tiene que arrancar en/despues del dia 1 de la carrera.
if (todas.length && todas[0].date < CAREER_START_DATE) {
  bug('calendario', `el primer partido (${todas[0].date}) es anterior al inicio de carrera (${CAREER_START_DATE})`);
}

// ---------------------------------------------------------------- 2. coronaciones
console.log(`\n--- CORONACIONES ---`);
const compIds = [...new Set(todas.map(f => f.competition.id))];
for (const cid of compIds) {
  const fs = todas.filter(f => f.competition.id === cid);
  const comp = fs[0].competition;
  if (comp.kind === 'league') continue;
  const corona = fs.filter(f => esUltimoPartidoDeLaCopa(club.name, cid, f.date));
  console.log(`  ${comp.name.padEnd(24)} ${String(fs.length).padStart(2)}p -> corona en ${corona.length}`);
  if (corona.length > 1) bug('coronacion', `${comp.name} corona en ${corona.length} fechas distintas`);
}

// Cierres de liga: uno por torneo, dos en Apertura/Clausura.
const deLiga = todas.filter(f => f.competition.kind === 'league');
const cierres = deLiga.filter(f => esUltimaFechaDelTorneo(club.name, f.date));
console.log(`  cierres de liga: ${cierres.length} -> ${cierres.map(c => `${c.date} (${torneoDelClubEnFecha(club.name, c.date)})`).join(', ')}`);
const esAperturaClausura = isApeturaClausuraLeague(club.league);
if (esAperturaClausura && cierres.length !== 2) {
  bug('coronacion', `liga de Apertura/Clausura con ${cierres.length} cierres, deberian ser 2`);
}
if (!esAperturaClausura && cierres.length !== 1) {
  bug('coronacion', `liga de temporada corrida con ${cierres.length} cierres, deberia ser 1`);
}

// ---------------------------------------------------------------- 3. la carrera paso a paso
console.log(`\n--- CARRERA ---`);
const leagueKey = leagueKeyFor(club);
const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
let season = getOrCreateSeasonForLeague(leagueClubs, undefined, 1);

let week = 1;
let edad = EDAD_INICIAL;
let anioAnterior = getSeasonYear(week);
const titulos = [];
const datedResults = [];
let pasosSinPartido = 0;
let partidosJugados = 0;
const MAX_PASOS = 4000;

let pasosTrasAgotarse = 0;
let partidosPorMotor = 0;
let calendarioAgotadoEn = null;

while (edad < EDAD_RETIRO && week < MAX_PASOS) {
  const paso = fixturesAtStep(club.name, week);
  if (!paso) {
    // Agotado el calendario real, App.tsx cae al motor: getUpcomingMatchForLeague le sigue
    // generando rival. Se replica acá para no reportar una carrera muerta que en el juego no lo es.
    if (calendarioAgotadoEn === null && partidosJugados > 0) calendarioAgotadoEn = week;
    // App.tsx llama a getOrCreateSeasonForLeague en CADA paso: es ahí donde la temporada agotada
    // rota al semestre siguiente. Sin esta llamada la temporada queda congelada y parece que el
    // motor no genera partidos.
    season = getOrCreateSeasonForLeague(leagueClubs, season, week);
    const up = getUpcomingMatchForLeague(season, leagueClubs, week, club.id);
    if (up) {
      partidosJugados++;
      partidosPorMotor++;
      season = resolvePlayerWeekForLeague(season, leagueClubs, week, club.id, true, 2, 1, undefined);
    } else {
      pasosSinPartido++;
      if (calendarioAgotadoEn !== null) pasosTrasAgotarse++;
    }
    const anioTrasMotor = getSeasonYear(week);
    if (anioTrasMotor !== anioAnterior) { edad++; anioAnterior = anioTrasMotor; }
    week++;
    continue;
  }

  const fx = pickPrimary(paso.fixtures);
  if (!fx) { bug('motor', `paso ${week}: hay fixtures pero pickPrimary devolvio null`); week++; continue; }

  // Resultado ficticio pero determinista: gana el club local por 2-1 la mitad de las veces.
  const gano = (week % 3) !== 0;
  const misGoles = gano ? 2 : 1;
  const golesRival = gano ? 1 : 1;
  partidosJugados++;

  datedResults.push({
    date: paso.date, competition: fx.competition.name,
    opponentName: fx.opponentName, myGoals: misGoles, rivalGoals: golesRival,
  });

  // Coronacion de copa, con el global de la llave (misma logica que App.tsx).
  if (fx.competition.kind !== 'league' && esUltimoPartidoDeLaCopa(club.name, fx.competition.id, paso.date)) {
    const idas = partidosDeLaMismaLlave(club.name, fx.competition.id, paso.date);
    const previos = datedResults.filter(r => r.competition === fx.competition.name && idas.includes(r.date));
    const gMio = misGoles + previos.reduce((n, r) => n + r.myGoals, 0);
    const gRival = golesRival + previos.reduce((n, r) => n + r.rivalGoals, 0);
    const ganaGlobal = gMio > gRival || (gMio === gRival && (misGoles > golesRival || previos.some(r => r.myGoals > r.rivalGoals)));
    if (ganaGlobal) {
      titulos.push({ competition: fx.competition.name, year: Number(paso.date.slice(0,4)), tipo: 'copa' });
    }
  }

  // Liga: se resuelve la fecha en el motor.
  if (fx.competition.kind === 'league') {
    const antes = season.table.reduce((n, t) => n + t.pj, 0);
    season = resolvePlayerWeekForLeague(season, leagueClubs, week, club.id, true, misGoles, golesRival, undefined);
    const despues = season.table.reduce((n, t) => n + t.pj, 0);
    // En playoffs la tabla regular NO suma: los cuadrangulares de Colombia y las llaves de
    // Argentina van por su propio bracket. Solo es bug si la FASE REGULAR deja de sumar.
    if (despues === antes && season.stage === 'regular') {
      bug('motor', `paso ${week} (${paso.date}): fecha de fase regular que no sumo ningun PJ a la tabla`);
    }

    if (esUltimaFechaDelTorneo(club.name, paso.date) && season.table.length) {
      const lider = sortTable([...season.table])[0];
      if (lider && (lider.clubId === club.id || lider.name === club.name)) {
        const t = torneoDelClubEnFecha(club.name, paso.date);
        titulos.push({ competition: 'Liga BetPlay Dimayor', year: Number(paso.date.slice(0,4)), torneo: t, tipo: 'liga' });
      }
    }
  }

  // Cierre de año: envejece y aplica ascensos/descensos.
  const anioAhora = getSeasonYear(week);
  if (anioAhora !== anioAnterior) {
    edad++;
    anioAnterior = anioAhora;
  }
  week++;
}

console.log(`  ${partidosJugados} partidos en ${week} pasos (${pasosSinPartido} pasos sin partido)`);
console.log(`  edad final: ${edad} | año de carrera: ${getSeasonYear(week)}`);

if (partidosJugados === 0) bug('motor', 'la carrera no jugo NINGUN partido');
if (calendarioAgotadoEn !== null) {
  console.log(`  calendario real agotado en el paso ${calendarioAgotadoEn}; despues el motor genero ${partidosPorMotor} partidos`);
  if (partidosPorMotor === 0) {
    bug('carrera-muerta',
      `al agotarse el calendario real (paso ${calendarioAgotadoEn}) el motor no genero ni un partido: `
      + `la carrera queda muerta con ${edad} años y nunca llega al retiro (${EDAD_RETIRO}).`);
  }
}
if (edad < EDAD_RETIRO && week >= MAX_PASOS) {
  bug('motor', `la carrera no llego al retiro: corto en el paso ${week} con ${edad} años`);
}
// El envejecimiento depende de que getSeasonYear avance, y eso depende de las SEMANAS, no de los
// partidos: si el jugador solo envejece 1 año en 4000 pasos, algo no cierra.
if (edad === EDAD_INICIAL + 1 && week > 1000) {
  bug('envejecimiento', `en ${week} pasos el jugador solo envejecio ${edad - EDAD_INICIAL} año`);
}

// ---------------------------------------------------------------- 4. vitrina
console.log(`\n--- VITRINA (${titulos.length} titulos ganados) ---`);
const perfil = {
  currentClubId: club.id,
  seasonHistory: [{ clubId: club.id, seasonNum: 1 }],
  leagueSeasons: {}, continentalCups: {}, uefaCups: {}, worldCups: {},
  cupTitles: titulos,
};
const trofeos = getPalmares(perfil, CLUBS_DATABASE, l => l, l => (l === 'Colombiana' ? 'colombia' : null));
for (const t of trofeos.slice(0, 12)) {
  console.log(`  [${t.tipo.padEnd(11)}] ${t.nombre.padEnd(24)} ${t.detalle}`);
}
if (trofeos.length > 12) console.log(`  ... y ${trofeos.length - 12} mas`);

const ids = trofeos.map(t => t.id);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) bug('vitrina', `trofeos duplicados: ${[...new Set(dup)].join(', ')}`);

// ---------------------------------------------------------------- 5. ascenso/descenso
console.log(`\n--- ASCENSO / DESCENSO ---`);
const reglas = reglasDeLiga(club.league);
if (reglas) {
  const d1 = leagueClubs.filter(c => (c.division === 2 ? 2 : 1) === 1);
  const d2 = CLUBS_DATABASE.filter(c => c.league === club.league && c.division === 2);
  const hist = [
    ...d1.map((c, i) => ({ clubId: c.id, league: club.league, year: 1, puntos: 70 - i * 2, partidos: 38, victorias: 22 - i, golesFavor: 55 - i, golesContra: 30 })),
    ...d2.map((c, i) => ({ clubId: c.id, league: club.league, year: 1, puntos: 68 - i * 2, partidos: 38, victorias: 21 - i, golesFavor: 53 - i, golesContra: 30 })),
  ];
  const tabla = tablaDeDescenso(hist, club.league, 1, id => CLUBS_DATABASE.find(c => c.id === id)?.name ?? '?')
    .filter(f => (CLUBS_DATABASE.find(c => c.id === f.clubId)?.division === 2 ? 2 : 1) === 1);
  const segunda = d2.map(c => ({ clubId: c.id, clubName: c.name }));
  const r = resolverMovimientos(club.league, tabla, segunda, (a, b) => b);
  console.log(`  bajan ${r.descienden.length}: ${r.descienden.map(x => x.clubName).join(', ')}`);
  console.log(`  suben ${r.ascienden.length}: ${r.ascienden.map(x => x.clubName).join(', ')}`);
  if (r.descienden.length < reglas.cuposDescenso) {
    bug('ascenso', `bajan ${r.descienden.length} pero el reglamento dice ${reglas.cuposDescenso}`);
  }
  if (!d2.length) bug('ascenso', `${club.league} tiene reglamento pero ningun club en division 2`);
} else {
  console.log(`  (${club.league} no tiene reglamento cargado)`);
}

// ---------------------------------------------------------------- reporte
console.log(`\n${'='.repeat(70)}`);
if (!bugs.length) {
  console.log('SIN BUGS DETECTADOS');
} else {
  console.log(`${bugs.length} PROBLEMAS:\n`);
  const porCat = {};
  for (const b of bugs) (porCat[b.categoria] ??= []).push(b.detalle);
  for (const [cat, lista] of Object.entries(porCat)) {
    console.log(`[${cat}] ${lista.length}`);
    for (const d of lista.slice(0, 10)) console.log(`   - ${d}`);
    if (lista.length > 10) console.log(`   ... y ${lista.length - 10} mas`);
  }
}
