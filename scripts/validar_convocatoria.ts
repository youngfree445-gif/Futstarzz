/**
 * Comprueba la lista de convocados.
 *
 *   npm run validar:convocatoria
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA Y POR QUE
 * ---------------------------------------------------------------------------------------------
 *
 * La convocatoria ya funcionaba antes de esta feature -- lo que no habia era forma de ENTERARSE. Al
 * agregar el aviso aparecio un riesgo nuevo que antes no existia: que el feed anuncie una cosa y el
 * juego haga otra. Un anuncio que miente rompe mas confianza que el silencio de antes.
 *
 * Por eso la regla se mudo a src/convocatoria.ts y la consumen los dos lados. Esto verifica que la
 * regla se comporte como dice, y sobre todo que la NOMINA se pueda armar de verdad: si las
 * selecciones no tuvieran figuras cargadas, la lista saldria vacia y el aviso quedaria en la nada.
 */
import { evaluarConvocatoria, motivoDeAusencia, laNomina } from '../src/convocatoria';
import { ALL_NATIONAL_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID } from '../src/data';
import { CONFEDERACION_POR_SELECCION, esJugable } from '../src/eliminatorias';
import { ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD, ELIMINATORIAS_CALLUP_MIN_MATCHES } from '../src/leagueEngine';
import { PlayerProfile } from '../src/types';

