// PERDER EL PUESTO: que jugar mal tenga consecuencia, y que se pueda volver.
//
//   npm run validar:puesto
//
// La segunda de las ocho mecanicas de vida (docs/OCHO_MECANICAS_DE_VIDA.md). Pedido: "tres partidos
// flojos seguidos y el DT te sienta; volver cuesta. Hoy lineupStatus existe pero casi no se mueve".
//
// LA MEDICION QUE LO DESTAPO. La forma YA entraba en la decision del once -- estaba conectada desde
// antes --, pero pesaba 12 puntos contra una vara de club de 58 a 80 y un prestigio que se satura
// en 100 a la cuarta temporada. O sea que el umbral mas alto posible era 92 y el crack era titular
// para siempre. El banco de carrera larga lo midio: 38 titularidades de 38 durante OCHO temporadas
// seguidas (docs/MEDICION_DE_PARTIDA.md).
//
// Lo que se comprueba aca es lo unico que importa: CUANTOS PARTIDOS FLOJOS SEGUIDOS hacen falta
// para perder el puesto, en cada club y con cada nivel de prestigio. Si en alguna combinacion la
// respuesta es "nunca", la mecanica no existe para ese jugador.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { varaDeTitularidad } from '../src/fuerzaDelClub';
import {
  ajusteDeFormaEnElOnce, evaluarForma, PARTIDOS_PARA_RACHA, PESO_MAXIMO_DE_LA_MALA_FORMA,
  VENTANA_DE_FORMA, NOTA_MALA, NOTA_BUENA, type NotaDePartido,
} from '../src/forma';
import type { Club } from '../src/types';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

/** Una racha de `n` partidos flojos seguidos, terminada hoy. */
const rachaFloja = (n: number, paso: number): NotaDePartido[] =>
  Array.from({ length: n }, (_, i) => ({ rating: NOTA_MALA - 0.5, paso: paso - (n - 1 - i) }));

/**
 * Cuantos partidos flojos seguidos hacen falta para que este jugador pierda el puesto en este club.
 * `null` = nunca, ni agotando la ventana de forma.
 */
function flojosParaPerderElPuesto(club: Club, prestigio: number): number | null {
  const vara = varaDeTitularidad(club);
  for (let n = PARTIDOS_PARA_RACHA; n <= VENTANA_DE_FORMA; n++) {
    const forma = evaluarForma(rachaFloja(n, 100), 100);
    if (prestigio < vara + ajusteDeFormaEnElOnce(forma)) return n;
  }
  return null;
}

const CLUBES = ['Deportivo Pasto', 'Junior de Barranquilla', 'Millonarios FC', 'FC Barcelona'];
const clubes = CLUBES.map(n => ({ nombre: n, club: CLUBS.find(c => c.name === n) as Club }))
  .filter(x => !!x.club);

console.log('=== A) Cuantos partidos flojos seguidos cuestan el puesto ===');
console.log('');
console.log('   club                      vara    pres 60   pres 80   pres 100');
for (const { nombre, club } of clubes) {
  const fila = [60, 80, 100].map(p => {
    const n = flojosParaPerderElPuesto(club, p);
    return (n === null ? 'nunca' : String(n)).padStart(9);
  }).join(' ');
  console.log(`   ${nombre.padEnd(24)}${String(varaDeTitularidad(club)).padStart(4)}  ${fila}`);
}
console.log('');

// EL ASERTO QUE HACE UTIL A LA TABLA. Con el peso viejo (12) TODAS las celdas de prestigio 100
// decian "nunca", y ese era exactamente el bug: la mecanica no existia para el jugador hecho.
for (const { nombre, club } of clubes) {
  const n = flojosParaPerderElPuesto(club, 100);
  ok(`en ${nombre} hasta el crack de prestigio 100 puede perder el puesto`,
    n !== null, n === null ? 'NUNCA lo pierde' : `${n} partidos flojos`);
}

// Y LA CORREA ES MAS LARGA DONDE SOS IMPRESCINDIBLE. En un club grande hay con quien reemplazarte;
// en uno chico sos lo mejor que tienen y el DT te aguanta mas. Eso es futbol, no una excepcion.
const enGrande = flojosParaPerderElPuesto(clubes[clubes.length - 1].club, 100);
const enChico = flojosParaPerderElPuesto(clubes[0].club, 100);
ok('la correa es mas corta en el club grande que en el chico',
  enGrande !== null && enChico !== null && enGrande < enChico, `${enGrande} contra ${enChico}`);

console.log('');
console.log('=== B) Nunca por menos de tres, y nunca jugando bien ===');
for (const { nombre, club } of clubes) {
  for (let n = 1; n < PARTIDOS_PARA_RACHA; n++) {
    const forma = evaluarForma(rachaFloja(n, 100), 100);
    ok(`${nombre}: ${n} partido(s) flojo(s) no mueven el once`,
      ajusteDeFormaEnElOnce(forma) === 0);
  }
}
const buena = evaluarForma(
  Array.from({ length: 5 }, (_, i) => ({ rating: NOTA_BUENA + 0.5, paso: 96 + i })), 100);
ok('jugando bien el once se AFLOJA, no se aprieta', ajusteDeFormaEnElOnce(buena) < 0,
  `${ajusteDeFormaEnElOnce(buena)}`);

console.log('');
console.log('=== C) La valvula: de la mala racha se sale en un partido ===');
//
// Es la trampa que tenia esta mecanica escrita en el diseno: si entrar al banco baja la forma y la
// forma baja te mantiene en el banco, la carrera se muere. Un solo partido bueno tiene que cortar
// la racha -- entrando desde el banco se juega menos, y ESO es lo que hace que volver cueste, no un
// castigo extra.
const cuatroFlojos = rachaFloja(4, 99);
const conUnBueno = [...cuatroFlojos, { rating: NOTA_BUENA + 0.5, paso: 100 }];
ok('cuatro flojos aprietan', ajusteDeFormaEnElOnce(evaluarForma(cuatroFlojos, 99)) > 0,
  `${ajusteDeFormaEnElOnce(evaluarForma(cuatroFlojos, 99))}`);
ok('y un solo partido bueno lo suelta entero',
  ajusteDeFormaEnElOnce(evaluarForma(conUnBueno, 100)) <= 0,
  `${ajusteDeFormaEnElOnce(evaluarForma(conUnBueno, 100))}`);

console.log('');
console.log('=== D) El tope existe y no se pasa ===');
const bajaLarguisima = evaluarForma(rachaFloja(VENTANA_DE_FORMA, 100), 100);
ok('el apriete tiene tope', ajusteDeFormaEnElOnce(bajaLarguisima) <= PESO_MAXIMO_DE_LA_MALA_FORMA,
  `${ajusteDeFormaEnElOnce(bajaLarguisima)} de ${PESO_MAXIMO_DE_LA_MALA_FORMA}`);

console.log('');
console.log(`${fallas === 0 ? 'Jugar mal cuesta el puesto, en todos los clubes, y se vuelve jugando bien.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
