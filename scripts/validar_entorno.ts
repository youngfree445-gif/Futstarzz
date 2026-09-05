// EL ENTORNO QUE TE ARRASTRA: que ninguna salida sea gratis, y que no se vuelva ruido de fondo.
//
//   npm run validar:entorno
//
// Tercera de las ocho mecanicas de vida (docs/OCHO_MECANICAS_DE_VIDA.md). Pedido: "amigos del
// barrio que te piden plata y fiestas. Cortar con ellos cuesta salud mental; no cortar, fisico."
//
// Lo que se comprueba es lo que puede salir mal en una mecanica de eventos:
//
//   A) que alguna opcion salga gratis -- ahi deja de ser una decision y pasa a ser un boton;
//   B) que la frecuencia sea plana -- a la quinta temporada el jugador aprieta sin leer;
//   C) que cortar no corte de verdad;
//   D) que la cuenta de la carrera entera deje la barra en un lugar absurdo.
//
// El dado entra por parametro en toda la mecanica, asi que estas mediciones son repetibles: la
// misma tirada da siempre el mismo resultado.

import {
  CORTAR_ENTORNO, CORTAR_SALUD_MENTAL, EVENTOS_ANTES_DE_PODER_CORTAR,
  chanceDeEventoDelEntorno, esCortarConElGrupo, eventoDelEntorno,
} from '../src/entornoQueArrastra';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

// Dado determinista, para que la medicion sea comparable entre corridas.
const dado = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

console.log('=== A) Ninguna salida es gratis ===');
const todosLosPedidos = new Map<string, ReturnType<typeof eventoDelEntorno>>();
for (let i = 0; i < 200; i++) {
  const ev = eventoDelEntorno(dado(i), 99);
  todosLosPedidos.set(ev.title, ev);
}
ok('se generan todos los pedidos del catalogo', todosLosPedidos.size >= 4, `${todosLosPedidos.size}`);

for (const [titulo, ev] of todosLosPedidos) {
  for (const c of ev.choices) {
    const e = c.effects;
    const cuesta = (e.capital ?? 0) < 0 || (e.energy ?? 0) < 0
      || (e.entorno ?? 0) < 0 || (e.mentalHealth ?? 0) < 0;
    ok(`${titulo} -- "${c.text}" cuesta algo`, cuesta,
      cuesta ? '' : 'no descuenta NADA: es un boton, no una decision');
  }
}

console.log('');
console.log('=== B) La opcion de cortar aparece cuando hay historia, y no antes ===');
for (let vividos = 0; vividos < EVENTOS_ANTES_DE_PODER_CORTAR; vividos++) {
  const ev = eventoDelEntorno(0.1, vividos);
  ok(`con ${vividos} pedido(s) vividos todavia no se puede cortar`,
    !ev.choices.some(c => esCortarConElGrupo(c.effects)), `${ev.choices.length} opciones`);
}
const conCorte = eventoDelEntorno(0.1, EVENTOS_ANTES_DE_PODER_CORTAR);
ok(`con ${EVENTOS_ANTES_DE_PODER_CORTAR} ya se puede`,
  conCorte.choices.some(c => esCortarConElGrupo(c.effects)), `${conCorte.choices.length} opciones`);

// Y CORTAR CUESTA LA CABEZA, que es lo que pidio el usuario. Si costara plata seria una opcion mas.
const corte = conCorte.choices.find(c => esCortarConElGrupo(c.effects))!;
ok('cortar cuesta salud mental y nada de plata',
  corte.effects.mentalHealth === -CORTAR_SALUD_MENTAL && corte.effects.capital === 0,
  `mente ${corte.effects.mentalHealth} · plata ${corte.effects.capital}`);
ok('y ademas se lleva el entorno puesto', corte.effects.entorno === -CORTAR_ENTORNO);

console.log('');
console.log('=== C) La frecuencia baja con la carrera, y cortar la apaga ===');
console.log('');
console.log('   partidos en la carrera   chance por fecha   pedidos por temporada (38)');
const chances: number[] = [];
for (const partidos of [10, 60, 180, 400]) {
  const ch = chanceDeEventoDelEntorno(partidos, false);
  chances.push(ch);
  console.log(`   ${String(partidos).padStart(22)}   ${ch.toFixed(2).padStart(16)}   ${(ch * 38).toFixed(1).padStart(26)}`);
}
ok('la frecuencia BAJA siempre, nunca sube ni se queda plana',
  chances.every((c, i) => i === 0 || c < chances[i - 1]), chances.join(' -> '));
ok("al que recien empieza le pasa varias veces por temporada", chances[0] * 38 >= 4,
  `${(chances[0] * 38).toFixed(1)} por temporada`);
