// Casos de la tabla de lideres por competicion (ver src/lideresPorCompeticion.ts).
import { anotarEnLideres, arqueroDe, claveDeCompeticion, lideresDe, repartirGoles, repartirTarjetas } from '../src/lideresPorCompeticion';

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


// Tarjetas y porteria menos vencida.
let d = anotarEnLideres(undefined, 'X|1', [
  { nombre: 'Duro', clubName: 'A', amarillas: 7 },
  { nombre: 'Cani', clubName: 'Junior', amarillas: 2, rojas: 1, esVos: true },
]);
let rd = lideresDe(d, 'X|1');
ok('mas amarillas sale de la tabla del torneo', rd.amonestados[0]?.nombre === 'Duro' && rd.amonestados[0]?.amarillas === 7);
ok('el jugador puede liderar en rojas', rd.expulsados[0]?.nombre === 'Cani' && rd.expulsados[0]?.esVos === true);

// Porteria menos vencida: gana el de MENOR promedio y hace falta un minimo de partidos.
d = anotarEnLideres(d, 'X|1', [
  { nombre: 'Mele', clubName: 'A', partidosDeArquero: 20, golesRecibidos: 10 },
  { nombre: 'Suplente', clubName: 'B', partidosDeArquero: 2, golesRecibidos: 0 },
  { nombre: 'Rey', clubName: 'C', partidosDeArquero: 10, golesRecibidos: 3 },
]);
rd = lideresDe(d, 'X|1');
ok('porteria menos vencida por PROMEDIO, no por total', rd.arqueros[0]?.nombre === 'Rey', `(${rd.arqueros[0]?.nombre})`);
ok('el arquero con 2 partidos no llega al minimo', !rd.arqueros.some(a => a.nombre === 'Suplente'));

const tj = repartirTarjetas(['Pepe (GK)', 'Juan (CB)', 'Luis (ST)'], 'X', () => 0.5);
ok('reparte amarillas sin pasarse de tres', tj.filter(t => t.amarillas).length <= 3 && tj.length > 0);
ok('las amarillas no caen en el arquero', !tj.some(t => t.nombre === 'Pepe'));
ok('arqueroDe encuentra al arquero', arqueroDe(['Luis (ST)', 'Pepe (GK)']) === 'Pepe');

console.log(fallas === 0 ? '\nLos 14 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
