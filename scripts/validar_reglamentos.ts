// Cada liga jugable tiene que tener su reglamento, y todos los modulos tienen que leer EL MISMO.
//
// Antes esto era imposible de comprobar: la respuesta a "cuantos titulos reparte esta liga" estaba
// escrita en cuatro archivos distintos, y ninguno sabia de los otros. Mexico estaba en uno y en los
// otros tres no, asi que el calendario le partia el año en dos torneos mientras la vitrina y la
// pantalla del partido lo trataban como una liga de un solo campeon.
//
// Con una sola tabla, "preciso" deja de ser una intencion y pasa a ser algo que falla si le falta
// un dato.

import { CLUBS_DATABASE } from '../src/data';
import { esClubJugable } from '../src/clubesJugables';
import {
  REGLAMENTOS, fechasDelCuadroFinal, reglamentoDe, repartesDosTitulos, torneosDelAnio,
} from '../src/reglamentos';
import { isApeturaClausuraLeague } from '../src/leagueEngine';
import { nombreCopaNacional, tieneCopaNacionalReal } from '../src/copaNacional';
import { torneoDelClubEnFecha, fixturesForClub } from '../src/dateSchedule';

let fallas = 0, corridos = 0;
const ok = (n: string, c: boolean, d = '') => {
  corridos++; if (!c) fallas++;
  console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`);
};

// =============================================================================================
// 1. TODA LIGA JUGABLE TIENE REGLAMENTO
// =============================================================================================

const ligasJugables = [...new Set(CLUBS_DATABASE.filter(esClubJugable).map(c => c.league))].sort();
const sinReglamento = ligasJugables.filter(l => !(l in REGLAMENTOS));

console.log(`${ligasJugables.length} ligas jugables\n`);
ok('todas las ligas jugables tienen reglamento cargado',
   sinReglamento.length === 0, sinReglamento.join(', ') || '');

// =============================================================================================
// 2. LOS MODULOS CONTESTAN LO MISMO
// =============================================================================================
//
// Es la prueba que no existia. Cada uno de estos venia de una lista distinta.

const discrepan = ligasJugables.filter(l => isApeturaClausuraLeague(l) !== repartesDosTitulos(l));
ok('leagueEngine y el reglamento dicen lo mismo sobre Apertura/Clausura',
   discrepan.length === 0, discrepan.join(', ') || '');

const copasMal = ligasJugables.filter(l => {
  const delReglamento = reglamentoDe(l).copaNacional;
  return tieneCopaNacionalReal(l) !== !!delReglamento
    || (!!delReglamento && nombreCopaNacional(l) !== delReglamento);
});
ok('copaNacional lee los nombres del reglamento', copasMal.length === 0, copasMal.join(', ') || '');

// =============================================================================================
// 3. EL CUADRO FINAL Y LAS FECHAS QUE PIDE
// =============================================================================================

for (const [liga, r] of Object.entries(REGLAMENTOS)) {
  if (r.definicion !== 'cuadrangular') continue;
  const fechas = fechasDelCuadroFinal(liga);
  const rondas = Math.round(Math.log2(r.clubesDelCuadro ?? 8));
  ok(`${liga}: cuadro de ${r.clubesDelCuadro} pide ${rondas} rondas = ${fechas} fechas`,
     fechas === rondas * 2 && fechas > 0);
}
ok('una liga de tabla no pide fechas de cuadro', fechasDelCuadroFinal('Brasileña') === 0);
ok('una liga sin reglamento tampoco', fechasDelCuadroFinal('Noruega') === 0);

// =============================================================================================
// 4. MEXICO: EL CASO QUE ESTABA ROTO
// =============================================================================================
//
// La Liga MX arranca en JULIO con el Apertura y cierra en mayo con el Clausura del año siguiente,
// asi que dentro de un mismo año calendario van Clausura primero y Apertura despues -- al reves que
// Colombia. Llamarlos como alla dejaba a un jugador del America ganando el "Apertura" en abril.

console.log('');
ok('Mexico reparte dos titulos por año', repartesDosTitulos('Mexicana'));
ok('y ahora leagueEngine tambien lo sabe', isApeturaClausuraLeague('Mexicana') === true);
ok('en Mexico el año arranca con el CLAUSURA',
   torneosDelAnio('Mexicana')[0] === 'Clausura', torneosDelAnio('Mexicana').join(' -> '));
ok('en Colombia arranca con el Apertura',
   torneosDelAnio('Colombiana')[0] === 'Apertura', torneosDelAnio('Colombiana').join(' -> '));

// Y el calendario tiene que rotular en consecuencia.
const mex = CLUBS_DATABASE.find(c => c.league === 'Mexicana' && esClubJugable(c));
if (mex) {
  const deLiga = fixturesForClub(mex.name).filter(f => f.temporada === 1 && f.competition.kind === 'league');
  const enMarzo = deLiga.find(f => f.date.slice(5, 7) === '03');
  const enSeptiembre = deLiga.find(f => f.date.slice(5, 7) === '09');
  if (enMarzo) {
    ok(`${mex.name}: un partido de marzo es del Clausura`,
       torneoDelClubEnFecha(mex.name, enMarzo.date) === 'Clausura',
       `${enMarzo.date} -> ${torneoDelClubEnFecha(mex.name, enMarzo.date)}`);
  }
  if (enSeptiembre) {
    ok(`${mex.name}: uno de septiembre es del Apertura`,
       torneoDelClubEnFecha(mex.name, enSeptiembre.date) === 'Apertura',
       `${enSeptiembre.date} -> ${torneoDelClubEnFecha(mex.name, enSeptiembre.date)}`);
  }
}

console.log('');
console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
