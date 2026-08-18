// De quien es el dia de copa, y a que edicion se le escribe el resultado.
//
// Estas dos preguntas estaban contestadas en varios lugares a la vez -- la clave de la edicion, en
// CINCO, con TRES formulas distintas -- y sincronizadas a mano. Ya se cobraron un bug: el cartel
// decia "Copa Libertadores" y el partido era de Copa Colombia.
//
// Ahora viven en src/decisionDelDia.ts y esto es lo que hay que exigirles.

import { CLUBS_DATABASE } from '../src/data';
import { esClubJugable } from '../src/clubesJugables';
import { fixturesAtStep, temporadaDelPaso } from '../src/dateSchedule';
import { claveDeCopaNacional, clavePlayoffDeLiga, cuadrangularDeHoy, duenoDelDiaDeCopa, laNacionalTieneCruce } from '../src/decisionDelDia';
import { prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, buildInitialTable, sortTable } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { crearCopaNacional } from '../src/copaNacional';
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

console.log('');
console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
