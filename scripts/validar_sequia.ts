// LA SEQUIA DE GOL: que castigue lo que tiene que castigar, y que se pueda salir.
//
//   npm run validar:sequia
//
// Dos mitades. La primera son las REGLAS: que el umbral dependa del puesto, que el castigo crezca y
// tenga techo, que el rebote pague. Esas se comprueban con numeros a mano.
//
// La segunda es la que de verdad decide si la mecanica sirve: CUANTO CUESTA EN UNA TEMPORADA. Una
// mecanica de presion que en la practica no se dispara nunca es decoracion; una que se dispara
// siempre es un impuesto. Aca se juegan temporadas enteras con distintos ritmos de gol y se mide
// cuantas sequias hay y cuanta hinchada cuestan.
//
// El dado entra por parametro, como en el resto del juego: sin eso, medir "cada cuanto pasa" es
// imposible. Ver docs/OCHO_MECANICAS_DE_VIDA.md.

import {
  CASTIGO_MAXIMO, REBOTE_MAXIMO, UMBRAL_DE_SEQUIA,
  castigoDeLaSequia, contarElPartido, haySequia, hondoDeLaSequia, laPrensaHablaDeLaSequia,
} from '../src/sequia';
import type { Position } from '../src/types';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

console.log('=== A) El umbral depende del puesto ===');
ok('un delantero con 4 partidos sin gol no esta en sequia', !haySequia(4, 'Delantero'));
ok('con 5 si', haySequia(5, 'Delantero'));
ok('un mediocampista aguanta mas que un delantero',
  (UMBRAL_DE_SEQUIA.Mediocampista ?? 0) > (UMBRAL_DE_SEQUIA.Delantero ?? 0),
  `${UMBRAL_DE_SEQUIA.Delantero} contra ${UMBRAL_DE_SEQUIA.Mediocampista}`);
for (const puesto of ['Defensor', 'Arquero'] as Position[]) {
  ok(`un ${puesto.toLowerCase()} nunca entra en sequia, ni con 40 partidos`, !haySequia(40, puesto));
  ok(`y no paga nada`, castigoDeLaSequia(40, puesto) === 0);
  ok(`ni cobra rebote (no se sale de algo que no existe)`, hondoDeLaSequia(40, puesto) === 'ninguna');
}

console.log('');
console.log('=== B) El castigo crece, tiene techo, y antes del umbral no existe ===');
ok('antes del umbral no cuesta nada', castigoDeLaSequia(4, 'Delantero') === 0);
ok('en el umbral empieza a costar', castigoDeLaSequia(5, 'Delantero') > 0, `${castigoDeLaSequia(5, 'Delantero')}`);
ok('y crece con la sequia', castigoDeLaSequia(14, 'Delantero') > castigoDeLaSequia(6, 'Delantero'),
  `6 -> ${castigoDeLaSequia(6, 'Delantero')} · 14 -> ${castigoDeLaSequia(14, 'Delantero')}`);
ok('con techo, para que una sequia larga no sea una condena',
  castigoDeLaSequia(80, 'Delantero') === CASTIGO_MAXIMO, `${castigoDeLaSequia(80, 'Delantero')}`);

console.log('');
console.log('=== C) Cortarla paga, y paga mas cuanto mas duro ===');
const { reboteAlCortarla } = await import('../src/sequia');
ok('sin sequia no hay rebote', reboteAlCortarla(4, 'Delantero') === 0);
ok('cortarla en el umbral ya paga', reboteAlCortarla(5, 'Delantero') > 0, `${reboteAlCortarla(5, 'Delantero')}`);
ok('y paga mas si venia de mas lejos',
  reboteAlCortarla(20, 'Delantero') > reboteAlCortarla(6, 'Delantero'),
  `6 -> ${reboteAlCortarla(6, 'Delantero')} · 20 -> ${reboteAlCortarla(20, 'Delantero')}`);
ok('con techo', reboteAlCortarla(200, 'Delantero') === REBOTE_MAXIMO);

