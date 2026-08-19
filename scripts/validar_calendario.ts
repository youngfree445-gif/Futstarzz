// Validador del calendario. Se corre con `npm run validar:calendario`.
//
// Contesta dos preguntas que no se pueden mirar a ojo, y que conviene re-chequear después de
// cualquier cambio en dateSchedule.ts o seasonCalendar.ts.
//
//   A) ¿El calendario respeta el descanso? Dos partidos con menos de dos días entre medio, o más de
//      tres en siete días, son señal de que la generación se desordenó.
//
//   C) ¿Cuánto cuesta armarlo? Es la primera pantalla del juego, así que un salto acá se siente
//      como un congelamiento al abrir.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { fixturesForClub } from '../src/dateSchedule';
import { clubesDeLiga, esClubJugable } from '../src/clubesJugables';
import { leagueKeyFor } from '../src/leagueEngine';
import { resolverClubDeCalendario } from '../src/clubAliases';

const MIN_DESCANSO_DIAS = 2;
const MAX_PARTIDOS_EN_7_DIAS = 3;
const TEMPORADAS_A_REVISAR = [1, 2, 3];
const CLUBES_A_REVISAR = 250;

const dias = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

interface Hallazgo { club: string; temporada: number; detalle: string; }

/** Días DISTINTOS con partido. Dos competiciones el mismo día son una fecha con dos opciones
 *  (el motor elige una con pickPrimary), no una falta de descanso. */
function fechasConPartido(club: string, temporada: number): string[] {
  const fx = fixturesForClub(club).filter(f => f.temporada === temporada);
  return [...new Set(fx.map(f => f.date))].sort();
}

function validarDescanso(club: string, temporada: number): Hallazgo[] {
  const out: Hallazgo[] = [];
  const fechas = fechasConPartido(club, temporada);

  for (let i = 1; i < fechas.length; i++) {
    const d = dias(fechas[i - 1], fechas[i]);
    if (d < MIN_DESCANSO_DIAS) {
      out.push({ club, temporada, detalle: `${d} día(s) entre ${fechas[i - 1]} y ${fechas[i]}` });
    }
  }
  for (let i = 0; i < fechas.length; i++) {
    const ventana = fechas.filter(f => { const d = dias(fechas[i], f); return d >= 0 && d <= 7; });
    if (ventana.length > MAX_PARTIDOS_EN_7_DIAS) {
      out.push({ club, temporada, detalle: `${ventana.length} partidos en 7 días desde ${fechas[i]}` });
    }
  }
  return out;
}

// --- C) Costo de armar el calendario ---
//
// Va PRIMERO porque mide la llamada en frío: cualquier cosa que se haya llamado antes ya dejó el
// índice cacheado y el número saldría en cero.
//
// Se mide porque es la primera pantalla del juego. El reparto de fechas de copa recorre ventanas de
// meses día por día, y hacerlo con aritmética de Date en vez de números enteros lo llevó una vez de
// 253 ms a 2124 ms -- un congelamiento visible al abrir, y mucho peor en un teléfono.
const arranque = Date.now();
fixturesForClub('FC Barcelona');
const msDeArmado = Date.now() - arranque;

// --- A) Descanso ---
const muestra = CLUBS.filter(c => c.starPlayers?.length).slice(0, CLUBES_A_REVISAR);
const hallazgos: Hallazgo[] = [];
let revisados = 0;
for (const c of muestra) {
  if (!fixturesForClub(c.name).length) continue;
  revisados++;
  for (const t of TEMPORADAS_A_REVISAR) hallazgos.push(...validarDescanso(c.name, t));
}

const pocoDescanso = hallazgos.filter(h => h.detalle.includes('entre'));
const saturadas = hallazgos.filter(h => h.detalle.includes('en 7 días'));

console.log('=== A) Descanso en el calendario con fechas ===');
console.log(`${revisados} clubes, temporadas ${TEMPORADAS_A_REVISAR.join(', ')}\n`);
console.log(`Menos de ${MIN_DESCANSO_DIAS} días de descanso: ${pocoDescanso.length}`);
for (const h of pocoDescanso.slice(0, 8)) console.log(`   ${h.club} (T${h.temporada}): ${h.detalle}`);
console.log(`Más de ${MAX_PARTIDOS_EN_7_DIAS} partidos en 7 días: ${saturadas.length}`);
for (const h of saturadas.slice(0, 8)) console.log(`   ${h.club} (T${h.temporada}): ${h.detalle}`);

// La sección B de este validador medía "cuántas semanas de copa le quedan libres a un club", con
// isCupWeek y getRealDate. Se borró el 12 de agosto de 2026 junto con esas funciones: las copas ya
// no corren por semanas sino por las fechas de copa del calendario (ver fechasDeCopaTranscurridas),
// así que ese presupuesto no existe. Lo que hay que vigilar ahora -- que la copa se pueda jugar y
// llegue a coronar campeón -- lo mide `npm run validar:copas`.

// BAJADO a 300, por debajo del 600 original, porque se arregló la causa y no el síntoma.
//
// Este tope llegó a subirse a 750 cuando el juego pasó de 34 a 49 competiciones y el armado se fue
// a 764 ms. Subir la vara para pasar era lo cómodo; lo correcto era que fixturesForClub dejara de
// construir las 32 temporadas de una sola vez -- 650.000 objetos de fixture -- cuando ninguna
// carrera necesita la 32 el día que arranca. Con el horizonte perezoso (ver asegurarHorizonte en
// dateSchedule.ts) bajó a 121 ms, y deja de crecer con cada competición que se agregue.
const TOPE_DE_ARMADO_MS = 300;
console.log(`\n=== C) Armar el calendario (32 temporadas, en frío) ===`);
console.log(`  ${msDeArmado} ms   ${msDeArmado > TOPE_DE_ARMADO_MS ? `<-- PASADO EL TOPE de ${TOPE_DE_ARMADO_MS} ms: esto se congela al abrir` : `(tope ${TOPE_DE_ARMADO_MS} ms)`}`);