// Y NO PUEDE SER SPAM. La primera calibracion daba 11,4 pedidos por temporada, o sea uno cada
// tres fechas: a esa frecuencia el jugador aprieta el mismo boton sin leer y la mecanica se
// vuelve un peaje.
ok('pero no tantas como para que sea ruido de fondo', chances[0] * 38 <= 8,
  `${(chances[0] * 38).toFixed(1)} por temporada`);
ok('al consagrado casi nunca', chances[chances.length - 1] * 38 <= 2,
  `${(chances[chances.length - 1] * 38).toFixed(1)} por temporada`);
for (const partidos of [10, 60, 180, 400]) {
  ok(`cortado, a los ${partidos} partidos ya no aparecen nunca`,
    chanceDeEventoDelEntorno(partidos, true) === 0);
}

console.log('');
console.log('=== D) Que le hace a la barra una carrera entera ===');
console.log('');
console.log('   El entorno arranca en 60 y se desgasta 6 por temporada por su cuenta.');
console.log('   Aca se juegan 10 temporadas de 38 fechas con cada estrategia.');
console.log('');
console.log('   estrategia            entorno final   plata gastada   salud mental');

const ENTORNO_INICIAL = 60;
const DESGASTE_POR_TEMPORADA = 6;
for (const estrategia of ['siempre les doy', 'siempre me niego', 'corto apenas puedo'] as const) {
  let entorno = ENTORNO_INICIAL, plata = 0, mente = 0, vividos = 0, cortado = false;
  let semilla = 1000;
  for (let temporada = 0; temporada < 10; temporada++) {
    for (let fecha = 0; fecha < 38; fecha++) {
      const partidos = temporada * 38 + fecha;
      if (dado(semilla++) >= chanceDeEventoDelEntorno(partidos, cortado)) continue;
      const ev = eventoDelEntorno(dado(semilla++), vividos);
      vividos++;
      const corteDisponible = ev.choices.find(c => esCortarConElGrupo(c.effects));
      const elegida = estrategia === 'corto apenas puedo' && corteDisponible
        ? corteDisponible
        : estrategia === 'siempre les doy' ? ev.choices[0] : ev.choices[1];
      if (esCortarConElGrupo(elegida.effects)) cortado = true;
      entorno = Math.max(0, Math.min(100, entorno + (elegida.effects.entorno ?? 0)));
      mente += elegida.effects.mentalHealth ?? 0;
      plata += -(elegida.effects.capital ?? 0);
    }
    entorno = Math.max(0, entorno - DESGASTE_POR_TEMPORADA);
  }
  console.log(`   ${estrategia.padEnd(20)}${String(entorno).padStart(14)}   ${('$' + plata.toLocaleString('es')).padStart(13)}   ${String(mente).padStart(12)}`);
  if (estrategia === 'siempre les doy') {
    ok('darles siempre sostiene la barra, pero se paga en plata', entorno > 40 && plata > 20000,
      `entorno ${entorno} · $${plata.toLocaleString('es')}`);
    // LA CABEZA NO SE COMPRA. La primera version sumaba 3 de salud mental por pedido cumplido, y
    // medido daban +111 en diez temporadas: una fuente gratis que dejaba al bajon animico sin
    // poder existir. Lo que el entorno alto le hace a la cabeza ya lo contesta ajustePorEntorno.
    ok('y no regala salud mental por el camino', mente === 0, `salud mental ${mente}`);
  }
  if (estrategia === 'siempre me niego') {
    ok('negarse siempre hunde el entorno sin gastar un peso', entorno <= 10 && plata === 0,
      `entorno ${entorno} · $${plata}`);
  }
  if (estrategia === 'corto apenas puedo') {
    ok('cortar sale caro de cabeza y ahi se termina la historia', mente <= -CORTAR_SALUD_MENTAL + 6,
      `salud mental ${mente}`);
  }
}

console.log('');
console.log('=== E) El evento tiene la forma que espera DecisionCenter ===');
const muestra = eventoDelEntorno(0.5, 5);
ok('trae titulo y descripcion', !!muestra.title && !!muestra.description);
ok('cada opcion trae texto, costo, desenlace y efectos',
  muestra.choices.every(c => typeof c.text === 'string' && typeof c.cost === 'number'
    && typeof c.outcome === 'string' && typeof c.effects.prestige === 'number'
    && typeof c.effects.fans === 'number'));
ok('y el costo del boton coincide con lo que descuenta',
  muestra.choices.every(c => c.cost === -(c.effects.capital ?? 0)),
  muestra.choices.map(c => `${c.cost}/${c.effects.capital}`).join(' '));

console.log('');
console.log(`${fallas === 0 ? 'Los del barrio piden, ninguna respuesta es gratis, y cortar corta de verdad.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
