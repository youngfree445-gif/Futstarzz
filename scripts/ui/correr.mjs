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
// FICHAR=FC Barcelona pide que, apenas aparezca su oferta, se acepte el traspaso.
const FICHAR = process.env.FICHAR || null;
const { bitacora, avisos, pasos, gasto, motivoDelFinal, guardada } = await jugar({ club: CLUB, liga: LIGA, temporadas: TEMPORADAS, ficharPor: FICHAR });
console.log(`\nSe apretaron ${pasos} pantallas en ${((Date.now() - t0) / 1000).toFixed(0)}s. ${bitacora.length} partidos anotados.\n`);
// Y DONDE SE FUE, por pantalla: sin esto, optimizar el banco es adivinar.
console.log(`--- DONDE SE FUE EL TIEMPO ---
  ${gasto}
`);
console.log(`--- POR QUE TERMINO ---
  ${motivoDelFinal}
`);

writeFileSync(process.env.BITACORA || 'scripts/ui/ultima_bitacora.json', JSON.stringify({ club: CLUB, bitacora, avisos, guardada }, null, 2));

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
// "Champions LEAGUE", con la palabra entera: `/Champions/` sola hace match con CHAMPIONSHIP.
//
// La segunda division inglesa se llama Championship, asi que TODOS los partidos de liga de un club
// de ahi se contaban como partidos de copa europea. Salio jugando con el Birmingham: el informe
// acusaba a veintitres clubes de la Championship de "no estar en la copa europea" -- y tenia razon,
// no estaban, porque no era la copa europea. Un club grande nunca lo iba a destapar: ninguno juega
// en segunda.
const euro = bitacora.filter(p => /(Champions|Europa) League/i.test(p.competicion));
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
  // Y los rivales repetidos, tambien POR EDICION: en la edicion nueva podes cruzarte de nuevo con
  // alguno de la anterior sin que eso sea un error.
  const enFaseDeLiga = partidos.filter(p => /fase de liga|fase de grupos/i.test(p.jornada))
    .map(p => `${p.copaEuropea?.arranco ?? 'unica'}|${p.rival}`);
  const repetidos = enFaseDeLiga.filter((r, i) => enFaseDeLiga.indexOf(r) !== i).map(r => r.split('|')[1]);
  if (repetidos.length) {
    problemas.push(`T${temp}: rivales repetidos en la FASE DE LIGA -> ${[...new Set(repetidos)].join(', ')}`);
  }
  // SOLO EN LA TEMPORADA 1. `participantes` es la lista REAL de 2025/26, que esta cargada fija en
  // el juego. Desde la temporada 2 los clasificados salen de la tabla del año anterior -- que es
  // justamente lo que tiene que pasar -- asi que el Koln o el Twente pueden entrar con todo
  // derecho. Comparar contra la lista vieja marcaba eso como error: falso positivo garantizado en
  // toda carrera larga.
  const ajenos = temp !== 1 ? [] : [...new Set(rivales)].filter(r => r && r !== 'RIVAL SIN SORTEAR' && !participantes.has(r));
  if (ajenos.length) {
    problemas.push(`T${temp}: rivales que NO están en la copa europea -> ${ajenos.join(', ')}`);
  }
  if (rivales.includes(CLUB)) problemas.push(`T${temp}: el club se enfrenta a sí mismo.`);
  // OCHO POR EDICION, no por temporada de carrera.
  //
  // Una temporada de carrera puede contener el final de una edicion europea y el arranque de la
  // siguiente: al Dortmund le entraron los ocho de su Champions, la final, y despues dos fechas de
  // la edicion nueva -- diez en la misma temporada, y las diez correctas. Se agrupa por la edicion
  // que el propio juego anota (copaEuropea.arranco, el paso en que nacio esa edicion).
  const porEdicion = new Map();
  for (const p of partidos) {
    if (!/fase de (liga|grupos)/i.test(p.jornada ?? '')) continue;
    const ed = p.copaEuropea?.arranco ?? 'unica';
    porEdicion.set(ed, (porEdicion.get(ed) ?? 0) + 1);
  }
  for (const [ed, n] of porEdicion) {
    if (n > 8) problemas.push(`T${temp}: ${n} partidos de fase de liga en la edicion ${ed} (el formato son 8).`);
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
// --- LA CARRERA: por donde paso y como termino -------------------------------------------------
console.log('--- LA CARRERA ---');
const clubDeCadaTemporada = new Map();
for (const p of bitacora) {
  if (!p.seJugo) continue;
  if (!clubDeCadaTemporada.has(p.temporada)) clubDeCadaTemporada.set(p.temporada, new Set());
}
const historial = guardada?.seasonHistory ?? [];
if (historial.length) {
  for (const t of historial) {
    console.log(`  T${t.seasonNum ?? "?"}  ${(t.clubName ?? '?').padEnd(26)} ${t.partidos ?? "?"} PJ, ${t.goles ?? "?"} goles${t.titulo ? "  " + t.titulo : ""}`);
  }
} else {
  console.log('  (la partida no guardo historial por temporada)');
}
console.log(`  edad al cerrar: ${guardada?.age ?? '?'} | club final: ${guardada?.currentClubId ?? '?'} | retirado: ${guardada?.retired ? 'SI' : 'no'}`);
const fichajes = avisos.filter(a => /^FICHAJE:/.test(a));
for (const f of fichajes) console.log('  ' + f);
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
  // SOLO LO QUE SE JUGO DE VERDAD. La bitacora anota lo que anuncia la TARJETA, y un dia puede
  // pasar sin partido: ahi no hay marcador. Contando esos como partidos, un cruce anunciado dos
  // veces y jugado una salia reportado como "se jugo 3 veces" -- que es un bug distinto (la
  // tarjeta promete un partido que no ocurre) y merece su propio cartel, no confundirse con este.
  if (!p.seJugo) continue;
  if (p.jornada) {
    const clave = `T${p.temporada} · ${p.competicion} · ${p.jornada} · vs ${p.rival}`;
    vecesPorLlave.set(clave, (vecesPorLlave.get(clave) ?? 0) + 1);
  }
  // Y EL MISMO RIVAL CON LA MISMA LOCALIA, EN COPAS, que es el que se escapaba.
  //
  // Contar por RONDA no alcanza: cuando el partido lo sirve el calendario, el rotulo es la FECHA
  // ("15 abr", "13 ago"), asi que cada repeticion trae una etiqueta distinta y ninguna se repite.
  // Asi paso desapercibido que el LDU de Quito jugaba VEINTIUNA veces "Copa Sudamericana ·
  // visitante vs Vasco da Gama" en una sola temporada.
  //
  // SOLO EN COPAS, y no en la liga. En un pais con Apertura, Clausura y liguilla se puede recibir
  // al mismo rival tres veces en un año sin que nada este mal: al America le paso con el San Luis
  // -- una fecha del Clausura, la ida de la liguilla y una fecha del Apertura -- y salio marcado
  // como si fuera el bug del LDU. Un falso positivo tapa los de verdad, que es lo unico que este
  // chequeo existe para encontrar. En la liga, repetir jornada ya lo caza el conteo de arriba.
    // Igual que arriba: 'champions league' entero, que 'champions' solo agarra la Championship.
  const esCopa = /copa|cup|coppa|coupe|taça|taca|pokal|beker|libertadores|sudamericana|uefa|(champions|europa) league|concacaf|recopa|supercopa/i
    .test(p.competicion);
  if (esCopa) {
    const porRival = `T${p.temporada} · ${p.competicion} · ${p.localia} vs ${p.rival}`;
    vecesPorRival.set(porRival, (vecesPorRival.get(porRival) ?? 0) + 1);
  }
}
for (const [clave, veces] of vecesPorLlave) {
  if (veces > 2) problemas.push(`la MISMA llave se jugo ${veces} veces: ${clave}`);
}
for (const [clave, veces] of vecesPorRival) {
  if (veces > 2) problemas.push(`el MISMO cruce se jugo ${veces} veces: ${clave}`);
}

