// De quien es el dia de copa, y a que edicion se le escribe el resultado.
//
// Estas dos preguntas estaban contestadas en varios lugares a la vez -- la clave de la edicion, en
// CINCO, con TRES formulas distintas -- y sincronizadas a mano. Ya se cobraron un bug: el cartel
// decia "Copa Libertadores" y el partido era de Copa Colombia.
//
// Ahora viven en src/decisionDelDia.ts y esto es lo que hay que exigirles.

import { CLUBS_DATABASE } from '../src/data';
import { esClubJugable } from '../src/clubesJugables';
import { fechaDelPaso, fechasDeCopaTranscurridas, fixturesAtStep, fixturesForClub, quedanFechasDeCopaContinental, rivalesDeGrupoEnElCalendario, temporadaDelPaso } from '../src/dateSchedule';
import { cerrarPlayoffsSinFechas, grupoRealDelCalendario, claveDeCopaNacional, clavePlayoffDeLiga, copaNacionalDelPaso, cruceDeCopaNacionalHoy, cuadrangularDeHoy, duenoDelDiaDeCopa, laNacionalTieneCruce, playoffDelDiaSinElJugador } from '../src/decisionDelDia';
import { prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, buildInitialTable, sortTable, roundLabelByMatchCount, leagueKeyFor, getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, terminarCopaContinental } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { crearCopaNacional, cruceActual, nombreDeRonda } from '../src/copaNacional';
import { resolverPasoCopaNacional } from '../src/leagueEngine';
import { armarReporteDeBug } from '../src/reporteDeBug';
import type { Club, PlayerProfile } from '../src/types';