// LA REGLA QUE HACE QUE LA MECANICA TENGA SALIDA: en una sequia corta, cortarla devuelve MAS de lo
// que costo. Sin esto, cada sequia seria una perdida neta y la hinchada solo podria bajar.
for (const largo of [5, 6, 7, 8]) {
  let costo = 0;
  for (let n = 1; n <= largo; n++) costo += castigoDeLaSequia(n, 'Delantero');
  ok(`sequia de ${largo}: cortarla devuelve mas de lo que costo`,
    reboteAlCortarla(largo, 'Delantero') >= costo, `costo ${costo} · rebote ${reboteAlCortarla(largo, 'Delantero')}`);
}

console.log('');
console.log('=== D) La prensa no habla todas las fechas ===');
let habla = 0;
for (let n = 5; n <= 25; n++) if (laPrensaHablaDeLaSequia(n, 'Delantero')) habla++;
ok('de 21 partidos en sequia, la prensa comenta en menos de la mitad', habla < 11, `${habla} de 21`);
ok('pero comenta el dia que se cumple el umbral, que es la noticia',
  laPrensaHablaDeLaSequia(5, 'Delantero'));
ok('y nunca antes', !laPrensaHablaDeLaSequia(4, 'Delantero'));

console.log('');
console.log('=== E) CUANTO CUESTA EN UNA TEMPORADA (38 partidos) ===');
console.log('   Un dado propio y repetible: la misma tirada da siempre el mismo resultado.');
console.log('');
console.log('   goles/partido   sequias   fechas en sequia   hinchada neta');

// Dado determinista: mismo resultado en cada corrida, que es lo que hace comparable la medicion.
const dado = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const netoPorRitmo = new Map<number, number>();
for (const ritmo of [0.15, 0.25, 0.40, 0.60, 0.90]) {
  let contador = 0, sequias = 0, fechasEnSequia = 0, hinchada = 0;
  let semilla = 0;
  for (let p = 0; p < 38 * 10; p++) {
    const marco = dado(semilla++) < ritmo;
    if (marco) {
      hinchada += reboteAlCortarla(contador, 'Delantero');
      if (haySequia(contador, 'Delantero')) sequias++;
    } else {
      hinchada -= castigoDeLaSequia(contador + 1, 'Delantero');
      if (haySequia(contador + 1, 'Delantero')) fechasEnSequia++;
    }
    contador = contarElPartido(contador, marco ? 1 : 0);
  }
  netoPorRitmo.set(ritmo, hinchada / 10);
  console.log(`   ${ritmo.toFixed(2).padStart(11)}   ${(sequias / 10).toFixed(1).padStart(7)}   ${(fechasEnSequia / 10).toFixed(1).padStart(16)}   ${(hinchada / 10).toFixed(1).padStart(13)}`);
}

console.log('');
// LOS TRES ASERTOS QUE HACEN QUE ESTA TABLA SIRVA. Sin ellos era un informe bonito: las dos
// calibraciones anteriores imprimian numeros peores y el validador pasaba igual en verde.
ok('al que no marca nunca, la temporada le cuesta de verdad',
  (netoPorRitmo.get(0.15) ?? 0) <= -10, `${(netoPorRitmo.get(0.15) ?? 0).toFixed(1)} de hinchada`);
ok('al que marca poco NO le sobra hinchada al cerrar (la presion no puede pagar)',
  (netoPorRitmo.get(0.25) ?? 0) <= 0, `${(netoPorRitmo.get(0.25) ?? 0).toFixed(1)}`);
ok('el buen delantero termina como empezo: la mecanica no lo toca',
  Math.abs(netoPorRitmo.get(0.90) ?? 9) < 0.5, `${(netoPorRitmo.get(0.90) ?? 0).toFixed(1)}`);
ok('y peor delantero, peor cuenta: la curva no se da vuelta en el medio',
  (netoPorRitmo.get(0.15) ?? 0) < (netoPorRitmo.get(0.25) ?? 0)
  && (netoPorRitmo.get(0.25) ?? 0) < (netoPorRitmo.get(0.40) ?? 0));
console.log('');
console.log(`${fallas === 0 ? 'La sequia castiga al que no marca, y se sale marcando.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