let fallas = 0;
const chequear = (nombre: string, ok: boolean, detalle = '') => {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${nombre}${detalle ? `   ${detalle}` : ''}`);
  if (!ok) fallas++;
};

const perfil = (nationality: string, prestige: number, partidos: number): PlayerProfile =>
  ({ name: 'Camilo Restrepo', nationality, prestige, careerStats: { partidosHistoricos: partidos } } as any);

// DOS COSAS QUE ESTE VALIDADOR HIZO MAL LA PRIMERA VEZ, anotadas para no repetirlas:
//
// 1. `nationality` NO guarda el pais: guarda el GENTILICIO, porque el mapa se construye desde
//    `t.league` de cada seleccion (ver NATIONALITY_TO_WORLD_CUP_TEAM_ID en data.ts). La clave es
//    'Colombiana', no 'Colombia' -- con 'Colombia' devuelve "no tiene seleccion modelada", que es
//    la respuesta correcta a una pregunta mal hecha.
//
// 2. 2026 es AÑO DE MUNDIAL, asi que cicloDeEliminatorias(2026) es null y NO hay convocatoria a
//    eliminatorias ese año. Las del Mundial 2030 se juegan en 2027, 2028 y 2029. Probar la
//    convocatoria en un año de Mundial da todo en cero y parece un bug del juego.
const COLOMBIA = 'Colombiana';
const ANIO = 2027;

// --- Los dos cortes ------------------------------------------------------------------------

const arriba = ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD;
const minPart = ELIMINATORIAS_CALLUP_MIN_MATCHES;

chequear('con prestigio y partidos, convocado',
  evaluarConvocatoria(perfil(COLOMBIA,arriba, minPart), ANIO).convocado);

chequear('un punto de prestigio por debajo, afuera',
  !evaluarConvocatoria(perfil(COLOMBIA,arriba - 1, minPart), ANIO).convocado);

chequear('un partido por debajo, afuera',
  !evaluarConvocatoria(perfil(COLOMBIA,arriba, minPart - 1), ANIO).convocado);

chequear('debutante sin nada, afuera',
  !evaluarConvocatoria(perfil(COLOMBIA,10, 0), ANIO).convocado);

// Lo que falta tiene que ser un numero util, no un booleano: es lo que convierte la ausencia en un
// objetivo. Si dijera solo "no estas", el jugador no sabria que mover.
const flojo = evaluarConvocatoria(perfil(COLOMBIA,arriba - 7, minPart - 3), ANIO);
chequear('dice CUANTO falta, no solo que falta',
  flojo.faltaPrestigio === 7 && flojo.faltaPartidos === 3,
  `prestigio ${flojo.faltaPrestigio}, partidos ${flojo.faltaPartidos}`);

chequear('el que ya cumple no tiene faltantes',
  evaluarConvocatoria(perfil(COLOMBIA,arriba + 20, minPart + 50), ANIO).faltaPrestigio === 0);

// --- El motivo -----------------------------------------------------------------------------

chequear('convocado no tiene motivo que explicar',
  motivoDeAusencia(evaluarConvocatoria(perfil(COLOMBIA,arriba, minPart), ANIO)) === null);

const motivo = motivoDeAusencia(flojo);
chequear('el motivo nombra lo que falta', !!motivo && motivo.includes('7') && motivo.includes('3'), motivo ?? '(nulo)');

const sinSeleccion = evaluarConvocatoria(perfil('Marte', 90, 300), ANIO);
chequear('nacionalidad sin seleccion se explica', !sinSeleccion.convocado && !!motivoDeAusencia(sinSeleccion));

// En AÑO DE MUNDIAL no hay eliminatorias, asi que no hay lista que anunciar. Si esto no se
// respetara, el feed sacaria una convocatoria a un torneo que ese año no se juega.
const enMundial = evaluarConvocatoria(perfil(COLOMBIA, 99, 999), 2026);
chequear('en año de Mundial no hay convocatoria a eliminatorias',
  !enMundial.hayEliminatorias && !enMundial.convocado);

// --- La nomina -----------------------------------------------------------------------------

const dentro = evaluarConvocatoria(perfil(COLOMBIA,arriba + 10, minPart + 10), ANIO);
const nomina = laNomina(dentro, 'Camilo Restrepo');
chequear('la nomina te pone primero y marcado',
  nomina.length > 1 && nomina[0].esVos && nomina[0].nombre === 'Camilo Restrepo',
  `${nomina.length} nombres`);

chequear('la nomina trae figuras REALES de la base',
  nomina.slice(1).every(j => !j.esVos && j.nombre.length > 3) && nomina.length >= 3,
  nomina.slice(1, 4).map(j => j.nombre).join(', '));

const afuera = evaluarConvocatoria(perfil(COLOMBIA,10, 0), ANIO);
chequear('si no entras, no aparecas en la lista',
  laNomina(afuera, 'Camilo Restrepo').every(j => !j.esVos));

// Un jugador que se llama IGUAL que una figura cargada no puede salir dos veces en la misma lista.
const figuraColombiana = ALL_NATIONAL_TEAMS_DATABASE.find(t => t.id === NATIONALITY_TO_WORLD_CUP_TEAM_ID[COLOMBIA])?.starPlayers?.[0] ?? '';
const nominaHomonimo = laNomina(dentro, figuraColombiana);
chequear('el homonimo de una figura no se duplica',
  nominaHomonimo.filter(j => j.nombre === figuraColombiana).length === 1,
  figuraColombiana);

// --- La base alcanza para que el aviso sirva -----------------------------------------------

// Si las selecciones no tuvieran figuras ni DT cargados, el aviso saldria vacio y la feature seria
// una caja de texto en blanco. Esto mide contra la base REAL.
const jugables = ALL_NATIONAL_TEAMS_DATABASE.filter(t => {
  const conf = CONFEDERACION_POR_SELECCION[t.id];
  return conf && esJugable(conf);
});
const conFiguras = jugables.filter(t => (t.starPlayers?.length ?? 0) >= 3);
const conDt = jugables.filter(t => !!t.dt);

chequear('las selecciones jugables tienen figuras cargadas',
  jugables.length > 0 && conFiguras.length === jugables.length,
  `${conFiguras.length}/${jugables.length} con 3+ figuras`);

chequear('las selecciones jugables tienen DT cargado',
  conDt.length === jugables.length,
  `${conDt.length}/${jugables.length}`);

// Que las nacionalidades que el jugador puede elegir lleguen de verdad a una seleccion jugable.
const nacionalidades = Object.keys(NATIONALITY_TO_WORLD_CUP_TEAM_ID);
const conCamino = nacionalidades.filter(n => evaluarConvocatoria(perfil(n, 99, 999), ANIO).hayEliminatorias);
chequear('hay nacionalidades con camino a la seleccion',
  conCamino.length > 0,
  `${conCamino.length} de ${nacionalidades.length} nacionalidades juegan eliminatorias modeladas`);

// =============================================================================================
// EL CORTE CAMBIA SEGUN EL MODO (regla del autor, 15 de agosto de 2026)
// =============================================================================================
//
// Superestrella: te llaman si o si. Veterano: corte mas bajo PERO tiene que estar rindiendo.
// Normal: los dos cortes de siempre. Lo que se prueba es que veterano sea un CAMINO DISTINTO y no
// un descuento: con poco prestigio y promedio flojo NO entra, aunque el corte sea mas bajo.

const perfilBase = (extra: any = {}) => ({
  nationality: 'Colombiana', prestige: 40,
  careerStats: { partidosHistoricos: 120, sumaCalificacionesHistoricas: 7.2 * 120 },
  ...extra,
} as any);

const anio = 2027;
{
  const estrella = evaluarConvocatoria(perfilBase({ prestige: 5, starModeEnabled: true, careerStats: { partidosHistoricos: 1, sumaCalificacionesHistoricas: 5 } }), anio);
  chequear('superestrella: te llaman aunque no tengas ni prestigio ni partidos', estrella.convocado === estrella.hayEliminatorias);

  const vetBueno = evaluarConvocatoria(perfilBase({ prestige: 52, startedAsVeteran: true }), anio);
  chequear('veterano rindiendo: entra con menos prestigio que el corte normal (62)', vetBueno.convocado === vetBueno.hayEliminatorias);

  const vetFlojo = evaluarConvocatoria(perfilBase({ prestige: 52, startedAsVeteran: true, careerStats: { partidosHistoricos: 120, sumaCalificacionesHistoricas: 6.0 * 120 } }), anio);
  chequear('veterano que NO se destaca: no entra, aunque el corte sea mas bajo', !vetFlojo.convocado);

  const normal = evaluarConvocatoria(perfilBase({ prestige: 52 }), anio);
  chequear('modo normal: 52 de prestigio sigue sin alcanzar', !normal.convocado);
  chequear('y se le sigue diciendo cuanto le falta', normal.faltaPrestigio === 10);
}


console.log(fallas === 0
  ? `\nLa lista de convocados cumple: los cortes valen, la ausencia se explica y la nomina sale con nombres reales.`
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