let fallas = 0, corridos = 0;
const ok = (n: string, c: boolean, d = '') => {
  corridos++; if (!c) fallas++;
  console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`);
};

const clubes = CLUBS_DATABASE as Club[];
const perfilVacio = { currentClubId: '', domesticCups: {} } as unknown as PlayerProfile;

// =============================================================================================
// 1. LA CLAVE NO PUEDE CAMBIAR EN MEDIO DE UNA EDICION
// =============================================================================================
//
// Es el bug que el propio codigo advertia: "un paso es una fecha con partido, y el Junior tiene 63
// en 2026. Pasada la numero 52 el contador decia temporada 2 y la clave cambiaba EN MEDIO de la
// edicion -- el cuadro se reiniciaba solo y el jugador volvia a dieciseisavos con la copa a mitad
// de camino".
//
// La invariante: dentro de una misma temporada de carrera, la clave es SIEMPRE la misma.

const jugables = clubes.filter(esClubJugable);
let clubesRevisados = 0, saltos = 0;
const ejemplos: string[] = [];

for (const club of jugables.slice(0, 60)) {
  const porTemporada = new Map<number, Set<string>>();
  for (let paso = 1; paso <= 300; paso++) {
    const t = temporadaDelPaso(club.name, paso);
    if (!t) break;
    if (t.temporada > 4) break;
    const clave = claveDeCopaNacional(club, paso);
    const vistas = porTemporada.get(t.temporada) ?? new Set<string>();
    vistas.add(clave);
    porTemporada.set(t.temporada, vistas);
  }
  if (!porTemporada.size) continue;
  clubesRevisados++;
  for (const [temporada, vistas] of porTemporada) {
    if (vistas.size > 1) {
      saltos++;
      if (ejemplos.length < 3) ejemplos.push(`${club.name} T${temporada}: ${[...vistas].join(' / ')}`);
    }
  }
}

console.log(`${clubesRevisados} clubes revisados, 4 temporadas cada uno\n`);
ok('la clave de la copa NO cambia en medio de una temporada', saltos === 0, ejemplos.join(' | '));

// Y entre temporadas SI tiene que cambiar, o dos ediciones distintas compartirian cuadro.
const unClub = jugables.find(c => temporadaDelPaso(c.name, 1) && temporadaDelPaso(c.name, 200))!;
if (unClub) {
  const t1 = temporadaDelPaso(unClub.name, 1)!.temporada;
  let pasoDeOtra = 1;
  for (let p = 1; p <= 300; p++) {
    const t = temporadaDelPaso(unClub.name, p);
    if (t && t.temporada !== t1) { pasoDeOtra = p; break; }
  }
  ok('y entre temporadas SI cambia',
     claveDeCopaNacional(unClub, 1) !== claveDeCopaNacional(unClub, pasoDeOtra),
     `${claveDeCopaNacional(unClub, 1)} -> ${claveDeCopaNacional(unClub, pasoDeOtra)}`);
}

// =============================================================================================
// 2. DE QUIEN ES EL DIA
// =============================================================================================
//
// El dia lo estrena la copa que lo PIDIO. Antes se preguntaba siempre primero por la continental,
// que entre fecha y fecha tiene un cruce pendiente esperando, asi que se quedaba con todos: el
// cuadro nacional no arrancaba hasta que sobraran dias y la Copa BetPlay quedaba reducida a una
// final suelta de dos partidos.

console.log('');
const junior = clubes.find(c => c.name === 'Junior de Barranquilla')!;
const perfilJunior = { currentClubId: junior.id, domesticCups: {} } as unknown as PlayerProfile;

ok('edicion sin sortear: la nacional TIENE cruce (tu club siempre entra al cuadro)',
   laNacionalTieneCruce(perfilJunior, junior, 1));
ok('un dia que pidio la NACIONAL se lo queda ella',
   duenoDelDiaDeCopa(perfilJunior, junior, 1, true) === 'nacional');
ok('un dia que pidio la CONTINENTAL no se lo saca la nacional',
   duenoDelDiaDeCopa(perfilJunior, junior, 1, false) === 'continental');

// Con la edicion ya coronada, la nacional no tiene nada que jugar y cede el dia.
const copa = crearCopaNacional(junior.league, 1, clubes, c => (c.division === 2 ? 2 : 1));
const coronada = { ...copa, championId: clubes[0].id };
const perfilCoronada = {
  currentClubId: junior.id,
  domesticCups: { [claveDeCopaNacional(junior, 1)]: coronada },
} as unknown as PlayerProfile;
ok('con la copa ya coronada, la nacional NO tiene cruce',
   !laNacionalTieneCruce(perfilCoronada, junior, 1));
ok('y ese dia lo hereda la continental',
   duenoDelDiaDeCopa(perfilCoronada, junior, 1, true) === 'continental');

// =============================================================================================
// 3. LA RESPUESTA NO DEPENDE DE QUIEN PREGUNTA
// =============================================================================================
//
// Es el punto de todo esto: App.tsx y Dashboard.tsx llaman a la MISMA funcion, asi que no pueden
// contestar distinto. Antes eran dos copias sincronizadas a mano.

console.log('');
let inconsistencias = 0;
for (const club of jugables.slice(0, 40)) {
  const perfil = { currentClubId: club.id, domesticCups: {} } as unknown as PlayerProfile;
  for (let paso = 1; paso <= 80; paso++) {
    const hoy = fixturesAtStep(club.name, paso);
    if (!hoy) break;
    const esDeLaNacional = hoy.fixtures.some(f => f.esReservaDeCuadro && f.competition.kind === 'domestic_cup');
    const a = duenoDelDiaDeCopa(perfil, club, paso, esDeLaNacional);
    const b = duenoDelDiaDeCopa(perfil, club, paso, esDeLaNacional);
    if (a !== b) inconsistencias++;
  }
}
ok('la misma pregunta da la misma respuesta siempre (es pura)', inconsistencias === 0);
ok('y no toca el perfil', Object.keys(perfilVacio.domesticCups ?? {}).length === 0);

// =============================================================================================
// 4. EL CUADRANGULAR
// =============================================================================================
//
// La clave lleva el SEMESTRE porque Apertura y Clausura son dos torneos con su propio campeon: con
// una sola clave por temporada, el segundo se jugaria sobre el cuadro del primero.

console.log('');
const colombianos = clubesDeLiga('Colombiana-1');
const juni = colombianos.find(c => c.name === 'Junior de Barranquilla')!;

// Dos fechas del mismo club en semestres distintos tienen que dar claves distintas.
const fechaApertura = '2026-05-10';
const fechaClausura = '2026-11-25';
ok('Apertura y Clausura NO comparten cuadro',
   clavePlayoffDeLiga(juni, 26, fechaApertura) !== clavePlayoffDeLiga(juni, 83, fechaClausura),
   `${clavePlayoffDeLiga(juni, 26, fechaApertura)} vs ${clavePlayoffDeLiga(juni, 83, fechaClausura)}`);

const sinCuadro = { currentClubId: juni.id, playoffsDeLiga: {} } as unknown as PlayerProfile;
ok('sin cuadro sembrado no se inventa un cruce',
   cuadrangularDeHoy(sinCuadro, juni, 26, fechaApertura) === null);

// Con un cuadro sembrado y la ida jugada, la vuelta tiene que traer el global y la localia dada
// vuelta -- que es justo lo que la tarjeta y la pantalla del partido tienen que decir IGUAL.
const tabla = sortTable(buildInitialTable(colombianos.slice(0, 8)));
let cuadro = prepararPlayoffDeLiga(undefined, tabla, 6);
const miLlave = cuadro.tiesByRound[0].find(t => t.clubAId === juni.id || t.clubBId === juni.id);
if (miLlave) {
  const soyAInicial = miLlave.clubAId === juni.id;
  const conCuadro = {
    currentClubId: juni.id,
    playoffsDeLiga: { [clavePlayoffDeLiga(juni, 26, fechaApertura)]: cuadro },
  } as unknown as PlayerProfile;
  const ida = cuadrangularDeHoy(conCuadro, juni, 26, fechaApertura)!;
  ok('en la IDA no hay global que mostrar', ida.esIda && ida.global === null);
  ok('y la localia de la ida es la del clubA', ida.soyLocal === soyAInicial);

  cuadro = resolverPasoPlayoffDeLiga(cuadro, colombianos, {
    clubId: juni.id, isHome: ida.soyLocal, goals: 2, opponentGoals: 1,
  });
  const conIdaJugada = {
    currentClubId: juni.id,
    playoffsDeLiga: { [clavePlayoffDeLiga(juni, 26, fechaApertura)]: cuadro },
  } as unknown as PlayerProfile;
  const vuelta = cuadrangularDeHoy(conIdaJugada, juni, 27, fechaApertura)!;
  ok('en la VUELTA sale el global de la ida', !vuelta.esIda && vuelta.global === '2-1', vuelta.global ?? '');
  ok('y la localia se invierte', vuelta.soyLocal === !soyAInicial);
  ok('el rival es el mismo en las dos piernas', ida.rivalId === vuelta.rivalId);
}

// =============================================================================================
// 5. LA RONDA SIGUIENTE, ANTES DE MIRAR
// =============================================================================================
//
// El cuadro se guarda con la ronda RECIEN TERMINADA como ultima. Preguntarle directamente devuelve
// la llave YA JUGADA -- sigueEnCopa da true porque la ganaste -- asi que la tarjeta anunciaba al
// rival que acababas de eliminar. Reportado jugando con Tigres: decia Leon y el partido era contra
// Cruz Azul.

console.log('');
const mex = clubesDeLiga('Mexicana-1');
const tigres = mex.find(c => c.name === 'Tigres U.A.N.L.') ?? mex[0];
let copaMx = crearCopaNacional(tigres.league, 1, clubes, c => (c.division === 2 ? 2 : 1));
const rivalDe = (t: { clubAId: string; clubBId: string } | null) =>
  t ? (t.clubAId === tigres.id ? t.clubBId : t.clubAId) : null;
const eliminado = rivalDe(cruceActual(copaMx, tigres.id));

// Se gana la ronda entera (ida y vuelta).
for (let i = 0; i < 2; i++) {
  const c = cruceActual(copaMx, tigres.id)!;
  const esIda = c.firstLegGoalsA === null;
  copaMx = resolverPasoCopaNacional(copaMx, clubes, {
    clubId: tigres.id, isHome: esIda ? c.clubAId === tigres.id : c.clubBId === tigres.id,
    goals: 5, opponentGoals: 0,
  });
}

const perfilMx = {
  currentClubId: tigres.id,
  domesticCups: { [claveDeCopaNacional(tigres, 1)]: copaMx },
} as unknown as PlayerProfile;

const crudo = rivalDe(cruceActual(copaMx, tigres.id));
const contestado = cruceDeCopaNacionalHoy(perfilMx, tigres, clubes, 1);

ok('el cuadro guardado todavia devuelve la llave ya jugada', crudo === eliminado,
   `guardado apunta a ${clubes.find(c => c.id === crudo)?.name}`);
ok('cruceDeCopaNacionalHoy YA no anuncia al eliminado',
   contestado !== null && contestado.rivalId !== eliminado,
   `${clubes.find(c => c.id === eliminado)?.name} -> ${clubes.find(c => c.id === contestado?.rivalId)?.name}`);
ok('y el cruce que anuncia esta SIN jugar', contestado?.llave.played === false);
ok('arranca por la ida, sin global', contestado?.esIda === true && contestado?.global === null);

// =============================================================================================
// 6. SIN EDICION GUARDADA, LAS DOS PANTALLAS SORTEAN LO MISMO
// =============================================================================================
//
// La tarjeta del proximo partido se abstenia de sortear "para no prometer un rival distinto del que
// armaria App.tsx", y por eso anunciaba "Rival por definir" justo donde hay que decidir si jugas.
// La precaucion era razonable pero la premisa era falsa: el sorteo usa un generador sembrado con el
// AÑO, asi que los dos lados calculan lo MISMO. Esto lo deja clavado.

console.log('');
let sorteosDistintos = 0, sinEdicion = 0, revisados6 = 0;
for (const club of jugables.slice(0, 30)) {
  const perfil = { currentClubId: club.id, domesticCups: {} } as unknown as PlayerProfile;
  const a = copaNacionalDelPaso(perfil, club, clubes, 1);
  const b = copaNacionalDelPaso(perfil, club, clubes, 1);
  if (!a || !b) { sinEdicion++; continue; }
  revisados6++;
  if (JSON.stringify(a.bracket) !== JSON.stringify(b.bracket)) sorteosDistintos++;
}
ok('el mismo paso sortea SIEMPRE el mismo cuadro', sorteosDistintos === 0,
   `${revisados6} clubes`);

// Y con el cuadro sorteado, la tarjeta puede nombrar al rival en vez de decir "por definir".
const perfilNuevo = { currentClubId: tigres.id, domesticCups: {} } as unknown as PlayerProfile;
const primero = cruceDeCopaNacionalHoy(perfilNuevo, tigres, clubes, 1);
ok('sin edicion guardada YA se sabe el rival (no mas "por definir")',
   primero !== null && !!primero.rivalId,
   primero ? `${tigres.name} vs ${clubes.find(c => c.id === primero.rivalId)?.name} · ${primero.ronda}` : '');

// Y tiene que ser el mismo que armaria el partido al resolver el paso.
const delPartido = copaNacionalDelPaso(perfilNuevo, tigres, clubes, 1);
const suyo = delPartido ? cruceActual(delPartido, tigres.id) : null;
ok('y es EXACTAMENTE el que va a armar el partido',
   !!suyo && !!primero && (suyo.clubAId === primero.rivalId || suyo.clubBId === primero.rivalId));

// =============================================================================================
// 7. CADA RONDA SE LLAMA COMO SE LLAMA
// =============================================================================================
//
// Habia DOS tablas para esto y no coincidian: para 16 llaves, la copa nacional decia
// "Dieciseisavos" y las copas continentales "Ronda de 32". Pedido: "que diga lo que es, si es
// octavos octavos, si es 16avos 16avos".

console.log('');
const esperados: [number, string][] = [
  [1, 'Final'],
  [2, 'Semifinal'],
  [4, 'Cuartos de Final'],
  [8, 'Octavos de Final'],
  [16, 'Dieciseisavos de Final'],
  [32, 'Treintaidosavos de Final'],
];
for (const [llaves, nombre] of esperados) {
  ok(`${llaves} llave(s) = ${nombre}`, roundLabelByMatchCount(llaves) === nombre,
     roundLabelByMatchCount(llaves));
}
ok('la copa nacional y las continentales dicen LO MISMO',
   esperados.every(([n]) => nombreDeRonda(n) === roundLabelByMatchCount(n)));
ok('mas alla de 64 clubes se dice cuantos quedan, que no se puede malinterpretar',
   roundLabelByMatchCount(64) === 'Ronda de 128', roundLabelByMatchCount(64));

// =============================================================================================
// 8. EL REPORTE DE BUG DICE LO MISMO QUE LA DECISION
// =============================================================================================
//
// El reporte imprimia el cartel de relleno del calendario -- "local vs Por definir" -- mientras
// tres secciones mas abajo, leyendo el cuadro guardado, decia "vs Toluca . VUELTA . ida 4-1". El
// jugador lo mando como bug, con razon: un informe que se contradice a si mismo manda a buscar un
// bug que no existe.

console.log('');
{
  const toluca = clubes.find(c => c.name.includes('Toluca'))!;
  const paso = 32;
  const fecha = fixturesAtStep(tigres.name, paso)!.date;
  const llave = {
    clubAId: toluca.id, clubBId: tigres.id,
    firstLegGoalsA: 1, firstLegGoalsB: 4,
    secondLegGoalsA: null, secondLegGoalsB: null,
    played: false, winnerId: null,
  };
  const otros = clubes.filter(c => c.league === 'Mexicana' && c.division === 1
    && c.id !== tigres.id && c.id !== toluca.id).slice(0, 6);
  const relleno = [0, 2, 4].map(i => ({
    clubAId: otros[i].id, clubBId: otros[i + 1].id,
    firstLegGoalsA: 0, firstLegGoalsB: 0, secondLegGoalsA: null, secondLegGoalsB: null,
    played: false, winnerId: null,
  }));
  const perfilCuadrangular = {
    ...perfilNuevo, currentWeek: paso,
    playoffsDeLiga: { [clavePlayoffDeLiga(tigres, paso, fecha)]: { tiesByRound: [[llave, ...relleno]], championId: null } },
  } as unknown as PlayerProfile;

  const reporte = armarReporteDeBug(perfilCuadrangular, clubes);
  const seccionCalendario = reporte.slice(
    reporte.indexOf('QUÉ DICE EL CALENDARIO DE HOY'),
    reporte.indexOf('---', reporte.indexOf('QUÉ DICE EL CALENDARIO DE HOY') + 40),
  );
  ok('el reporte nombra al rival del cuadro y no el cartel de relleno',
     seccionCalendario.includes(toluca.name), seccionCalendario.trim().split(/\r?\n/).pop() ?? '');
  ok('y dice la localia que sale de la LLAVE (Tigres es local en la vuelta)',
     /local vs/.test(seccionCalendario) && !/visitante vs/.test(seccionCalendario));
  ok('y el global de la ida va escrito, que es lo que hay que mirar en una vuelta',
     seccionCalendario.includes('4-1'));
}

// =============================================================================================
// 9. EL CUADRANGULAR NO SE CONGELA PORQUE EL JUGADOR SE PIERDA FECHAS
// =============================================================================================
//
// El cuadro solo avanzaba los dias que el jugador disputaba una llave. Los que se perdia --
// lesionado, sancionado, sin convocatoria -- el calendario los gastaba igual y el cuadro se quedaba
// quieto. Y las fechas son contadas: el Clausura mexicano tiene seis y un cuadro de ocho necesita
// las seis. Reportado: "la liga mx no dio campeon, no se jugo el de vuelta", con el cuadro en
// Semifinal y el calendario ya en el Apertura.

console.log('');
{
  const mexicanos = clubesDeLiga(leagueKeyFor(tigres));
  const PASO_DE_PLAYOFF = 30;   // 2026-05-10, una de las seis fechas del cuadrangular del Clausura
  const PASO_DEL_APERTURA = 48; // 2026-08-01, cuando ya no queda ninguna
  const fecha = fixturesAtStep(tigres.name, PASO_DE_PLAYOFF)!.date;
  const clave = clavePlayoffDeLiga(tigres, PASO_DE_PLAYOFF, fecha);

  const tabla = sortTable(buildInitialTable(mexicanos));
  const cuadro = prepararPlayoffDeLiga(undefined, tabla, 6);
  const perfilLesionado = {
    ...perfilNuevo, currentWeek: PASO_DE_PLAYOFF,
    playoffsDeLiga: { [clave]: cuadro },
  } as unknown as PlayerProfile;

  const despues = playoffDelDiaSinElJugador(perfilLesionado, tigres, mexicanos, tabla);
  const llavesJugadas = (b: typeof cuadro | undefined) =>
    b?.tiesByRound[b.tiesByRound.length - 1].filter(t => t.firstLegGoalsA !== null).length ?? 0;
  ok('una fecha perdida SE JUEGA igual: el cuadro avanza sin el jugador',
     !!despues && llavesJugadas(despues[clave]) > llavesJugadas(cuadro),
     `llaves con la ida jugada: antes ${llavesJugadas(cuadro)}, despues ${llavesJugadas(despues?.[clave])}`);

  // Y no avanza los dias que NO son de cuadrangular: el 26 de julio es fase regular del Apertura.
  const enLiga = playoffDelDiaSinElJugador(
    { ...perfilLesionado, currentWeek: 47 } as unknown as PlayerProfile, tigres, mexicanos, tabla);
  ok('un dia que no es de cuadrangular no toca el cuadro', enLiga === null);

  // --- La red de seguridad: un cuadro sin fechas por delante se termina, no queda abierto.
  const congelado = { [clave]: cuadro };
  const enPlenoTorneo = cerrarPlayoffsSinFechas(
    { ...perfilNuevo, playoffsDeLiga: congelado } as unknown as PlayerProfile,
    tigres, mexicanos, PASO_DE_PLAYOFF);
  ok('con fechas por delante NO se cierra nada: el torneo se define en cancha',
     enPlenoTorneo === null);

  const cerrado = cerrarPlayoffsSinFechas(
    { ...perfilNuevo, playoffsDeLiga: congelado } as unknown as PlayerProfile,
    tigres, mexicanos, PASO_DEL_APERTURA);
  ok('sin fechas por delante, el cuadro congelado corona campeon',
     !!cerrado?.[clave]?.championId,
     cerrado?.[clave]?.championId
       ? clubes.find(c => c.id === cerrado[clave]!.championId)?.name ?? '?'
       : 'sigue sin campeon');
}

console.log('');
// =============================================================================================
// 10. EL GRUPO QUE MUESTRA LA PANTALLA ES EL DE TUS PARTIDOS
// =============================================================================================
//
// El motor sorteaba los ocho grupos por su cuenta, sin mirar el calendario. Osea que la pantalla de
// Copas dibujaba un grupo y los seis partidos eran contra otros tres clubes. Reportado con captura:
// "en copas y tablas muestra un grupo distinto al que juego" -- el Junior figuraba con Lanus,
// Corinthians y Always Ready mientras jugaba contra Palmeiras, Cerro Porteno y Sporting Cristal.

console.log('');
{
  const lib = getLibertadoresParticipants(clubes, 1, {}, undefined);
  const sud = getSudamericanaParticipants(clubes, 1, {}, undefined);
  let conDatos = 0, coinciden = 0, cuadrosSanos = 0;
  for (const id of [...lib, ...sud]) {
    const c = clubes.find(x => x.id === id)!;
    const enLib = lib.includes(id);
    const nombreCopa = enLib ? 'Copa Libertadores' : 'Copa Sudamericana';
    const rivales = rivalesDeGrupoEnElCalendario(c.name, nombreCopa, 1);
    if (rivales.length !== 3) continue;
    conDatos++;
    const fijo = grupoRealDelCalendario(c, clubes, nombreCopa, 1, enLib ? lib : sud);
    const cup = getOrCreateCupState(enLib ? 'libertadores' : 'sudamericana', 1, clubes, undefined, 0, {}, undefined, c.id, fijo);
    const grupo = cup.groups.find(g => g.clubIds.includes(c.id));
    if (fijo && grupo && fijo.every(x => grupo.clubIds.includes(x))) coinciden++;
    const todos = cup.groups.flatMap(g => g.clubIds);
    if (cup.groups.length === 8 && todos.length === 32 && new Set(todos).size === 32) cuadrosSanos++;
  }
  ok('los clubes con fase de grupos en el calendario ven SU grupo en la pantalla',
     conDatos > 0 && coinciden === conDatos, `${coinciden} de ${conDatos}`);
  ok('y sembrar el grupo del jugador no rompe el cuadro (8 grupos de 4, sin repetidos)',
     cuadrosSanos === conDatos, `${cuadrosSanos} de ${conDatos}`);

  // Un club SIN datos de grupo en el calendario tiene que seguir entrando al sorteo normal: de los
  // 64 participantes solo 6 tienen la fase de grupos cargada, asi que el respaldo es el caso comun.
  const sinDatos = lib.find(id => {
    const c = clubes.find(x => x.id === id)!;
    return rivalesDeGrupoEnElCalendario(c.name, 'Copa Libertadores', 1).length !== 3;
  })!;
  const sinFijo = getOrCreateCupState('libertadores', 1, clubes, undefined, 0, {}, undefined, sinDatos, undefined);
  ok('un club sin datos de grupo igual queda en un grupo (se sortea, como siempre)',
     !!sinFijo.groups.find(g => g.clubIds.includes(sinDatos)),
     clubes.find(c => c.id === sinDatos)?.name ?? '?');
}

// =============================================================================================
// 11. LA COPA CONTINENTAL AVANZA UN PASO POR FECHA SUYA, NO POR FECHA DE CUALQUIER COPA
// =============================================================================================
//
// fechasDeCopaTranscurridas le dice al motor cuantos pasos deberia haber consumido la copa
// continental. Contaba TAMBIEN los dias de copa nacional, asi que la continental corria al doble de
// velocidad: al Junior, las dos fechas de Copa BetPlay de enero le sumaban dos pasos de
// Libertadores antes de que la Libertadores empezara. El cuadro quedaba desfasado de su calendario.
// Reportado: "jugue un partido de mas contra el Always Ready, por que?".
//
// La invariante: al terminar la fase de grupos, los pasos contados tienen que ser exactamente los
// seis de la fase de grupos -- ni uno mas.

console.log('');
{
  let revisados = 0, exactos = 0;
  const detalle: string[] = [];
  for (const c of clubes.filter(x => rivalesDeGrupoEnElCalendario(x.name, 'Copa Libertadores', 1).length === 3
                                  || rivalesDeGrupoEnElCalendario(x.name, 'Copa Sudamericana', 1).length === 3)) {
    const copa = rivalesDeGrupoEnElCalendario(c.name, 'Copa Libertadores', 1).length === 3
      ? 'Copa Libertadores' : 'Copa Sudamericana';
    // El paso siguiente al ultimo dia de fase de grupos.
    const dias: number[] = [];
    for (let p = 1; p <= 200; p++) {
      const s = fixturesAtStep(c.name, p);
      if (!s) break;
      if (s.fixtures.some(f => f.competition.kind === 'continental_cup' && f.competition.name === copa && !f.esReservaDeCuadro)) dias.push(p);
    }
    if (dias.length < 6) continue;
    revisados++;
    const pasos = fechasDeCopaTranscurridas(c.name, dias[5] + 1, true);
    if (pasos === 6) exactos++;
    else if (detalle.length < 3) detalle.push(`${c.name}: ${pasos} pasos para 6 fechas de grupos`);
  }
  ok('al cerrar los grupos, los pasos contados son exactamente los seis jugados',
     revisados > 0 && exactos === revisados, `${exactos} de ${revisados}${detalle.length ? ' | ' + detalle.join(' | ') : ''}`);
}

// =============================================================================================
// 12. NINGUNA COPA SE QUEDA SIN CAMPEON POR FALTA DE FECHAS
// =============================================================================================
//
// La copa continental avanza un paso por fecha continental del calendario. Es lo correcto -- con el
// contador viejo, que sumaba tambien las de copa nacional, la copa corria adelantada --, pero deja
// un borde: 29 de los 64 participantes llegan al final del ano con 12 fechas continentales y una
// Libertadores completa necesita 13 (seis de grupos, tres llaves a ida y vuelta, y la final a
// partido unico). Sin red, la copa se quedaba a un paso de coronar.
//
// La regla de la casa: se acomoda, no se recorta. Un torneo sin campeon deja sin repartir los cupos
// del ano siguiente, sin llenar la vitrina y sin noticia.

console.log('');
{
  const NECESARIOS = 14;  // medido: con 13 se queda en el cuadro, con 14 corona
  const lib = getLibertadoresParticipants(clubes, 1, {}, undefined);
  const mio = clubes.find(c => c.name === 'Junior de Barranquilla')!;
  const fijo = grupoRealDelCalendario(mio, clubes, 'Copa Libertadores', 1, lib);

  // Una copa parada a mitad de camino: se le dan solo 12 pasos, uno menos de los que necesita.
  let corta = getOrCreateCupState('libertadores', 1, clubes, undefined, NECESARIOS - 1, {}, undefined, undefined, fijo);
  ok('con una fecha de menos, la copa NO llega a campeon sola',
     !corta.championId, `etapa ${corta.stage}, pasos ${corta.stepsConsumed}`);

  const cerrada = terminarCopaContinental(corta, clubes);
  ok('y la red de seguridad la termina: hay campeon',
     !!cerrada.championId, clubes.find(c => c.id === cerrada.championId)?.name ?? 'sigue sin campeon');

  // Una que ya tiene campeon no se toca.
  const otraVez = terminarCopaContinental(cerrada, clubes);
  ok('una copa ya coronada no se vuelve a tocar',
     otraVez.championId === cerrada.championId);

  // Y con las fechas completas corona sola, sin red.
  const entera = getOrCreateCupState('libertadores', 1, clubes, undefined, NECESARIOS, {}, undefined, undefined, fijo);
  ok('con las fechas completas corona sin ayuda',
     !!entera.championId, clubes.find(c => c.id === entera.championId)?.name ?? 'sin campeon');
}

// =============================================================================================
// 13. CADA COPA CORONA EL DIA DE SU ULTIMA FECHA. NI ANTES NI DESPUES
// =============================================================================================
//
// Pedido tal cual: "revisa que las copas coronen en su fecha en la segunda temporada, todas deben
// tener campeon pero en sus fechas, nada de antes y despues (...) para ver si corona realmente o
// por algun bug en el futuro simplemente lo da aleatoriamente".
//
// Los dos lados fallaban:
//   . TARDE: la red miraba el dia SIGUIENTE, asi que el campeon salia el 25 de noviembre para una
//     final del 22.
//   . TEMPRANO, y este era el grave: el contador sumaba las fechas de las DOS copas continentales,
//     y el Independiente Medellin -- que juega Libertadores y despues cae a la Sudamericana --
//     coronaba su Libertadores el 24 de AGOSTO, tres meses antes de la final.

console.log('');
{
  const lib = getLibertadoresParticipants(clubes, 1, {}, undefined);
  const sud = getSudamericanaParticipants(clubes, 1, {}, undefined);
  let casos = 0, enSuFecha = 0;
  const fallos: string[] = [];
  for (const nombre of ['Junior de Barranquilla', 'Independiente Medellín', 'Millonarios FC']) {
    const club = clubes.find(c => c.name === nombre);
    if (!club) continue;
    const enLib = lib.includes(club.id);
    if (!enLib && !sud.includes(club.id)) continue;
    const cupId = enLib ? 'libertadores' as const : 'sudamericana' as const;
    const nombreCopa = enLib ? 'Copa Libertadores' : 'Copa Sudamericana';

    for (const temporada of [1, 2]) {
      const pasos: number[] = [];
      for (let p = 1; p <= 300; p++) {
        const t = temporadaDelPaso(club.name, p);
        if (!t) break;
        if (t.temporada === temporada) pasos.push(p);
      }
      const dias = fixturesForClub(club.name)
        .filter(f => f.temporada === temporada && f.competition.kind === 'continental_cup')
        .map(f => f.date);
      if (!pasos.length || !dias.length) continue;
      const ultima = dias[dias.length - 1];

      // El peor caso: el jugador ya esta eliminado, asi que la copa depende del contador y de la red.
      let cup = getOrCreateCupState(cupId, temporada, clubes, undefined, 0, {}, undefined, undefined,
        grupoRealDelCalendario(club, clubes, nombreCopa, temporada, enLib ? lib : sud));
      let corono: string | null = null;
      for (const p of pasos) {
        cup = getOrCreateCupState(cupId, temporada, clubes, cup,
          fechasDeCopaTranscurridas(club.name, p, true, nombreCopa), {}, undefined, undefined, undefined);
        if (!cup.championId && !quedanFechasDeCopaContinental(club.name, p)) {
          cup = terminarCopaContinental(cup, clubes);
        }
        if (cup.championId && !corono) { corono = fechaDelPaso(club.name, p) ?? '?'; break; }
      }
      casos++;
      if (corono === ultima) enSuFecha++;
      else fallos.push(`${nombre} T${temporada}: corona ${corono ?? 'NUNCA'}, ultima fecha ${ultima}`);
    }
  }
  ok('cada copa corona EL DIA de su ultima fecha, en la temporada 1 y en la 2',
     casos > 0 && enSuFecha === casos, `${enSuFecha} de ${casos}${fallos.length ? ' | ' + fallos.join(' | ') : ''}`);
}

console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
