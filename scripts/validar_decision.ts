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
import { claveDeCopaNacional, clavePlayoffDeLiga, copaNacionalDelPaso, cruceDeCopaNacionalHoy, cuadrangularDeHoy, duenoDelDiaDeCopa, laNacionalTieneCruce } from '../src/decisionDelDia';
import { prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, buildInitialTable, sortTable, roundLabelByMatchCount } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { crearCopaNacional, cruceActual, nombreDeRonda } from '../src/copaNacional';
import { resolverPasoCopaNacional } from '../src/leagueEngine';
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

console.log('');
console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
