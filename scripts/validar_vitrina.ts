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

console.log(fallas === 0 ? '\nLos 2 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
