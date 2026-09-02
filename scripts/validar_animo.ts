// Casos del bajón anímico (ver src/animo.ts).
//
// Lo que importa probar acá es que el bajón se ENTRE por acumulación y no por un mal partido, que
// se NOTE en la cancha, y que las tres salidas sean de verdad distintas -- si una fuera siempre la
// mejor, no habría decisión.
import { readFileSync } from 'fs';
import {
  estaEnBajon, factorDeAnimo, faltaParaSalida, motivoDelBajon, nivelDeAnimo, resultadoDeSalida,
  salidaPorId, SALIDAS, CASTIGO_APRETAR, FACTOR_BAJON, FACTOR_CABEZA_FLOJA, FACTOR_CABEZA_FUERTE,
  PENALIDAD_ENERGIA_BAJON, UMBRAL_BAJON,
} from '../src/animo';

let fallas = 0;
let corridos = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  corridos++;
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

// =============================================================================================
// 1. LOS ESCALONES
// =============================================================================================

ok('en 29 estás en bajón', nivelDeAnimo(29) === 'bajon');
ok('en 30 ya no', nivelDeAnimo(30) === 'floja');
ok('el escalón de cabeza floja sigue existiendo entre 30 y 34', nivelDeAnimo(34) === 'floja');
ok('en 35 la cabeza es normal', nivelDeAnimo(35) === 'normal');
ok('por encima de 85 estás fuerte', nivelDeAnimo(86) === 'fuerte');

ok('el bajón pega más que la cabeza floja', FACTOR_BAJON < FACTOR_CABEZA_FLOJA);
ok('pero no llega al piso del multiplicador de presión (0.82): se nota, no es injugable',
   FACTOR_BAJON > 0.82, `(${FACTOR_BAJON})`);
ok('estar fuerte sigue dando ventaja', FACTOR_CABEZA_FUERTE > 1);
ok('factorDeAnimo devuelve el escalón que corresponde',
   factorDeAnimo(20) === FACTOR_BAJON && factorDeAnimo(32) === FACTOR_CABEZA_FLOJA
   && factorDeAnimo(60) === 1 && factorDeAnimo(90) === FACTOR_CABEZA_FUERTE);

// =============================================================================================
// 2. SE ENTRA POR ACUMULACIÓN, NO POR UN MAL PARTIDO
// =============================================================================================
//
// mentalHealth ES el acumulador: un mal partido lo mueve 3 o 4 puntos, así que desde un ánimo
// sano hacen falta varias malas seguidas para tocar fondo. Se simula esa cadena.

let animo = 70;
const MALA = 4; // lo que descuenta aproximadamente una derrota con nota baja
let partidos = 0;
while (animo >= UMBRAL_BAJON && partidos < 100) { animo -= MALA; partidos++; }
ok('un solo mal partido NO te mete en bajón', !estaEnBajon({ mentalHealth: 70 - MALA }));
ok('ni dos, ni tres', !estaEnBajon({ mentalHealth: 70 - MALA * 3 }));
ok('hacen falta una decena de golpes desde un ánimo sano', partidos >= 10, `(${partidos} golpes)`);

// =============================================================================================
// 3. EL MOTIVO SE EXPLICA CON LO QUE DE VERDAD PASÓ
// =============================================================================================

const base = { fans: 60, prestige: 60 };
ok('una lesión larga tapa a todo lo demás',
   motivoDelBajon({ ...base, activeInjury: { weeksRemaining: 4 } as any, forma: 'en_baja' }).includes('lesión'));
ok('sin lesión, manda la racha de partidos',
   motivoDelBajon({ ...base, forma: 'en_baja' }).includes('racha'));
ok('después, la hinchada',
   motivoDelBajon({ fans: 10, prestige: 60, forma: 'normal' }).includes('hinchada'));
ok('y si no hay nada claro, no se inventa un motivo',
   motivoDelBajon({ ...base, forma: 'normal' }).includes('juntando'));
ok('una lesión de UNA semana no cuenta como lesión larga',
   !motivoDelBajon({ ...base, activeInjury: { weeksRemaining: 1 } as any, forma: 'normal' }).includes('lesión'));

// =============================================================================================
// 4. LAS TRES SALIDAS SON DISTINTAS DE VERDAD
// =============================================================================================

ok('hay exactamente tres salidas', SALIDAS.length === 3);
ok('cada una cobra en una moneda distinta',
   salidaPorId('psicologo').capital > 0 && salidaPorId('psicologo').prestigio < 0
   && salidaPorId('casa').energia > 0
   && salidaPorId('apretar').capital === 0 && salidaPorId('apretar').energia === 0);
