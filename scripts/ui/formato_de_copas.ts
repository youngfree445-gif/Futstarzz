// CUANTOS PARTIDOS DURA CADA RONDA DE CADA COPA NACIONAL, segun el reglamento cargado.
//
//   npx vite-node scripts/ui/formato_de_copas.ts
//
// Existe porque el cuadro jugaba TODAS las rondas a ida y vuelta en todos los paises, y eso duplica
// la FA Cup, la Coppa Italia, la DFB-Pokal, la Coupe de France y la Copa Argentina, que son a
// partido unico. Esta tabla se lee de un vistazo y se compara con el reglamento real.
import { esPartidoUnicoDeCopa, reglamentoDe } from '../../src/reglamentos';

const LIGAS = ['Inglesa', 'Alemana', 'Francesa', 'Italiana', 'Española', 'Portuguesa', 'Holandesa',
  'Brasileña', 'Colombiana', 'Argentina', 'Chilena', 'Ecuatoriana', 'Uruguaya', 'Venezolana',
  'Estadounidense', 'Paraguaya', 'Mexicana', 'Peruana', 'Boliviana'];

console.log('liga            copa                  16avos 8vos 4tos semi final');
console.log('-'.repeat(66));
for (const liga of LIGAS) {
  const copa = reglamentoDe(liga).copaNacional ?? '(sin copa)';
  const f = esPartidoUnicoDeCopa(liga);
  const p = (n: number) => (f(n) ? '  1  ' : '  2  ');
  console.log(liga.padEnd(15), copa.padEnd(21), p(16) + p(8) + p(4) + p(2) + p(1));
}
