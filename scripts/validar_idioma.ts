// IDIOMA Y ADAPTACION: que no pase siempre, que se apague sola, y que no castigue al que si habla.
//
//   npm run validar:idioma
//
// La octava de las ocho mecanicas de vida (docs/OCHO_MECANICAS_DE_VIDA.md). Pedido: "ir a otro pais
// con un idioma que no hablas baja el rendimiento los primeros meses", con la condicion que el
// usuario puso sobre las tres ultimas: "que no pasen si o si sino que haya un porcentaje pequeño de
// probabilidad que pase".
//
// O sea que hay DOS cosas que comprobar y son opuestas entre si:
//
//   . que cuando toca, se sienta -- si el ajuste fuera de 1 punto, la mecanica no existiria;
//   . que NO toque siempre -- si tocara siempre, dejaria de ser tuya y seria una regla del juego.
//
// Y una tercera que es la que mas facil se rompe: que un colombiano que ficha en España no pague
// nada. Un mapa de idiomas mal armado convierte esta mecanica en un impuesto al que se va afuera.

import {
  AJUSTE_MAXIMO_DE_ADAPTACION, CHANCE_DE_QUE_CUESTE, FECHAS_DE_ADAPTACION, IDIOMA_POR_PAIS,
  ajustePorAdaptacion, cuestaAdaptarse, idiomaDe, mismoIdioma,
} from '../src/elIdioma';
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

const dado = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

console.log('=== A) El que ya habla el idioma no paga nada, nunca ===');
const MISMA_LENGUA: [string, string][] = [
  ['Colombiana', 'Española'], ['Argentina', 'Mexicana'], ['Española', 'Chilena'],
  ['Brasileña', 'Portuguesa'], ['Inglesa', 'Estadounidense'], ['Alemana', 'Austríaca'],
  ['Colombiana', 'Colombiana'],
];
for (const [de, a] of MISMA_LENGUA) {
  ok(`de ${de} a ${a} se habla lo mismo`, mismoIdioma(de, a), `${idiomaDe(de)} / ${idiomaDe(a)}`);
  ok(`   y por eso no cuesta ni con el peor dado`, !cuestaAdaptarse(0, de, a));
}

console.log('');
console.log('=== B) Cambiar de lengua puede costar, y no siempre ===');
const OTRA_LENGUA: [string, string][] = [
  ['Colombiana', 'Inglesa'], ['Argentina', 'Italiana'], ['Brasileña', 'Alemana'],
  ['Inglesa', 'Turca'], ['Española', 'Holandesa'],
];
for (const [de, a] of OTRA_LENGUA) {
  ok(`de ${de} a ${a} NO se habla lo mismo`, !mismoIdioma(de, a), `${idiomaDe(de)} -> ${idiomaDe(a)}`);
}
let costo = 0;
for (let i = 0; i < 4000; i++) if (cuestaAdaptarse(dado(i), 'Colombiana', 'Inglesa')) costo++;
const tasa = costo / 4000;
console.log('');
console.log(`   De 4000 pases de Colombia a Inglaterra, costo adaptarse en ${(tasa * 100).toFixed(1)}%.`);
ok('cerca de la chance declarada', Math.abs(tasa - CHANCE_DE_QUE_CUESTE) < 0.04,
  `${(tasa * 100).toFixed(1)}% contra ${(CHANCE_DE_QUE_CUESTE * 100).toFixed(0)}% declarado`);
ok('NO pasa siempre, que es la condicion que puso el usuario', tasa < 0.5, `${(tasa * 100).toFixed(1)}%`);
ok('pero pasa lo suficiente como para que exista', tasa > 0.15, `${(tasa * 100).toFixed(1)}%`);

console.log('');
console.log('=== C) Se apaga sola, fecha a fecha ===');
console.log('');
console.log('   fecha   fechas que faltan   ajuste en todos los atributos');
const hasta = 100 + FECHAS_DE_ADAPTACION;
const ajustes: number[] = [];
for (let paso = 100; paso <= hasta + 2; paso += 2) {
  const a = ajustePorAdaptacion(paso, hasta);
  ajustes.push(a);
  console.log(`   ${String(paso).padStart(5)}   ${String(Math.max(0, hasta - paso)).padStart(17)}   ${String(a).padStart(29)}`);
}
ok('arranca en el maximo declarado', ajustes[0] === -AJUSTE_MAXIMO_DE_ADAPTACION,
  `${ajustes[0]} contra ${-AJUSTE_MAXIMO_DE_ADAPTACION}`);
ok('nunca aprieta mas con el tiempo: solo afloja',
  ajustes.every((a, i) => i === 0 || a >= ajustes[i - 1]), ajustes.join(' '));
ok('y al cumplirse el plazo desaparece', ajustePorAdaptacion(hasta, hasta) === 0);
ok('y despues del plazo tampoco reaparece', ajustePorAdaptacion(hasta + 5, hasta) === 0);

// EL TAMAÑO IMPORTA: si el ajuste fuera de 1 o 2 puntos, la mecanica seria decorativa. Se compara
// contra los otros tres eslabones de la misma cadena en MatchSimulator.
const FATIGA = 6;
const LESIONADO = 9;
ok('pesa mas que la fatiga de temporada: mudarse de idioma no es una molestia',
  AJUSTE_MAXIMO_DE_ADAPTACION > FATIGA, `${AJUSTE_MAXIMO_DE_ADAPTACION} contra ${FATIGA}`);
ok('y menos que jugar lesionado: sigue siendo algo que se pasa',
  AJUSTE_MAXIMO_DE_ADAPTACION < LESIONADO, `${AJUSTE_MAXIMO_DE_ADAPTACION} contra ${LESIONADO}`);

console.log('');
console.log('=== D) El mapa de idiomas cubre las ligas que se juegan ===');
//
// Una liga sin entrada en la tabla se trata como idioma desconocido y NO dispara nada. Eso es lo
// prudente, pero si faltaran muchas la mecanica no existiria para medio mundo sin que nadie lo note.
const ligas = [...new Set(CLUBS.map(c => (c as { league: string }).league))].sort();
const sinIdioma = ligas.filter(l => !IDIOMA_POR_PAIS[l]);
console.log(`   ${ligas.length} ligas en la base · ${sinIdioma.length} sin idioma declarado`);
if (sinIdioma.length) console.log(`   sin idioma: ${sinIdioma.join(', ')}`);
ok('la gran mayoria de las ligas tiene idioma declarado',
  sinIdioma.length <= Math.ceil(ligas.length * 0.15),
  `${sinIdioma.length} de ${ligas.length}`);
ok('y las que faltan no rompen: se tratan como "se habla lo mismo"',
  sinIdioma.every(l => mismoIdioma('Colombiana', l) && !cuestaAdaptarse(0, 'Colombiana', l)));

console.log('');
console.log(`${fallas === 0 ? 'El idioma pesa cuando toca, no toca siempre, y se pasa con el tiempo.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