// SELECCIONES CONTRA SELECCIONES, Y CLUBES CONTRA CLUBES.
//
// Regla del usuario, y no es un detalle de presentacion: en el Mundial y en las Eliminatorias jugas
// con tu SELECCION, y ahi enfrente sólo puede haber otra seleccion. Ya paso al reves -- reportado:
// "en eliminatorias no juegas con otras selecciones sino con equipos" -- y esa vez el rival salia
// de la base de clubes porque la fecha FIFA caia en la rama equivocada. Se mira de los dos lados,
// porque el error simetrico (una seleccion metida en un torneo de clubes) seria igual de grave.
const esDeSelecciones = c => /Mundial|Eliminatorias|Copa América|Eurocopa|Copa Oro|Copa Asiática|Copa Africana|Nations League/i.test(c);
const esNombreDeSeleccion = r => /^Selección /i.test(r || '');
for (const p of bitacora) {
  if (!p.competicion || !p.rival || p.rival === 'RIVAL SIN SORTEAR') continue;
  if (esDeSelecciones(p.competicion) && !esNombreDeSeleccion(p.rival)) {
    problemas.push(`torneo de SELECCIONES contra un club: ${p.competicion} vs ${p.rival} (fecha ${p.paso})`);
  }
  if (!esDeSelecciones(p.competicion) && esNombreDeSeleccion(p.rival)) {
    problemas.push(`torneo de CLUBES contra una seleccion: ${p.competicion} vs ${p.rival} (fecha ${p.paso})`);
  }
}

