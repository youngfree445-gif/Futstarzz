// ¿El cuadrangular se juega, y lo juegan los que TERMINARON ARRIBA?
//
// Antes quién lo jugaba lo decidía la permutación de nombres del calendario: al club que heredaba
// el lugar de un finalista le tocaba la final todas las temporadas, sin importar cómo le había ido.
// Acá se simula la fase regular, se siembra el cuadro con los 8 primeros y se comprueba que el
// campeón salga de ahí.
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { clubesDeLiga } from '../src/clubesJugables';
import { fixturesForClub } from '../src/dateSchedule';
import { buildInitialTable, applyResultToTable, sortTable, simulateMatch,
  prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, crucePlayoffDeLiga } from '../src/leagueEngine';
import type { Club, TwoLegBracket } from '../src/types';

let fallas = 0;
for (const key of ['Colombiana-1', 'Argentina-1']) {
  const clubes = clubesDeLiga(key) as Club[];
  // Fase regular simulada de la temporada 1, sólo con los partidos que NO son playoff.
  let tabla = buildInitialTable(clubes);
  const porNombre = new Map(clubes.map(c => [c.name, c]));
  const vistos = new Set<string>();
  let playoffs = 0;
  for (const club of clubes) {
    for (const f of fixturesForClub(club.name)) {
      if (f.temporada !== 1 || f.competition.kind !== 'league') continue;
      const clave = `${f.date}|${f.match.home}|${f.match.away}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      if (f.esPlayoff) { playoffs++; continue; }
      const home = porNombre.get(f.match.home), away = porNombre.get(f.match.away);
      if (!home || !away) continue;
      const { homeGoals, awayGoals } = simulateMatch(home, away);
      tabla = applyResultToTable(tabla, home.id, away.id, homeGoals, awayGoals);
    }
  }

  const ocho = sortTable(tabla).slice(0, 8);
  let bracket: TwoLegBracket | undefined;
  let vueltas = 0;
  while (vueltas++ < 12) {
    bracket = prepararPlayoffDeLiga(bracket, tabla);
    if (bracket.championId) break;
    bracket = resolverPasoPlayoffDeLiga(bracket, clubes);
  }

  const campeon = clubes.find(c => c.id === bracket?.championId);
  const salioDelTop8 = ocho.some(t => t.clubId === bracket?.championId);
  console.log(`\n=== ${key} ===`);
  console.log(`   fase regular: ${vistos.size - playoffs} partidos · playoffs marcados: ${playoffs}`);
  console.log(`   top 8: ${ocho.map(t => clubes.find(c => c.id === t.clubId)?.name).join(', ')}`);
  console.log(`   campeón: ${campeon?.name ?? 'NINGUNO'}  ${salioDelTop8 ? '(del top 8, correcto)' : '<-- NO salió del top 8'}`);
  if (!campeon) { console.log('   FALLA: el cuadro no corona a nadie'); fallas++; }
  else if (!salioDelTop8) { console.log('   FALLA: el campeón no estaba entre los 8 primeros'); fallas++; }
  // Nadie fuera del top 8 puede tener cruce
  const intrusos = clubes.filter(c => !ocho.some(t => t.clubId === c.id) && crucePlayoffDeLiga(bracket, c.id));
  if (intrusos.length) { console.log(`   FALLA: ${intrusos.length} clubes fuera del top 8 con cruce`); fallas++; }
}
console.log(`\n${fallas === 0 ? 'El cuadro lo juegan los que terminaron arriba.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
