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
  prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, crucePlayoffDeLiga, sigueEnPlayoffDeLiga } from '../src/leagueEngine';
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
// =============================================================================================
// LA TANDA DE PENALES DEL CUADRANGULAR
// =============================================================================================
//
// Una llave empatada en el global se define por penales, y esos penales los tiene que PATEAR el
// jugador. Hasta ahora no: la busqueda de tanda en App.tsx miraba los cuadros internos del motor,
// que nunca se llenaban, asi que el cuadrangular era la unica eliminatoria del juego que se definia
// a espaldas del jugador -- las copas continentales si la ofrecian desde siempre.

console.log("");
console.log("=== La tanda del cuadrangular ===");

const okTanda = (n: string, c: boolean, d = "") => {
  if (!c) { fallas++; console.log(`   FALLA ${n}${d ? "  " + d : ""}`); }
  else console.log(`   OK   ${n}${d ? "  " + d : ""}`);
};

const clubesTanda = clubesDeLiga("Colombiana-1");
const yo = clubesTanda[0], rivalT = clubesTanda[1];
const tablaTanda = sortTable(buildInitialTable([yo, rivalT]));

// Un cuadro de dos: ida 1-0 y vuelta 0-1 dejan el global 1-1.
const arranque = prepararPlayoffDeLiga(undefined, tablaTanda, 2);
const soyA = arranque.tiesByRound[0][0].clubAId === yo.id;
const trasIda = resolverPasoPlayoffDeLiga(arranque, clubesTanda, {
  clubId: yo.id, isHome: soyA, goals: 1, opponentGoals: 0,
});
const trasVuelta = resolverPasoPlayoffDeLiga(trasIda, clubesTanda, {
  clubId: yo.id, isHome: !soyA, goals: 0, opponentGoals: 1,
});
const llave = trasVuelta.tiesByRound[trasVuelta.tiesByRound.length - 1][0];
const globalA = (llave.firstLegGoalsA ?? 0) + (llave.secondLegGoalsA ?? 0);
const globalB = (llave.firstLegGoalsB ?? 0) + (llave.secondLegGoalsB ?? 0);

okTanda("el global queda empatado", globalA === globalB, `${globalA}-${globalB}`);
okTanda("la llave anota una tanda de penales", !!llave.penaltyShootout);
okTanda("y esa tanda es la que App.tsx detecta para abrir la pantalla",
  !!llave.penaltyShootout && (llave.clubAId === yo.id || llave.clubBId === yo.id));

// Segunda pasada: el resultado REAL del jugador manda sobre el dado del motor.
const miTanda = { winnerId: yo.id, shots: [], scoreA: 5, scoreB: 4 } as never;
const conMiTanda = resolverPasoPlayoffDeLiga(trasIda, clubesTanda, {
  clubId: yo.id, isHome: !soyA, goals: 0, opponentGoals: 1, shootoutOverride: miTanda,
});
const llaveMia = conMiTanda.tiesByRound[conMiTanda.tiesByRound.length - 1][0];
okTanda("con la tanda pateada, pasa quien gano en la pantalla", llaveMia.winnerId === yo.id);

const perdida = { winnerId: rivalT.id, shots: [], scoreA: 3, scoreB: 4 } as never;
const conDerrota = resolverPasoPlayoffDeLiga(trasIda, clubesTanda, {
  clubId: yo.id, isHome: !soyA, goals: 0, opponentGoals: 1, shootoutOverride: perdida,
});
const llavePerdida = conDerrota.tiesByRound[conDerrota.tiesByRound.length - 1][0];
okTanda("y si la perdes, pasa el rival", llavePerdida.winnerId === rivalT.id);

// =================================================================================================
// SI TE ELIMINAN, TE TIENEN QUE AVISAR -- juegues o no
// =================================================================================================
//
// El aviso de "eliminado" vivia dentro de handleFinishMatch, o sea que solo existia si el partido lo
// jugabas vos. Sancionado o sin convocar, el cuadro avanzaba igual y te dejaba afuera en silencio:
// lo unico que veias era "los cuadrangulares se juegan sin tu club". Reportado tal cual.
//
// El aviso lo dispara la diferencia entre el cuadro de antes y el de despues, y quien contesta si
// seguis adentro es sigueEnPlayoffDeLiga. Eso es lo que se prueba aca: la pregunta tiene que
// distinguir los CUATRO estados, porque crucePlayoffDeLiga devuelve null para tres de ellos y con
// eso no se puede saber a quien avisarle.

console.log("");
console.log("=== El aviso de eliminacion ===");

const eliminado = resolverPasoPlayoffDeLiga(trasIda, clubesTanda, {
  clubId: yo.id, isHome: !soyA, goals: 0, opponentGoals: 4,
});

okTanda("mientras la llave no se juega, seguis adentro",
  sigueEnPlayoffDeLiga(arranque, yo.id));
okTanda("perdida la llave, ya no",
  !sigueEnPlayoffDeLiga(eliminado, yo.id));
okTanda("y el que la gano si sigue",
  sigueEnPlayoffDeLiga(eliminado, rivalT.id));
okTanda("el que nunca clasifico no cuenta como eliminado",
  !sigueEnPlayoffDeLiga(arranque, clubesTanda[5].id));
okTanda("el campeon sigue 'adentro': lo suyo lo cuenta la pantalla de campeon",
  !!conMiTanda.championId && sigueEnPlayoffDeLiga(conMiTanda, yo.id),
  `campeon=${conMiTanda.championId ?? '-'}`);

// LA TRANSICION, que es lo que mira el aviso: estabas adentro y dejaste de estarlo, sin jugar.
okTanda("la transicion 'estaba adentro -> ya no' se detecta sin haber jugado",
  sigueEnPlayoffDeLiga(trasIda, yo.id) && !sigueEnPlayoffDeLiga(eliminado, yo.id));
okTanda("al que nunca estuvo no se le anuncia ninguna eliminacion",
  !sigueEnPlayoffDeLiga(trasIda, clubesTanda[5].id) && !sigueEnPlayoffDeLiga(eliminado, clubesTanda[5].id));

console.log(`\n${fallas === 0 ? 'El cuadro lo juegan los que terminaron arriba, y al eliminado se le avisa.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
