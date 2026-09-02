/**
 * LA TABLA ES DEL TORNEO QUE SE ESTA JUGANDO, no del año.
 *
 *   npm run validar:tablas
 *
 * ---------------------------------------------------------------------------------------------
 * QUE PROTEGE
 * ---------------------------------------------------------------------------------------------
 *
 * Colombia, Argentina y Mexico reparten DOS titulos por año: Apertura y Clausura son dos torneos,
 * cada uno con su tabla, su campeon y su descenso. El motor solo reiniciaba la tabla al cambiar de
 * AÑO, asi que los dos semestres se sumaban en una sola tabla anual.
 *
 * Reportado: "en la parte de tablas te sale una liga anual, eso no es asi, es apertura y clausura;
 * si estamos en apertura se muestra la tabla del apertura, si estamos en clausura los de clausura".
 *
 * Y no es cosmetico: de esa tabla salen la posicion del club, el campeon del torneo y los cupos
 * continentales del año siguiente. Con una tabla anual, el campeon del Clausura se decidia con los
 * puntos de los dos semestres juntos.
 *
 * Lo que se mide es la diferencia entre jugar hasta junio (Apertura) y seguir hasta noviembre
 * (Clausura): la segunda tabla NO puede arrastrar los partidos de la primera.
 */
import { CLUBS_DATABASE } from '../src/data';
import { clubesDeLiga } from '../src/clubesJugables';
import { fixturesForClub } from '../src/dateSchedule';
import { getOrCreateSeasonForLeague, resolvePlayerWeekForLeague, isApeturaClausuraLeague } from '../src/leagueEngine';
import { repartesDosTitulos, torneosDelAnio } from '../src/reglamentos';
import type { Club } from '../src/types';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

/** Juega la liga del club hasta la fecha dada y devuelve la tabla que queda. */
function tablaHasta(club: Club, leagueKey: string, hasta: string) {
  const clubes = clubesDeLiga(leagueKey) as Club[];
  let season = getOrCreateSeasonForLeague(clubes, undefined, 1);
  const fechas = [...new Set(fixturesForClub(club.name)
    .filter(f => f.temporada === 1 && f.competition.kind === 'league' && f.date <= hasta)
    .map(f => f.date))].sort();
  for (const fecha of fechas) {
    season = resolvePlayerWeekForLeague(
      season, clubes, 1, club.id, true, 1, 0, undefined, { fecha, temporada: 1 });
  }
  return season;
}

for (const [leagueKey, nombreClub] of [
  ['Colombiana-1', 'Junior de Barranquilla'],
  ['Argentina-1', 'Boca Juniors'],
] as [string, string][]) {
  const club = CLUBS_DATABASE.find(c => c.name === nombreClub);
  if (!club) { console.log(`(no está ${nombreClub})`); continue; }
  const [primero, segundo] = torneosDelAnio(club.league);

  console.log(`\n=== ${club.name} · ${club.league} (${primero} / ${segundo}) ===`);
  ok('la liga reparte dos títulos por año', repartesDosTitulos(club.league) && isApeturaClausuraLeague(club.league));

  // Hasta el 30 de junio: todo lo jugado es del primer torneo.
  const enJunio = tablaHasta(club, leagueKey, '2026-06-30');
  const pjApertura = enJunio.table.reduce((n, t) => n + t.pj, 0);
  ok(`la tabla de ${primero} tiene partidos`, pjApertura > 0, `${pjApertura} partidos`);
  ok(`y se rotula como ${primero}`, enJunio.torneoDeLaTabla === primero, String(enJunio.torneoDeLaTabla));
  ok('el semestre queda anotado como 1', enJunio.semester === 1, String(enJunio.semester));

  // Hasta noviembre: ya se juega el segundo, y su tabla NO puede traer lo del primero.
  const enNoviembre = tablaHasta(club, leagueKey, '2026-11-30');
  const pjClausura = enNoviembre.table.reduce((n, t) => n + t.pj, 0);
  ok(`en ${segundo} la tabla es OTRA, no la anual`, enNoviembre.torneoDeLaTabla === segundo,
     String(enNoviembre.torneoDeLaTabla));
  ok('el semestre pasa a 2', enNoviembre.semester === 2, String(enNoviembre.semester));
  // LA MEDIDA QUE IMPORTA: si arrastrara el primer torneo, la segunda tabla tendria los partidos de
  // los dos juntos -- mas que la del primero, no menos.
  ok(`la tabla de ${segundo} no arrastra los partidos de ${primero}`,
     pjClausura < pjApertura + pjClausura && pjClausura <= pjApertura * 1.6,
     `${primero}: ${pjApertura} · ${segundo}: ${pjClausura}`);
  // El tope se mide contra el PRIMER torneo, no contra el segundo: si la tabla arrastrara, tanto los
  // puntos como los partidos del segundo se duplicarían, y una cota calculada sobre sus propios
  // partidos subiría con ellos -- el chequeo pasaría estando roto, que es peor que no tenerlo.
  const puntosMaxPrimero = Math.max(...enJunio.table.map(t => t.puntos));
  const puntosMaxSegundo = Math.max(...enNoviembre.table.map(t => t.puntos));
  ok(`el puntero de ${segundo} no tiene los puntos de los dos torneos juntos`,
     puntosMaxSegundo <= puntosMaxPrimero * 1.6,
     `${primero}: ${puntosMaxPrimero} · ${segundo}: ${puntosMaxSegundo}`);
}

console.log(fallas === 0
  ? '\nCada torneo tiene su tabla: el Clausura no arranca con los puntos del Apertura.'
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