// LA TARJETA PROMETIO UN PARTIDO Y EL DIA PASO SIN JUGARSE.
//
// Se detecta por el marcador vacio: la bitacora se anota al leer la tarjeta y el marcador recien al
// volver del partido. Medido en el Porto, 2 de cada 40 carreras: la tarjeta anunciaba la semifinal
// de la Taça, apretabas, y el dia pasaba de largo. Es su propio bug y no una llave repetida.
// LA ULTIMA TARJETA NO CUENTA: el banco corta la carrera ahi.
//
// Al terminar la temporada el bucle sale, y la tarjeta que estaba en pantalla queda anotada sin
// haberse jugado. Eso es el corte del banco, no un partido perdido, y contarlo ensuciaba el
// veredicto con un falso positivo por carrera -- 26 de 117 en una tanda de 40.
const prometidosSinJugar = bitacora
  // `sancionado` fuera: cumplir una fecha de suspension NO es un partido perdido -- la tarjeta
  // anuncia el proximo rival igual, pero el motor te lo saltea con razon.
  .filter((p, i) => p.competicion && p.rival && !p.seJugo && !p.sancionado && i < bitacora.length - 1);
for (const p of prometidosSinJugar) {
  problemas.push(`la tarjeta prometio ${p.competicion} vs ${p.rival} y el dia paso sin partido (fecha ${p.paso})`);
}

const sinCartel = bitacora.filter(p => !p.competicion).length;
if (sinCartel) problemas.push(`${sinCartel} fechas sin cartel de competición legible en la tarjeta.`);
const sinSortear = bitacora.filter(p => p.rival === 'RIVAL SIN SORTEAR').length;
if (sinSortear) problemas.push(`${sinSortear} fechas salieron con "Rival aún sin sortear".`);
const porDefinir = bitacora.filter(p => /por definir/i.test(p.rival)).length;
if (porDefinir) problemas.push(`${porDefinir} fechas salieron con un rival "Por definir".`);
const sinRonda = bitacora.filter(p => !p.jornada).length;
if (sinRonda) problemas.push(`${sinRonda} fechas sin jornada ni ronda en la tarjeta.`);

// LO QUE SE ROMPIO DE VERDAD, si algo se rompio.
//
// Un error que desmonta el arbol de React deja al banco mirando un DOM vacio, y sin esto el informe
// solo decia "ATASCO. Pantalla: DESCONOCIDA". La causa importa mas que el sintoma.
const rotos = globalThis.__errores ?? [];
if (rotos.length) {
  console.log(String.fromCharCode(10) + '--- SE ROMPIO ALGO ---');
  for (const e of rotos.slice(0, 6)) console.log('  ! ' + e.split(String.fromCharCode(10)).join(' / '));
  problemas.push(`la app tiro ${rotos.length} error(es): ${rotos[0].slice(0, 160)}`);
}