ok('la gratis es la que menos levanta: si no, sería el atajo obvio',
   salidaPorId('apretar').animo < salidaPorId('psicologo').animo
   && salidaPorId('apretar').animo < salidaPorId('casa').animo);
ok('la que más levanta es la que te deja corto para el próximo partido',
   salidaPorId('casa').animo > salidaPorId('psicologo').animo && salidaPorId('casa').energia > 0);

// Cualquiera de las dos pagas te saca del bajón de una: si hiciera falta repetirla tres semanas,
// el estado dejaría de ser algo que se resuelve y volvería a ser una barra que se mira.
for (const id of ['psicologo', 'casa'] as const) {
  const s = salidaPorId(id);
  ok(`"${s.titulo}" te saca del bajón en una sola vez`,
     !estaEnBajon({ mentalHealth: Math.min(100, (UMBRAL_BAJON - 1) + s.animo) }),
     `(29 -> ${(UMBRAL_BAJON - 1) + s.animo})`);
}

// =============================================================================================
// 5. APRETAR LOS DIENTES ES UNA APUESTA
// =============================================================================================

const bien = resultadoDeSalida(salidaPorId('apretar'), () => 0);
const mal = resultadoDeSalida(salidaPorId('apretar'), () => 0.99);
ok('si sale bien sube el ánimo y el vestuario lo nota',
   bien.salioBien && bien.animo > 0 && bien.prestigio > 0);
ok('si sale mal te hundes más', !mal.salioBien && mal.animo === -CASTIGO_APRETAR);
ok('y no cuesta nada en ninguna de las dos ramas',
   bien.capital === 0 && bien.energia === 0 && mal.capital === 0 && mal.energia === 0);
ok('sale mal más veces de las que sale bien: es apuesta, no atajo',
   [...Array(1000)].filter((_, i) => resultadoDeSalida(salidaPorId('apretar'), () => i / 1000).salioBien).length < 500);

// =============================================================================================
// 6. NO SE PUEDE PAGAR LO QUE NO SE TIENE
// =============================================================================================

ok('sin plata, el psicólogo no se puede',
   !!faltaParaSalida(salidaPorId('psicologo'), { capital: 100, energy: 100 }));
ok('sin energía, el viaje a casa tampoco',
   !!faltaParaSalida(salidaPorId('casa'), { capital: 99999, energy: 5 }));
ok('apretar los dientes se puede siempre, que es el punto de que exista',
   faltaParaSalida(salidaPorId('apretar'), { capital: 0, energy: 0 }) === null);
ok('con lo justo, se puede',
   faltaParaSalida(salidaPorId('casa'), { capital: salidaPorId('casa').capital, energy: salidaPorId('casa').energia }) === null);

// =============================================================================================
// 7. SE NOTA EN LA CANCHA
// =============================================================================================

ok('el bajón cuesta energía al arrancar el partido', PENALIDAD_ENERGIA_BAJON > 0);
ok('pero menos que jugar lesionado (14): una rotura pesa más que dormir mal',
   PENALIDAD_ENERGIA_BAJON < 14, `(${PENALIDAD_ENERGIA_BAJON})`);

// =============================================================================================
// 8. EL RITUAL NO SE ROMPE SOLO
// =============================================================================================
//
// Habia un evento que "rompia" el ritual por azar cada partido: un aviso y -3 de salud mental. El
// jugador se quejo dos veces -- primero porque el texto decia algo imposible (que el club le
// cambiaba el dorsal a mitad de temporada) y despues, ya corregido, porque el evento entero le
// parecia ilogico: "no quiero que pase nunca".
//
// Se saco completo, aviso Y castigo. Esto lo deja escrito, porque un evento aleatorio es facil de
// reponer sin querer: alcanza con que alguien vea el campo `superstition` y piense que le falta un
// efecto.
const app = readFileSync('src/App.tsx', 'utf8');
const setup = readFileSync('src/components/SetupScreen.tsx', 'utf8');

ok('el ritual no se rompe por azar en ningun partido',
   !/SUPERSTITION_BREAK/.test(app) && !/superstitionBroke/.test(app));
ok('y no queda el castigo suelto sin el aviso, que seria peor',
   !/superstitionBreakPenalty/.test(app));
ok('los rituales siguen existiendo como identidad del personaje',
   [...setup.matchAll(/id: '[a-z_]+', label: '/g)].length === 6);
ok('pero ninguno declara un efecto mecanico', !/breakMessage/.test(setup));

console.log(fallas === 0 ? [String.fromCharCode(10), `Los ${corridos} casos pasan.`].join(String.fromCharCode(10)).trim() : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
