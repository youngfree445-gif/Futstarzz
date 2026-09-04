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
  REGLAMENTOS, fechasDelCuadroFinal, reglamentoDe, repartesDosTitulos, seDefineConAlargue, seVaAlAlargue, torneosDelAnio,
  alargueEnCopaNacional,
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
// =================================================================================================
// EL ALARGUE VA SOLO DONDE EL REGLAMENTO LO TIENE
// =================================================================================================
//
// No es "todos los torneos tienen alargue": dentro de un mismo torneo cambia segun la ronda, y la
// Conmebol es el contraejemplo -- y justo el que este jugador juega. Verificado contra los
// reglamentos vigentes de 2026:
//
//   . Champions y Europa League: llave empatada en el global -> alargue y despues penales, en todas
//     las rondas (la UEFA elimino el gol de visitante en 2021/22).
//   . Libertadores y Sudamericana: octavos, cuartos y semis -> penales DIRECTO, sin alargue. Solo la
//     final, que es a partido unico, lleva alargue.
//   . Concacaf Champions Cup: alargue en las llaves y en la final. (En la realidad la Concacaf
//     todavia desempata el global por gol de visitante, que el juego no modela: esas llaves aca
//     llegan al alargue, que es el paso siguiente del reglamento.)
//   . Liga BetPlay (cuadrangulares y final): penales directo.
//   . Las COPAS NACIONALES no se preguntan por el nombre del torneo sino por el PAIS -- son
//     diecinueve, cada una con su reglamento -- y viven en REGLAMENTOS.copaAlargue.
//
// Lo que no esta verificado contesta que NO: no se inventa una regla para un torneo cuyo reglamento
// no se leyo, y ese default tambien se prueba, porque es una decision y no un hueco.

console.log('');
console.log('=== El alargue, torneo por torneo ===');

ok('la Champions define con alargue en cualquier ronda',
   seDefineConAlargue('champions') && seDefineConAlargue('champions', { esLaFinal: true }));
ok('y la Europa League igual',
   seDefineConAlargue('europa') && seDefineConAlargue('europa', { esLaFinal: true }));
ok('la Libertadores NO lleva alargue en octavos, cuartos ni semis',
   !seDefineConAlargue('libertadores'));
ok('pero su FINAL si', seDefineConAlargue('libertadores', { esLaFinal: true }));
ok('la Sudamericana sigue la misma regla que la Libertadores',
   !seDefineConAlargue('sudamericana') && seDefineConAlargue('sudamericana', { esLaFinal: true }));
ok('la Concacaf lleva alargue en las llaves y en la final',
   seDefineConAlargue('concacaf') && seDefineConAlargue('concacaf', { esLaFinal: true }));
ok('lo que no se leyo no inventa alargue',
   !seDefineConAlargue('Copa BetPlay', { esLaFinal: true }) && !seDefineConAlargue(null, { esLaFinal: true }));

// --- LAS COPAS NACIONALES, cada pais la suya ---------------------------------------------------
//
// No se preguntan por el nombre del torneo sino por el PAIS: son diecinueve copas distintas y la
// regla cambia DENTRO de cada una. Verificado contra los reglamentos vigentes; lo que no se
// verifico va a penales directo y ese caso tambien se prueba, porque el default es una decision.
console.log('');
console.log('=== El alargue en la copa nacional de cada pais ===');

// Las que lo llevan en toda ronda.
for (const liga of ['Inglesa', 'Española', 'Alemana', 'Holandesa', 'Portuguesa']) {
  ok(`la copa de ${liga} lleva alargue en toda ronda`,
     alargueEnCopaNacional(liga) && alargueEnCopaNacional(liga, { esLaFinal: true }));
}
// Las que NO lo llevan nunca. Son la mitad del mundo, y suponer lo contrario le agregaria media
// hora a partidos que en la realidad terminan a los 90.
for (const liga of ['Colombiana', 'Argentina', 'Brasileña']) {
  ok(`la copa de ${liga} va a penales directo, tambien en la final`,
     !alargueEnCopaNacional(liga) && !alargueEnCopaNacional(liga, { esLaFinal: true }));
}
// LAS DOS QUE CAMBIAN DENTRO DEL TORNEO, que son la razon de que esto vaya por ronda y no por copa.
ok('la Coupe de France va a penales directo salvo en la FINAL',
   !alargueEnCopaNacional('Francesa') && !alargueEnCopaNacional('Francesa', { esLaSemifinal: true })
   && alargueEnCopaNacional('Francesa', { esLaFinal: true }));
ok('la Coppa Italia recien lleva alargue desde la SEMIFINAL',
   !alargueEnCopaNacional('Italiana') && alargueEnCopaNacional('Italiana', { esLaSemifinal: true })
   && alargueEnCopaNacional('Italiana', { esLaFinal: true }));
// Y el default, que tambien es una afirmacion: sin reglamento cargado, penales.
ok('una copa sin reglamento cargado no inventa alargue',
   !alargueEnCopaNacional('Mexicana', { esLaFinal: true }) && !alargueEnCopaNacional('Chilena')
   && !alargueEnCopaNacional('liga que no existe'));

// LOS TORNEOS DE SELECCIONES: alargue en toda la eliminacion directa, nunca en grupos.
//
// Lo confirmo el jugador y es la regla de siempre de FIFA. La distincion por etapa NO es un detalle:
// en la fase de grupos el empate es un resultado valido que reparte un punto a cada uno, asi que un
// alargue ahi romperia la tabla del grupo.
for (const torneo of ['mundial', 'eurocopa', 'copaamerica'] as const) {
  ok(`${torneo}: alargue en la eliminacion directa`,
     seDefineConAlargue(torneo, { enEliminacionDirecta: true }));
  ok(`${torneo}: NADA de alargue en la fase de grupos`,
     !seDefineConAlargue(torneo, { enEliminacionDirecta: false }));
}

// Y LA DECISION COMPLETA, que es la que corre en el minuto 90.
//
// Junta las dos condiciones -- que el torneo lo use y que la llave este realmente empatada -- y
// vive fuera de la pantalla justamente para poder probarla: metida en el componente solo se
// verificaba jugando hasta que un global quedara igualado, que en una carrera entera puede no pasar.

console.log('');
console.log('=== Cuando se va al alargue ===');

// Ida 1-2 (perdiendo) y vuelta 1-0: global 2-2 -> alargue en Champions.
ok('global igualado en Champions: se va al alargue',
   seVaAlAlargue(seDefineConAlargue('champions'), '1-2', 1, 0));
// Con el MISMO marcador, en la Libertadores no hay alargue: van directo a penales.
ok('el mismo global en octavos de Libertadores: NO',
   !seVaAlAlargue(seDefineConAlargue('libertadores'), '1-2', 1, 0));
ok('pero en la final de la Libertadores si',
   seVaAlAlargue(seDefineConAlargue('libertadores', { esLaFinal: true }), null, 1, 1));
// Global desigualado: no hay nada que desempatar aunque el partido de hoy empate.
ok('si el global NO esta empatado, no hay alargue aunque hoy se empate',
   !seVaAlAlargue(true, '3-1', 1, 1));
// Partido unico (sin ida): manda el marcador.
ok('partido unico empatado: alargue', seVaAlAlargue(true, null, 2, 2));
ok('partido unico ganado: no', !seVaAlAlargue(true, null, 2, 1));
// Y sin la regla, nunca -- por mas empatado que este.
ok('sin alargue en el reglamento, un empate va directo a penales',
   !seVaAlAlargue(false, '1-1', 0, 0));

console.log(fallas === 0 ? `Los ${corridos} casos pasan.` : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
