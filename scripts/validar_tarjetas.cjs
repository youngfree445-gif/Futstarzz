// Modelo exacto del bloque ambiental de MatchSimulator: 90 minutos, dado<0.21 dispara falta.
function simular(pRojaDirecta, pSegundaAmarilla, pAmarilla, n = 200000) {
  let expulsados = 0, conTarjeta = 0;
  for (let i = 0; i < n; i++) {
    let cards = 'none';
    for (let m = 0; m < 90 && cards !== 'red'; m++) {
      if (Math.random() >= 0.21) continue;
      const r = Math.random();
      if (r < pRojaDirecta) { cards = 'red'; break; }
      if (cards === 'yellow') { if (r < pSegundaAmarilla) cards = 'red'; }
      else if (r < pAmarilla) cards = 'yellow';
    }
    if (cards === 'red') expulsados++;
    if (cards !== 'none') conTarjeta++;
  }
  return {
    exp: (expulsados / n * 100).toFixed(1),
    tar: (conTarjeta / n * 100).toFixed(1),
    cadaR: (n / expulsados).toFixed(0),
    cadaT: (n / conTarjeta).toFixed(1),
  };
}

const casos = [
  ['HOY              0.010 / 0.300 / 0.300', 0.010, 0.300, 0.300],
  ['solo baja rojas  0.001 / 0.005 / 0.300', 0.001, 0.005, 0.300],
  ['amarilla 0.10    0.001 / 0.005 / 0.100', 0.001, 0.005, 0.100],
  ['amarilla 0.05    0.001 / 0.005 / 0.050', 0.001, 0.005, 0.050],
  ['amarilla 0.03    0.001 / 0.004 / 0.030', 0.001, 0.004, 0.030],
];

console.log('escenario'.padEnd(40), 'expulsado'.padStart(10), 'con tarjeta'.padStart(12), '  1 roja c/'.padStart(12), '1 tarjeta c/');
for (const [n, a, b, c] of casos) {
  const r = simular(a, b, c);
  console.log(n.padEnd(40), (r.exp + '%').padStart(10), (r.tar + '%').padStart(12),
    (r.cadaR + ' part.').padStart(12), '  ' + r.cadaT + ' part.');
}
