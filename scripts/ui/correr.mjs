// Arranca el navegador de mentira, juega la carrera y revisa lo que salió en pantalla.
//
//   node scripts/ui/correr.mjs "Borussia Dortmund" Alemana 3
//
// El entorno se importa PRIMERO y estático: React y varios módulos del juego leen `document` en su
// nivel superior, así que el DOM tiene que existir antes de que el bundle se evalúe.
import './entorno.mjs';
import { writeFileSync } from 'fs';

const CLUB = process.argv[2] || 'Borussia Dortmund';
const LIGA = process.argv[3] || 'Alemana';
const TEMPORADAS = Math.max(1, Number(process.argv[4]) || 2);

const { jugar, datos } = await import('../../node_modules/.cache/jugarui/jugar_ui.js');

console.log(`\n=== JUGANDO DE VERDAD: ${CLUB} (${LIGA}), ${TEMPORADAS} temporada(s) ===\n`);
const t0 = Date.now();
const { bitacora, avisos, pasos, guardada } = await jugar({ club: CLUB, liga: LIGA, temporadas: TEMPORADAS });
console.log(`\nSe apretaron ${pasos} pantallas en ${((Date.now() - t0) / 1000).toFixed(0)}s. ${bitacora.length} partidos anotados.\n`);

writeFileSync('scripts/ui/ultima_bitacora.json', JSON.stringify({ club: CLUB, bitacora, avisos, guardada }, null, 2));

