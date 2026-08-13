// Casos de la tabla de lideres por competicion (ver src/lideresPorCompeticion.ts).
import { anotarEnLideres, claveDeCompeticion, lideresDe, repartirGoles } from '../src/lideresPorCompeticion';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

// 1. El jugador entra en la tabla y puede ser goleador.
let t = anotarEnLideres(undefined, claveDeCompeticion('Copa Libertadores', 1), [
  { nombre: 'Cani', clubName: 'Junior', goles: 3, esVos: true },
  { nombre: 'Flaco Lopez', clubName: 'Palmeiras', goles: 1 },
]);
let r = lideresDe(t, claveDeCompeticion('Copa Libertadores', 1));
ok('el jugador puede ser goleador del torneo', r.goleadores[0]?.nombre === 'Cani' && r.goleadores[0]?.esVos === true);

// 2. Se ACUMULA entre partidos.
t = anotarEnLideres(t, claveDeCompeticion('Copa Libertadores', 1), [{ nombre: 'Cani', clubName: 'Junior', goles: 2, esVos: true }]);
r = lideresDe(t, claveDeCompeticion('Copa Libertadores', 1));
ok('los goles se acumulan partido a partido', r.goleadores[0]?.goles === 5, `(${r.goleadores[0]?.goles})`);

// 3. Cada TORNEO lleva la suya.
t = anotarEnLideres(t, claveDeCompeticion('Liga BetPlay Dimayor', 1), [{ nombre: 'Otro', clubName: 'X', goles: 9 }]);
ok('la liga no contamina la copa',
   lideresDe(t, claveDeCompeticion('Copa Libertadores', 1)).goleadores[0]?.goles === 5 &&
   lideresDe(t, claveDeCompeticion('Liga BetPlay Dimayor', 1)).goleadores[0]?.goles === 9);

// 4. Cada TEMPORADA arranca en blanco. Pedido explicito del usuario.
ok('la temporada 2 arranca vacia', lideresDe(t, claveDeCompeticion('Copa Libertadores', 2)).goleadores.length === 0);

// 5. La ronda no parte la tabla en pedazos.
ok('"Copa Libertadores · Octavos" es la MISMA tabla que "Copa Libertadores"',
   claveDeCompeticion('Copa Libertadores · Octavos de Final', 1) === claveDeCompeticion('Copa Libertadores', 1));

// 6. El reparto de goles simulados respeta el total y prefiere a los ofensivos.
const reparto = repartirGoles(['Pepe (GK)', 'Juan (CB)', 'Luis (ST)', 'Ana (CAM)'], 'X', 5, () => 0.0);
ok('reparte exactamente los goles del marcador', reparto.reduce((n, x) => n + x.goles, 0) === 5);
ok('no le da goles al arquero', !reparto.some(x => x.nombre === 'Pepe'));

console.log(fallas === 0 ? '\nLos 7 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