// =============================================================================================
// D) CADA RIVAL DEL CALENDARIO TIENE QUE EXISTIR EN SU LIGA
// =============================================================================================
//
// Si el calendario nombra a un rival que no esta en la liga del club, App.tsx no lo encuentra --
// ni por el calendario ni por el motor -- y cae al respaldo de emergencia: rival AL AZAR, sin
// opClubId y sin rotulo de torneo. Con opClubId nulo, handleFinishMatch se saltea el bloque de
// liga entero, asi que el partido se juega y el resultado NO SE REGISTRA en ningun lado.
//
// Reportado jugando con Tigres: la tarjeta anunciaba Mazatlan, el partido era contra Atletico de
// San Luis y el encabezado no decia si era Apertura o Clausura. Los tres sintomas eran el mismo
// respaldo. La causa: Mazatlan FC figuraba con `division: 2` en data.ts jugando la Liga MX, asi
// que clubesDeLiga('Mexicana-1') no lo incluia.
//
// Es la misma trampa que ya tiene su propia nota en el repo: una division mal puesta no se ve como
// un error de datos, se ve como otra cosa (ahi, "le falta el escudo"). Por eso va como candado.

let sinResolver = 0, fechasMiradas = 0;
const culpables = new Map<string, number>();

for (const club of CLUBS.filter(esClubJugable)) {
  const liga = clubesDeLiga(leagueKeyFor(club));
  for (const f of fixturesForClub(club.name)) {
    if (f.temporada !== 1 || f.competition.kind !== 'league' || f.esPlayoff) continue;
    fechasMiradas++;
    if (resolverClubDeCalendario(liga, f.opponentName, club.league, 'league', f.competition.name)) continue;
    sinResolver++;
    const clave = `${leagueKeyFor(club)} -> "${f.opponentName}"`;
    culpables.set(clave, (culpables.get(clave) ?? 0) + 1);
  }
}

console.log(`
=== D) Rivales del calendario que existen en su liga ===`);
console.log(`  ${fechasMiradas} fechas de liga revisadas · ${sinResolver} con rival sin resolver`);
if (sinResolver) {
  console.log(`  Cada una cae al respaldo de emergencia: rival al azar y resultado sin registrar.`);
  for (const [c, n] of [...culpables].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`     ${n.toString().padStart(3)} x  ${c}`);
  }
  console.log(`  Revisar la \`division\` de esos clubes en data.ts contra el calendario de su liga.`);
}

// === E) NINGUNA RESERVA DE COPA PUEDE TAPAR UN PARTIDO DE LIGA ================================
//
// Las fechas reales del knockout continental entran en el calendario tenga el club partido ese dia
// o no: la Conmebol fija su fecha y el torneo domestico se acomoda. Pero acomodarse quiere decir
// CORRERSE, no desaparecer, y durante mucho tiempo el partido de liga se quedaba abajo del dia de
// copa. Como pickPrimary le da prioridad a la copa, ese partido no se jugaba nunca: el calendario
// te prometia Colo-Colo-La Serena el 29 de noviembre y el dia llegaba con una fecha de Libertadores
// que tu club ni siquiera juega.
//
// Eran 58 partidos en la temporada 1 y 232 en las primeras cuatro. Los arregla
// desenterrarPartidosDeLiga en dateSchedule.ts.
//
// Las fechas FIFA quedan afuera A PROPOSITO y no son un olvido: ese dia te vas con tu seleccion y
// el club juega igual, sin vos. El partido de liga se juega, asi que no hay nada que correr. Eran
// 1.958 de los 2.190 choques y meterlos aca convertia un arreglo en una mudanza masiva.
console.log(`
=== E) Partidos de liga tapados por un dia de copa ===`);
let tapados = 0;
const tapadosPorCopa = new Map<string, number>();
for (const club of muestra) {
  const fechas = fixturesForClub(club.name);
  const reservas = new Map<string, string>();
  for (const f of fechas) {
    if (!f.esReservaDeCuadro || f.competition.kind === 'national_tournament') continue;
    reservas.set(`${f.temporada}|${f.date}`, f.competition.name);
  }
  for (const f of fechas) {
    if (f.competition.kind !== 'league' || f.esReservaDeCuadro || f.esPlayoff) continue;
    const copa = reservas.get(`${f.temporada}|${f.date}`);
    if (!copa) continue;
    tapados++;
    tapadosPorCopa.set(copa, (tapadosPorCopa.get(copa) ?? 0) + 1);
  }
}
console.log(`  ${tapados} partidos de liga caen el mismo dia que una reserva de copa`);
for (const [copa, n] of [...tapadosPorCopa].sort((a, b) => b[1] - a[1]).slice(0, 6)) {
  console.log(`     ${String(n).padStart(4)} x  ${copa}`);
}
if (tapados) console.log(`  Cada uno es un partido que el calendario promete y no se juega nunca.`);

const problemas = pocoDescanso.length + saturadas.length + sinResolver + tapados;
console.log(`\n${problemas === 0 ? 'Sin problemas de descanso.' : `${problemas} hallazgos de descanso (ver arriba).`}`);
