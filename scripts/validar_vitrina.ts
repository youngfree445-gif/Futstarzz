// El trofeo fantasma de la vitrina, con el caso EXACTO que se reporto.
//
// Captura del 13 de agosto de 2026: fecha 9, 22 de febrero, 8 partidos jugados, y la vitrina ya
// mostraba "Primera Division Dimayor - Apertura 2026". El Apertura termina el 8 de junio.
//
// La causa: palmares.ts derivaba el campeon cuando "todos los partidos estan jugados", y las ligas
// con calendario real solo guardan en `fixtures` los partidos YA JUGADOS -- nunca los pendientes.
// A las ocho fechas el array tiene ocho y los ocho estan jugados: torneo "terminado" en febrero.
import { getPalmares } from '../src/palmares';
import { ULTIMATE_CLUBS_DATABASE } from '../src/data';
import type { PlayerProfile } from '../src/types';

// Las mismas dos funciones que le pasa el Dashboard, simplificadas a lo que este caso necesita.
const nombreDeLiga = (liga: string) => liga === 'Colombiana' ? 'Primera Division Dimayor' : liga;
const dosTorneos = (liga: string) => liga === 'Colombiana';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

const junior = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Junior de Barranquilla')!;
const nacional = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Atlético Nacional')!;
const rival = ULTIMATE_CLUBS_DATABASE.find(c => c.league === 'Colombiana' && c.id !== junior.id)!;

// Ocho fechas jugadas, Junior primero. Es EXACTAMENTE el estado de la captura.
const ochoFechas = Array.from({ length: 8 }, (_, i) => ({
  matchweek: i + 1, homeTeamId: junior.id, awayTeamId: rival.id,
  played: true, homeGoals: 2, awayGoals: 0,
}));
const perfil = {
  currentClubId: junior.id,
  clubHistory: [{ clubId: junior.id }],
  seasonHistory: [{ seasonNum: 1 }],
  cupTitles: [],
  leagueSeasons: {
    'Colombiana-1': {
      leagueKey: 'Colombiana-1', semester: 1, stage: 'regular',
      fixtures: ochoFechas,
      table: [
        { clubId: junior.id, name: junior.name, pj: 8, pts: 24, gf: 16, gc: 0, dg: 16, pg: 8, pe: 0, pp: 0 },
        { clubId: rival.id, name: rival.name, pj: 8, pts: 0, gf: 0, gc: 16, dg: -16, pg: 0, pe: 0, pp: 8 },
      ],
    },
  },
} as unknown as PlayerProfile;

const trofeos = getPalmares(perfil, ULTIMATE_CLUBS_DATABASE as any, nombreDeLiga, dosTorneos);
const fantasma = trofeos.filter(t => t.tipo === 'liga');
ok('8 fechas de 25 NO coronan campeon del Apertura', fantasma.length === 0,
   fantasma.length ? `(salio "${fantasma[0].nombre} - ${fantasma[0].detalle}")` : '');

// Contraprueba: un titulo LEGITIMO anotado en cupTitles tiene que seguir apareciendo.
const conTitulo = { ...perfil, cupTitles: [
  { competition: 'Liga BetPlay Dimayor', year: 2026, clubId: junior.id, torneo: 'Apertura', tipo: 'liga' },
] } as unknown as PlayerProfile;
ok('un titulo ganado de verdad SI aparece en la vitrina',
   getPalmares(conTitulo, ULTIMATE_CLUBS_DATABASE as any, nombreDeLiga, dosTorneos).some(t => t.tipo === 'liga'));

// =================================================================================================
// UNA TARJETA POR TROFEO, CON TODOS SUS ANOS
// =================================================================================================
//
// Ganar tres veces la misma liga son tres titulos pero UNA vitrina. Y el Apertura y el Clausura son
// dos campeonatos distintos con su propio campeon, asi que van en tarjetas separadas: tres Aperturas
// y un Clausura son DOS tarjetas, no cuatro ni una.

const repetidos = { ...perfil, cupTitles: [
  { competition: 'Liga BetPlay Dimayor', year: 2026, clubId: junior.id, torneo: 'Apertura', tipo: 'liga' },
  { competition: 'Liga BetPlay Dimayor', year: 2027, clubId: junior.id, torneo: 'Apertura', tipo: 'liga' },
  { competition: 'Liga BetPlay Dimayor', year: 2028, clubId: junior.id, torneo: 'Apertura', tipo: 'liga' },
  { competition: 'Liga BetPlay Dimayor', year: 2027, clubId: junior.id, torneo: 'Clausura', tipo: 'liga' },
  { competition: 'Superliga de Colombia', year: 2026, clubId: junior.id, tipo: 'copa' },
  { competition: 'Superliga de Colombia', year: 2027, clubId: junior.id, tipo: 'copa' },
] } as unknown as PlayerProfile;
const vitrina = getPalmares(repetidos, ULTIMATE_CLUBS_DATABASE as any, nombreDeLiga, dosTorneos);
const buscar = (d: string) => vitrina.find(t => t.detalle === d);

ok('los tres Aperturas van en UNA tarjeta, con sus tres anos',
   !!buscar('Apertura 2026, 2027, 2028'),
   vitrina.map(t => `${t.nombre} [${t.detalle}]`).join(' · '));
ok('y el Clausura va APARTE: es otro campeonato', !!buscar('Clausura 2027'));
ok('la Superliga repetida tambien se junta', !!buscar('2026, 2027'));
ok('seis titulos entran en tres tarjetas', vitrina.length === 3, `${vitrina.length} tarjetas`);
ok('y la cuenta de titulos sigue siendo seis',
   vitrina.reduce((n, t) => n + t.anios.length, 0) === 6);

// El mismo titulo con dos camisetas NO se junta: seria una tarjeta con anos de un club y el
// nombre del otro.
const dosClubes = { ...perfil, cupTitles: [
  { competition: 'Liga BetPlay Dimayor', year: 2026, clubId: junior.id, torneo: 'Apertura', tipo: 'liga' },
  { competition: 'Liga BetPlay Dimayor', year: 2029, clubId: nacional.id, torneo: 'Apertura', tipo: 'liga' },
] } as unknown as PlayerProfile;
ok('el mismo titulo con dos clubes distintos son dos tarjetas',
   getPalmares(dosClubes, ULTIMATE_CLUBS_DATABASE as any, nombreDeLiga, dosTorneos).length === 2);

console.log(fallas === 0 ? '\nLos casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