// ------------------------------------------------------------------ el resumen por competición
const porCompeticion = new Map();
for (const p of bitacora) {
  const k = p.competicion || '(sin cartel)';
  if (!porCompeticion.has(k)) porCompeticion.set(k, []);
  porCompeticion.get(k).push(p);
}
console.log('--- QUE SE JUGO ---');
for (const [k, v] of [...porCompeticion].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(v.length).padStart(3)}  ${k}`);
}

// ------------------------------------------------------------------ la Champions, partido a partido
const euro = bitacora.filter(p => /Champions|Europa League/i.test(p.competicion));
if (euro.length) {
  console.log('\n--- LOS PARTIDOS DE COPA EUROPEA, EN ORDEN ---');
  for (const p of euro) {
    console.log(`  T${p.temporada} paso ${String(p.paso).padStart(3)} | ${p.competicion.padEnd(22)} | ${(p.jornada || '—').padEnd(16)} | ${p.localia} vs ${p.rival}${p.marcador ? '  (' + p.marcador + ')' : ''}`);
  }
}

// ------------------------------------------------------------------ lo que no cierra
const problemas = [];
const participantes = new Set([...datos.champions, ...datos.europa]);

const porTemporada = new Map();
for (const p of euro) {
  if (!porTemporada.has(p.temporada)) porTemporada.set(p.temporada, []);
  porTemporada.get(p.temporada).push(p);
}

for (const [temp, partidos] of porTemporada) {
  const rivales = partidos.map(p => p.rival);
  // Repetir rival en una ELIMINATORIA es lo normal: ida y vuelta. Sólo se mira la fase de liga,
  // donde cada club juega contra ocho rivales distintos y repetir sí sería un error.
  const enFaseDeLiga = partidos.filter(p => /fase de liga|fase de grupos/i.test(p.jornada)).map(p => p.rival);
  const repetidos = enFaseDeLiga.filter((r, i) => enFaseDeLiga.indexOf(r) !== i);
  if (repetidos.length) {
    problemas.push(`T${temp}: rivales repetidos en la FASE DE LIGA -> ${[...new Set(repetidos)].join(', ')}`);
  }
  const ajenos = [...new Set(rivales)].filter(r => r && r !== 'RIVAL SIN SORTEAR' && !participantes.has(r));
  if (ajenos.length) {
    problemas.push(`T${temp}: rivales que NO están en la copa europea -> ${ajenos.join(', ')}`);
  }
  if (rivales.includes(CLUB)) problemas.push(`T${temp}: el club se enfrenta a sí mismo.`);
  if (enFaseDeLiga.length > 8) {
    problemas.push(`T${temp}: ${enFaseDeLiga.length} partidos de fase de liga (el formato son 8).`);
  }
  const locales = partidos.filter(p => p.localia === 'L').length;
  const visitas = partidos.filter(p => p.localia === 'V').length;
  if (partidos.length >= 6 && (locales === 0 || visitas === 0)) {
    problemas.push(`T${temp}: todas las fechas con la misma localía (${locales}L / ${visitas}V).`);
  }
  // HASTA DÓNDE LLEGÓ. Es la pregunta que la copa no contestaba nunca: antes se apagaba en
  // febrero, sin cuartos, ni semis, ni final, jugara el club como jugara.
  const rondas = [...new Set(partidos.map(p => p.jornada).filter(Boolean))];
  const masLejos = ['Final', 'Semifinal', 'Cuartos de Final', 'Octavos de Final', 'Playoff', 'Fase de liga']
    .find(r => rondas.some(x => x.startsWith(r))) ?? '—';
  // Y QUIÉN LA GANÓ, leído del estado que guarda el juego. Es la pregunta que la copa no contestaba
  // nunca: antes ninguna edición llegaba a coronar a nadie.
  const campeones = [...new Set(partidos.map(p => p.copaEuropea?.campeon).filter(Boolean))];
  console.log(`\n  T${temp}: ${partidos.length} partidos europeos, ${new Set(rivales).size} rivales distintos, ${locales}L/${visitas}V`);
  console.log(`        rondas jugadas: ${rondas.join(' · ') || '—'}`);
  console.log(`        llegó hasta: ${masLejos}`);
  if (campeones.length) console.log(`        campeón de la edición anterior según la partida: ${campeones.join(', ')}`);
}

const copaFinal = guardada?.uefaCups?.champions ?? guardada?.uefaCups?.europa ?? null;
if (copaFinal) {
  console.log(`\n--- LA COPA EUROPEA AL CERRAR LA PARTIDA ---`);
  console.log(`  edición ${copaFinal.year}, etapa "${copaFinal.stage}", campeón: ${copaFinal.championId ?? '(todavía sin coronar)'}`);
  const cuadro = copaFinal.knockout?.tiesByRound ?? [];
  console.log(`  rondas de eliminación armadas: ${cuadro.length ? cuadro.map(r => r.length + ' llaves').join(' → ') : '(ninguna)'}`);
}

// ------------------------------------------------------------------ ¿corona cada torneo?
//
// La pregunta que importa cuando se juegan varias ligas: que NINGUN campeonato quede a medias. Un
// torneo sin campeon no da error, no rompe la pantalla y no se nota jugando una sola liga -- se
// nota cuando se cierran ocho temporadas y una no dio vuelta olimpica.
const nombreDe = id => id ?? null;
console.log('');
console.log('--- CAMPEONATOS AL CERRAR LA TEMPORADA ---');
const torneos = [];
// Una edición RECIÉN CREADA no es un torneo roto: al cerrar la temporada el juego siembra la del
// año siguiente, y la partida termina ahí. Se la salta, o el informe marcaría en rojo un torneo que
// todavía no empezó a jugarse.
const yaEmpezo = cup => (cup?.stepsConsumed ?? 0) > 0
  || (cup?.fixtures ?? []).some(f => f.played)
  || (cup?.groups ?? []).some(g => (g.fixtures ?? []).some(f => f.played))
  || (cup?.bracket?.tiesByRound ?? []).some(r => r.some(t => t.played));
for (const [clave, cup] of Object.entries(guardada?.domesticCups ?? {})) {
  if (yaEmpezo(cup) || cup?.championId) torneos.push([`copa nacional ${clave}`, cup?.championId]);
}
for (const [clave, cup] of Object.entries(guardada?.continentalCups ?? {})) {
  if (yaEmpezo(cup) || cup?.championId) torneos.push([`continental ${clave}`, cup?.championId]);
}
for (const [clave, cup] of Object.entries(guardada?.uefaCups ?? {})) {
  if (yaEmpezo(cup) || cup?.championId) torneos.push([`uefa ${clave}`, cup?.championId]);
}
for (const [clave, cuadro] of Object.entries(guardada?.playoffsDeLiga ?? {})) {
  torneos.push([`cuadrangular ${clave}`, cuadro?.championId]);
}
// SI LA CORRIDA SE CORTO, no se le puede exigir un campeon a nadie.
//
// El banco se cuelga de vez en cuando en un partido jugado a mano (jsdom no implementa <canvas>) y
// ahi la temporada queda a medias. Sin esta distincion el informe decia "uefa champions SIN
// CAMPEON" y parecia un torneo roto, cuando lo que pasó es que el partido 24 de la Serie A nunca
// llegó a jugarse. Culpar al juego de una limitacion del banco es peor que no medir nada.
const seCorto = avisos.some(a => /^ATASCO/.test(a));
if (!torneos.length) console.log('  (la partida no guardó ningún torneo)');
for (const [nombre, campeon] of torneos) {
  const ok = !!campeon;
  console.log(`  ${ok ? '✓' : seCorto ? '~' : '✗'} ${nombre.padEnd(42)} ${ok ? nombreDe(campeon) : (seCorto ? 'sin coronar (la corrida se cortó antes)' : 'SIN CAMPEON')}`);
  if (!ok && !seCorto) problemas.push(`${nombre} terminó SIN CAMPEÓN`);
}
if (seCorto) console.log('  ! la corrida NO llegó al final de la temporada: lo de arriba no es un veredicto.');

// LA MISMA RONDA, SERVIDA DE MAS.
//
// Una llave de eliminacion se juega una vez (partido unico) o dos (ida y vuelta). Nunca tres. Si el
// mismo cartel -- torneo + ronda + rival -- aparece tres veces o mas, el cuadro no avanzo y el
// jugador esta repitiendo el partido. Es el bug que se veia en la Copa BetPlay del Junior: los
// dieciseisavos contra el America servidos cuatro veces, porque dos de esos dias no llegaban al
// cuadro y no movian nada.
//
// Se mira por TEMPORADA: la misma ronda del ano que viene es otra edicion y no es una repeticion.
const vecesPorLlave = new Map();
const vecesPorRival = new Map();
for (const p of bitacora) {
  if (!p.competicion) continue;
  if (p.jornada) {
    const clave = `T${p.temporada} · ${p.competicion} · ${p.jornada} · vs ${p.rival}`;
    vecesPorLlave.set(clave, (vecesPorLlave.get(clave) ?? 0) + 1);
  }
  // Y EL MISMO RIVAL CON LA MISMA LOCALIA, que es el que se escapaba.
  //
  // Contar por RONDA no alcanza: cuando el partido lo sirve el calendario, el rotulo es la FECHA
  // ("15 abr", "13 ago"), asi que cada repeticion trae una etiqueta distinta y ninguna se repite.
  // Asi paso desapercibido que el LDU de Quito jugaba VEINTIUNA veces "Copa Sudamericana ·
  // visitante vs Vasco da Gama" en una sola temporada. Contra un mismo rival, de local o de
  // visitante, no se juega mas de dos veces en ningun torneo -- ni en una liga ida y vuelta.
  const porRival = `T${p.temporada} · ${p.competicion} · ${p.localia} vs ${p.rival}`;
  vecesPorRival.set(porRival, (vecesPorRival.get(porRival) ?? 0) + 1);
}
for (const [clave, veces] of vecesPorLlave) {
  if (veces > 2) problemas.push(`la MISMA llave se jugo ${veces} veces: ${clave}`);
}
for (const [clave, veces] of vecesPorRival) {
  if (veces > 2) problemas.push(`el MISMO cruce se jugo ${veces} veces: ${clave}`);
}

const sinCartel = bitacora.filter(p => !p.competicion).length;
if (sinCartel) problemas.push(`${sinCartel} fechas sin cartel de competición legible en la tarjeta.`);
const sinSortear = bitacora.filter(p => p.rival === 'RIVAL SIN SORTEAR').length;
if (sinSortear) problemas.push(`${sinSortear} fechas salieron con "Rival aún sin sortear".`);
const porDefinir = bitacora.filter(p => /por definir/i.test(p.rival)).length;
if (porDefinir) problemas.push(`${porDefinir} fechas salieron con un rival "Por definir".`);
const sinRonda = bitacora.filter(p => !p.jornada).length;
if (sinRonda) problemas.push(`${sinRonda} fechas sin jornada ni ronda en la tarjeta.`);

console.log('\n--- LO QUE NO CIERRA ---');
if (!problemas.length) console.log('  (nada)');
for (const p of problemas) console.log('  ✗ ' + p);

if (avisos.length) {
  console.log('\n--- CARTELES QUE MOSTRO EL JUEGO ---');
  for (const a of [...new Set(avisos)].slice(0, 25)) console.log('  · ' + a);
}

console.log('\nBitácora completa en scripts/ui/ultima_bitacora.json');
