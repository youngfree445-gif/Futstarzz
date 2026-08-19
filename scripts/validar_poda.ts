/**
 * La poda de ediciones terminadas no puede borrar nada que se vuelva a leer.
 *
 *   npm run validar:poda
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUE HACE FALTA
 * ---------------------------------------------------------------------------------------------
 *
 * Podar una partida es tirar datos, y lo que se tira no vuelve. Dos cosas siguen leyendo las
 * ediciones VIEJAS mucho despues de que terminen:
 *
 *   . La VITRINA. palmares.ts no lee un registro de titulos: recorre las copas guardadas y se
 *     queda con las que tienen `stage: 'done'` y un campeon que es de tus clubes. Borrar la
 *     edicion le borra el trofeo al jugador.
 *   . El REPARTO DE CUPOS del ano siguiente, que saca de ahi los campeones continentales.
 *
 * Por eso la poda no borra: reduce. Deja el id, el ano, la etapa y el campeon, y tira el cuerpo --
 * los grupos con sus tablas y sus partidos, el cuadro con sus llaves --, que es el 95% del peso.
 * Este validador comprueba las dos mitades: que el peso baje de verdad y que la vitrina siga
 * mostrando exactamente los mismos trofeos.
 */
import { CLUBS_DATABASE } from '../src/data';
import { crearCopaNacional } from '../src/copaNacional';
import { getOrCreateCupState, getOrCreateUefaCupState, prepararPlayoffDeLiga, buildInitialTable, sortTable } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { podarEdicionesTerminadas } from '../src/podarPartida';
import { getPalmares } from '../src/palmares';
import type { Club, PlayerProfile } from '../src/types';

let fallas = 0, corridos = 0;
const ok = (n: string, c: boolean, d = '') => {
  corridos++; if (!c) fallas++;
  console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`);
};

const clubes = CLUBS_DATABASE as Club[];
const peso = (x: unknown) => JSON.stringify(x).length;
const mio = clubes.find(c => c.name === 'Junior de Barranquilla')!;

// --- Una carrera de tres temporadas con todo terminado ------------------------------------------
const libertadores = getOrCreateCupState('libertadores', 1, clubes, undefined, 13);
const champions = getOrCreateUefaCupState('champions', clubes, undefined, 17);
const copaNacional = crearCopaNacional('Colombiana', 1, clubes, c => (c.division === 2 ? 2 : 1));
const cuadrangular = prepararPlayoffDeLiga(undefined, sortTable(buildInitialTable(clubesDeLiga('Colombiana-1'))), 6);

// Se les pone campeon a mano: lo que importa es que la poda respete el resultado, no como se llego.
const conCampeon = { ...libertadores, championId: mio.id, stage: 'done' as const };
const nacionalCampeon = { ...copaNacional, championId: mio.id };
const cuadroCampeon = { ...cuadrangular, championId: mio.id };
const uefaCampeon = { ...champions, championId: mio.id, year: 1, stage: 'done' as const };

const perfil = {
  name: 'Cani', currentClubId: mio.id, currentWeek: 200,
  seasonHistory: [{ clubId: mio.id, year: 1 }],
  continentalCups: { 'libertadores-1': conCampeon, 'libertadores-3': { ...conCampeon, year: 3 } },
  uefaCups: { champions: uefaCampeon },
  domesticCups: { 'Colombiana-1': nacionalCampeon },
  playoffsDeLiga: { 'Colombiana-1|1|Apertura': cuadroCampeon },
  cupTitles: [],
} as unknown as PlayerProfile;

const TEMPORADA_ACTUAL = 3;
const podado = podarEdicionesTerminadas(perfil, TEMPORADA_ACTUAL);

// --- 1. Pesa menos, y bastante -------------------------------------------------------------------
const antes = peso(perfil), despues = peso(podado);
// El 30% que queda es, casi entero, la edicion EN CURSO -- que no se poda a proposito.
ok('la partida podada pesa mucho menos',
   despues < antes * 0.4,
   `${Math.round(antes / 1024)} KB -> ${Math.round(despues / 1024)} KB (${Math.round(100 - despues * 100 / antes)}% menos)`);

// --- 2. La vitrina muestra LO MISMO ---------------------------------------------------------------
const trofeos = (p: PlayerProfile) =>
  getPalmares(p, clubes, (l, d) => `${l}${d ?? ''}`, () => true).map(t => t.id).sort().join(' | ');
ok('la vitrina muestra exactamente los mismos trofeos',
   trofeos(perfil) === trofeos(podado),
   trofeos(podado) || '(ninguno)');
ok('y no es que no muestre ninguno', trofeos(perfil).length > 0);

// --- 3. El campeon de cada edicion sobrevive ------------------------------------------------------
ok('el campeon de la copa continental sigue ahi',
   podado.continentalCups!['libertadores-1']!.championId === mio.id);
ok('el de la copa nacional tambien',
   podado.domesticCups!['Colombiana-1']!.championId === mio.id);
ok('el del cuadrangular tambien',
   podado.playoffsDeLiga!['Colombiana-1|1|Apertura']!.championId === mio.id);
ok('el de la copa europea tambien',
   podado.uefaCups!.champions!.championId === mio.id);

// --- 4. La temporada EN CURSO no se toca ----------------------------------------------------------
ok('la edicion de la temporada en curso queda intacta',
   peso(podado.continentalCups!['libertadores-3']) === peso(perfil.continentalCups!['libertadores-3']),
   'libertadores-3 (temporada 3, la actual)');
ok('y la vieja SI se reduce',
   peso(podado.continentalCups!['libertadores-1']) < peso(perfil.continentalCups!['libertadores-1']) * 0.2);

// --- 5. Podar dos veces no cambia nada -----------------------------------------------------------
ok('podar una partida ya podada la deja igual',
   podarEdicionesTerminadas(podado, TEMPORADA_ACTUAL) === podado);

// --- 6. Una edicion SIN campeon no se toca --------------------------------------------------------
// Solo esa copa en el perfil: con las otras adentro, la poda las reduciria a ellas y devolveria un
// objeto nuevo aunque a esta no la hubiera tocado.
const sinCampeon = {
  name: 'Cani', currentClubId: mio.id, currentWeek: 200,
  seasonHistory: [{ clubId: mio.id, year: 1 }],
  // A mitad del cuadro: 8 pasos dejan la copa en octavos, sin campeon.
  continentalCups: { 'libertadores-1': getOrCreateCupState('libertadores', 1, clubes, undefined, 8) },
} as unknown as PlayerProfile;
ok('una edicion vieja sin campeon NO se poda: todavia se puede estar resolviendo',
   podarEdicionesTerminadas(sinCampeon, TEMPORADA_ACTUAL) === sinCampeon);

console.log(fallas === 0 ? `\nLos ${corridos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
