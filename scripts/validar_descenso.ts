// El club que desciende tiene que poder JUGAR su nueva categoria.
//
// Antes de las casillas de calendario, un descenso rompia la carrera: el motor mandaba al club a
// Segunda y el calendario le seguia dando rivales de Primera. Ninguno estaba en su liga, las dos
// busquedas de rival fallaban, y el partido caia a un respaldo que no registra el resultado. 54
// fechas jugadas que no contaban para nada y una temporada que no terminaba nunca.

import { CLUBS_DATABASE } from '../src/data';
import { setDivisionOverrides, leagueKeyFor } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { fixturesAtStep, pickPrimary, setIntercambiosDeCasilla, temporadaDelPaso } from '../src/dateSchedule';
import { resolverClubDeCalendario } from '../src/clubAliases';
import type { Club } from '../src/types';

let fallas = 0, corridos = 0;
const ok = (n: string, c: boolean, d = '') => { corridos++; if (!c) fallas++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };

const baja = CLUBS_DATABASE.find(c => c.name === 'Deportivo Pasto')! as Club;   // Primera
const sube = clubesDeLiga('Colombiana-2')[0];                                   // Segunda

// Cuantas fechas de liga encuentran rival EN SU PROPIA LIGA, en la temporada 2.
function rivalesResueltos(club: Club): { total: number; conRival: number; comp: string } {
  const liga = clubesDeLiga(leagueKeyFor(club));
  let total = 0, conRival = 0, comp = '';
  for (let paso = 1; paso <= 200; paso++) {
    const t = temporadaDelPaso(club.name, paso);
    if (!t) break;
    if (t.temporada < 2) continue;
    if (t.temporada > 2) break;
    const hoy = fixturesAtStep(club.name, paso);
    if (!hoy) break;
    const fx = pickPrimary(hoy.fixtures);
    if (!fx || fx.competition.kind !== 'league') continue;
    // Las fechas de cuadrangular no traen rival ("Por definir"): lo pone el cuadro, no el
    // calendario. Contarlas aca daria un falso negativo -- son 12 por temporada.
    if (fx.esPlayoff) continue;
    total++;
    comp = fx.competition.name;
    if (resolverClubDeCalendario(liga, fx.opponentName, club.league, 'league', fx.competition.name)) conRival++;
  }
  return { total, conRival, comp };
}

console.log('=== ANTES: sin descenso ===');
setDivisionOverrides(undefined); setIntercambiosDeCasilla(undefined);
const normal = rivalesResueltos(baja);
ok(`${baja.name} en Primera resuelve todos sus rivales`,
   normal.total > 0 && normal.conRival === normal.total, `${normal.conRival}/${normal.total} en "${normal.comp}"`);

console.log('');
console.log('=== DESCENSO SIN intercambio (el bug) ===');
setDivisionOverrides({ [baja.id]: 2, [sube.id]: 1 });
setIntercambiosDeCasilla(undefined);
const roto = rivalesResueltos(baja);
ok('sin intercambio, NINGUN rival del calendario esta en su liga nueva',
   roto.conRival === 0, `${roto.conRival}/${roto.total} en "${roto.comp}"`);

console.log('');
console.log('=== DESCENSO CON intercambio ===');
setIntercambiosDeCasilla([{ temporada: 2, a: baja.name, b: sube.name }]);
const arreglado = rivalesResueltos(baja);
ok(`${baja.name} descendido juega la categoria de abajo`,
   arreglado.comp !== normal.comp, `ahora juega "${arreglado.comp}" (antes "${normal.comp}")`);
ok('y resuelve TODOS sus rivales dentro de su liga nueva',
   arreglado.total > 0 && arreglado.conRival === arreglado.total, `${arreglado.conRival}/${arreglado.total}`);

const alSubir = rivalesResueltos(sube);
ok(`${sube.name} ascendido juega la de arriba`,
   alSubir.comp === normal.comp, `juega "${alSubir.comp}"`);
ok('y tambien resuelve todos sus rivales',
   alSubir.total > 0 && alSubir.conRival === alSubir.total, `${alSubir.conRival}/${alSubir.total}`);

console.log('');
console.log('=== EL PASADO NO SE TOCA ===');
const paso1 = fixturesAtStep(baja.name, 1);
setIntercambiosDeCasilla(undefined);
const paso1Sin = fixturesAtStep(baja.name, 1);
ok('la temporada 1 queda igual con o sin intercambios (el historial no se reescribe)',
   paso1?.date === paso1Sin?.date, `${paso1?.date} vs ${paso1Sin?.date}`);

setDivisionOverrides(undefined); setIntercambiosDeCasilla(undefined);
console.log('');
console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