// --- LO QUE NO CUADRA EN LA FICHA ---------------------------------------------------------------
//
// El banco juega TODOS estos sistemas -- lesiones, entrenamiento, plata, moral, patrocinios -- y
// hasta ahora el informe no miraba ninguno: solo se fijaba en que los torneos cerraran. Un numero
// absurdo no rompe nada, no da error y no se nota jugando una temporada; se nota a las veinte.
//
// Son INVARIANTES, no gustos: cosas que no pueden pasar en ningun futbol.
const g = guardada ?? {};
const st = g.careerStats ?? {};
const pj = st.partidosHistoricos ?? st.partidos ?? 0;
const cuadra = [];
const rango = (nombre, v, min, max) => {
  if (typeof v === 'number' && (v < min || v > max)) cuadra.push(`${nombre} fuera de rango: ${v} (deberia estar entre ${min} y ${max})`);
};
rango('energia', g.energy, 0, 100);
rango('prestigio', g.prestige, 0, 100);
rango('hinchada', g.fans, 0, 100);
rango('edad', g.age, 15, 45);
for (const [k, v] of Object.entries(g.attributes ?? {})) rango('atributo ' + k, v, 1, 99);
if (typeof g.capital === 'number' && g.capital < 0) cuadra.push(`capital negativo: ${g.capital}`);
if (pj > 0) {
  // Los topes son generosos a proposito: Messi anda en 0,45 goles y 0,25 asistencias por partido en
  // toda su carrera. Pasar de UNA asistencia por partido no es "muy bueno", es imposible.
  const asis = st.asistenciasHistoricos ?? 0;
  const gol = st.golesHistoricos ?? 0;
  if (asis / pj > 1) cuadra.push(`${asis} asistencias en ${pj} partidos = ${(asis / pj).toFixed(2)} por partido (los mejores del mundo andan en 0,25)`);
  if (gol / pj > 1.5) cuadra.push(`${gol} goles en ${pj} partidos = ${(gol / pj).toFixed(2)} por partido`);
  if ((st.campeonatos ?? 0) > pj) cuadra.push(`mas campeonatos (${st.campeonatos}) que partidos (${pj})`);
}
if (g.activeInjury && (g.activeInjury.weeksRemaining ?? 0) < 0) {
  cuadra.push(`lesion con semanas negativas: ${JSON.stringify(g.activeInjury)}`);
}
console.log('\n--- LA FICHA AL CERRAR ---');
console.log(`  edad ${g.age} · ${pj} partidos · ${st.golesHistoricos ?? 0} goles · ${st.asistenciasHistoricos ?? 0} asistencias · ${st.campeonatos ?? 0} titulos`);
console.log(`  capital $${(g.capital ?? 0).toLocaleString('es')} · prestigio ${g.prestige} · hinchada ${g.fans} · energia ${g.energy}`);
console.log(`  atributos: ${Object.entries(g.attributes ?? {}).map(([k, v]) => k + ' ' + v).join(' · ')}`);
console.log(`  patrocinios ${g.sponsorsSignedCount ?? 0} · agente ${g.agent ? 'si' : 'ninguno'} · lesiones sufridas ${(g.injuryHistory ?? []).length}`);
for (const c of cuadra) problemas.push('la ficha no cuadra: ' + c);

console.log('\n--- LO QUE NO CIERRA ---');
if (!problemas.length) console.log('  (nada)');
for (const p of problemas) console.log('  ✗ ' + p);

if (avisos.length) {
  console.log('\n--- CARTELES QUE MOSTRO EL JUEGO ---');
  for (const a of [...new Set(avisos)].slice(0, 25)) console.log('  · ' + a);
}

console.log('\nBitácora completa en scripts/ui/ultima_bitacora.json');

// Y SE SALE A MANO, que si no el proceso tarda TRES MINUTOS Y MEDIO en morirse.
//
// Medido: cargar el bundle 1.4s, jugar la temporada entera 20s, escribir el informe 0s... y 210s
// mas sin hacer nada. El trabajo esta terminado y el proceso sigue vivo porque jsdom y React
// dejaron temporizadores pendientes que nadie va a limpiar y que node espera igual.
//
// Con 19 ligas eso era mas de una HORA de barrido esperando a nada. Aca no queda nada por hacer:
// el informe ya se imprimio y la bitacora ya esta en disco.
//
// Se vacia la salida antes de cortar, porque en Windows stdout hacia un pipe es asincrono y un
// process.exit() a secas se puede comer las ultimas lineas -- justo las del informe.
await new Promise(listo => process.stdout.write('', listo));
process.exit(0);
