// El fichaje que te tapa: nunca puede dejarte fuera de la lista, solo en el banco.
function decide(reputation: number, prestige: number, estorbo = 0) {
  const starterThreshold = 25 + reputation * 11 + estorbo;
  const notCalledThreshold = Math.max(0, reputation * 7 - 15);
  if (prestige >= starterThreshold) return 'starter';
  if (prestige >= notCalledThreshold) return 'substitute';
  return 'not_called';
}
const estorboDe = (fechas: number) => (fechas < 0 || fechas > 10) ? 0 : Math.round(14 * (1 - fechas / 10));

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => { if (!c) fallas++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };

// Un jugador que era titular justo, con el refuerzo recien llegado, pasa al banco.
ok('el refuerzo puede mandarte al banco',
   decide(4, 70) === 'starter' && decide(4, 70, estorboDe(0)) === 'substitute');

// Y NUNCA fuera de la lista: se prueba en todas las reputaciones y prestigios bajos.
let saco = false;
for (let rep = 1; rep <= 5; rep++)
  for (let pres = 0; pres <= 100; pres++)
    if (decide(rep, pres, estorboDe(0)) === 'not_called' && decide(rep, pres, 0) !== 'not_called') saco = true;
ok('el refuerzo NUNCA te deja fuera de la lista', !saco);

// El efecto se afloja solo y desaparece.
ok('el estorbo baja con las fechas', estorboDe(0) === 14 && estorboDe(5) === 7 && estorboDe(10) === 0);
ok('pasadas 10 fechas no pesa nada', estorboDe(11) === 0 && estorboDe(40) === 0);

// Recuperas la titularidad rindiendo, sin esperar.
ok('subiendo prestigio volves a ser titular igual', decide(4, 85, estorboDe(0)) === 'starter');

console.log(fallas === 0 ? '\nLos 5 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
