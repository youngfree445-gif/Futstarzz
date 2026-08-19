/**
 * Aplica los fichajes bajados de Transfermarkt al plantel real del juego.
 *
 *   node scripts/aplicar_fichajes.mjs            informe, no escribe nada
 *   node scripts/aplicar_fichajes.mjs --escribir aplica y guarda
 *
 * QUÉ MUEVE Y QUÉ NO
 *
 * El plantel que el jugador ve sale de src/playersDatabase.json cruzado por `team_name` (ver
 * getClubWithRoster en data.ts). Los `starPlayers` de data.ts son la lista corta de figuras, no el
 * plantel. Un fichaje que no toque la base de jugadores no se ve en el juego — que es justo lo que
 * pasaba con Anthony Gordon: figuraba en el Barcelona en starPlayers y seguía en el Newcastle en la
 * base, y el juego muestra la base.
 *
 * CÓMO SE IDENTIFICA AL JUGADOR — la regla de docs/PROMPT_DATOS_Y_SCRAPING.md §3, que ya se rompió
 * dos veces, es que nunca se empareja por apellido. Acá hay dos criterios y los dos son más fuertes
 * que eso:
 *
 *   1. Nombre completo exacto Y el club donde está hoy en la base es el club de origen que declara
 *      Transfermarkt. Con las dos cosas no queda ambigüedad: si hay dos "Luis Díaz", el que sale
 *      del Liverpool es uno solo.
 *   2. Nombre completo exacto y ÚNICO en toda la base. Si no hay dos personas con ese nombre, no
 *      hay a quién confundir. Se cuenta aparte para que se vea cuántos entraron por acá.
 *
 * Lo que no cierra por ninguno de los dos NO se toca y se informa. Un scraper que resuelve a la
 * fuerza lo que no entiende es peor que uno que no corre.
 */

import { readFile, writeFile } from 'node:fs/promises';

const ESCRIBIR = process.argv.includes('--escribir');
const DB = 'src/playersDatabase.json';
const FICHAJES = 'data/fichajes_2026.json';

const jugadores = JSON.parse(await readFile(DB, 'utf8'));
const fichajes = JSON.parse(await readFile(FICHAJES, 'utf8'));

// --- Nombres de club: Transfermarkt y la base no los escriben igual --------------------------
//
// "ACF Fiorentina" y "Fiorentina", "Como 1907" y "Como", "Cruzeiro Esporte Clube" y "Cruzeiro".
// Se comparan por PALABRAS, sin acentos, sin los sufijos de sociedad y sin los años de fundación.
const RELLENO = new Set(`fc cf ac sc sv afc ssc as aj rc cd ud sd ca sl ss us uc sg rsc acf cfc rcd
ssd ogc kv jk bk sk if fk ec sad club clube de del la el los futebol football calcio deportivo
esporte regatas atletico athletic sporting association societa`.split(/\s+/));

const norm = (s) => (s || '')
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const palabras = (s) => norm(s).split(' ').filter(w => w && !RELLENO.has(w) && !/^\d+$/.test(w));
const clave = (s) => palabras(s).join(' ');

// Alias escritos a mano, sólo para lo que ninguna regla puede resolver sola.
const ALIAS = {
  'without clubwithout club': null,   // en TM, el jugador sin club: no es un destino
};

const dataTs = await readFile('src/data.ts', 'utf8');

// --- EL PUENTE: Transfermarkt -> club del juego -> equipo de la base --------------------------
//
// No se cruza contra los nombres de la base directamente, y hay dos razones.
//
// La primera: la base usa nombres SIN LICENCIA para varios clubes grandes. El Inter es "Lombardia
// FC" y el Milan es "Milano FC" -- se descubre buscando a Lautaro Martínez, no leyendo la lista.
// Ningún parecido de texto va a unir "Inter Milan" con "Lombardia FC".
//
// La segunda, y la que importa: data.ts YA tiene resuelto el problema de los homónimos, con un mapa
// por ID de club escrito a mano (EQUIPO_SYNONYMS_POR_ID) que sabe que 'liverpool_eng' es "Liverpool"
// y 'liverpool_uru' es "Liverpool F.C.". Rehacer ese trabajo acá sería tener dos fuentes para la
// misma pregunta, que es como este proyecto se rompió más veces.
// Se guarda la LIGA de cada club además del nombre, y es lo que evita el error de homónimos:
// Transfermarkt le dice "Club Nacional" al de MONTEVIDEO, y el juego le dice así al de ASUNCIÓN
// (el uruguayo se llama "Nacional" a secas). Con el nombre solo, trece fichajes del Nacional
// uruguayo se fueron a jugar a Paraguay. El país es lo único que los distingue.
const clubesDelJuego = [];              // { id, nombre, liga }
for (const linea of dataTs.split('\n')) {
  const m = /^\s*\{\s*id: '([^']+)'.*?\bname: '([^']+)'/.exec(linea);
  if (!m) continue;
  const liga = /\bleague: '([^']+)'/.exec(linea);
  clubesDelJuego.push({ id: m[1], nombre: m[2], liga: liga ? liga[1] : '' });
}

// Ligas que no dicen de qué país es el club: no sirven para desempatar homónimos, pero tampoco
// contradicen a nadie.
const SIN_PAIS = new Set(['Internacional', 'Resto del Mundo', '']);

// Los dos diccionarios que traducen del nombre del juego al de la base.
const leerMapa = (nombreDelMapa) => {
  const i = dataTs.indexOf(`const ${nombreDelMapa}`);
  if (i < 0) return new Map();
  const bloque = dataTs.slice(i, dataTs.indexOf('\n};', i));
  const m = new Map();
  for (const x of bloque.matchAll(/'([^']+)':\s*'([^']+)'/g)) m.set(x[1], x[2]);
  return m;
};
const SIN_POR_ID = leerMapa('EQUIPO_SYNONYMS_POR_ID');
const SIN_POR_NOMBRE = leerMapa('EQUIPO_SYNONYMS');

// Los equipos de la base, por nombre exacto.
const porNombreExacto = new Map();
for (const p of jugadores) {
  if (!p.team_name) continue;
  if (!porNombreExacto.has(p.team_name)) porNombreExacto.set(p.team_name, { team_name: p.team_name, team_id: p.team_id });
}

/**
 * El equipo de la base que corresponde a un nombre de Transfermarkt, o null.
 *
 * Tres pasadas: alias escrito a mano, coincidencia exacta de palabras, y por último SUBCONJUNTO
 * ("acf fiorentina" contiene a "fiorentina"). El subconjunto sólo vale si encuentra UNO: "inter
 * milan" contiene a "inter" y a "milan" y ahí adivinar sería inventar un fichaje.
 */
const cacheEquipo = new Map();
function buscarEquipo(nombreTM, ligaDelScrape) {
  const cacheKey = `${nombreTM}|${ligaDelScrape ?? ''}`;
  if (cacheEquipo.has(cacheKey)) return cacheEquipo.get(cacheKey);
  let r = null;
  const k = clave(nombreTM);
  const alias = ALIAS[k] ?? ALIAS[norm(nombreTM)];

  // 1) De Transfermarkt al club del juego. Primero por nombre exacto y, si nadie coincide, por
  //    palabras. Y en las dos pasadas manda el PAÍS.
  let club = null;
  if (alias === undefined) {
    // Las segundas divisiones vienen etiquetadas "Inglesa 2" y en data.ts la liga es "Inglesa" con
    // división 2: para saber de qué país es el club alcanza con el nombre sin el número.
    const pais = (ligaDelScrape ?? '').replace(/ \d$/, '');
    let candidatos = clubesDelJuego.filter(c => c.nombre === nombreTM);
    if (!candidatos.length) candidatos = clubesDelJuego.filter(c => clave(c.nombre) === k);

    const delPais = pais ? candidatos.filter(c => c.liga === pais) : [];
    if (delPais.length === 1) {
      club = delPais[0];
    } else if (candidatos.length === 1 && SIN_PAIS.has(candidatos[0].liga)) {
      // Uno solo y el juego no lo tiene clasificado por país: no hay con quién confundirlo.
      club = candidatos[0];
    } else if (candidatos.length === 1 && !pais) {
      // Sin liga de referencia (los clubes de ORIGEN vienen sin ella) sólo vale el caso en que hay
      // un único club con ese nombre en todo el juego.
      club = candidatos[0];
    }
    // Todo lo demás queda sin resolver A PROPÓSITO: dos clubes que se llaman igual y no se puede
    // decidir cuál es, es exactamente el caso donde adivinar rompe el juego.
  }

  // 2) Del club del juego al equipo de la base, con el diccionario del propio juego.
  if (club) {
    const enLaBase = SIN_POR_ID.get(club.id) || SIN_POR_NOMBRE.get(club.nombre) || club.nombre;
    r = porNombreExacto.get(enLaBase) ?? null;
  }

  // 3) Y si el club no está en data.ts, se prueba contra la base directamente por nombre exacto:
  // hay equipos en la base que el juego todavía no tiene como club jugable.
  if (!r && alias === undefined && porNombreExacto.has(nombreTM)) r = porNombreExacto.get(nombreTM);
  if (alias) r = porNombreExacto.get(alias) ?? null;
  // NO HAY CUARTA PASADA, y eso es a propósito.
  //
  // Hubo una: si las palabras del nombre de la base estaban CONTENIDAS en las del nombre de
  // Transfermarkt, se daba por bueno. Suena razonable y arreglaba "Feyenoord Rotterdam" -> Feyenoord.
  // También metió "Liverpool FC Montevideo" dentro del Liverpool de Inglaterra, "Independiente del
  // Valle" dentro del Independiente Medellín y "Técnico Universitario" dentro del Universitario de
  // Lima. Es EL ejemplo que docs/PROMPT_DATOS_Y_SCRAPING.md §3 usa para explicar por qué no se
  // empareja por nombre — y ahí estaba otra vez, con un club de Montevideo fichando para Anfield.
  //
  // Las palabras que sobran nunca son decorativas: "montevideo", "medellín", "del valle" son
  // justamente lo que distingue a un club de su homónimo. Así que o el nombre coincide, o hay un
  // alias escrito a mano, o no se toca.
  cacheEquipo.set(cacheKey, r);
  return r;
}

// Las selecciones NO son clubes: un jugador figura en su club y otra vez en su selección, y mover
// la fila de la selección lo sacaría del Mundial.
//
// La lista sale de data.ts, que es donde el juego define sus selecciones, en vez de escribirla acá:
// los ids no sirven para reconocerlas (Brasil es 1370, Países Bajos 105035, Ecuador 111465) y una
// lista escrita a mano se olvida justo de la que hace falta. Con los ids, "Países Bajos" pasaba por
// club y Jurriën Timber figuraba en dos equipos a la vez.
const SELECCIONES = new Set(['Agentes libres']);
for (const m of dataTs.matchAll(/countryName: '([^']+)'/g)) SELECCIONES.add(m[1]);

// Y además se detectan solas, que es lo que cubre a las que data.ts escribe distinto ("Holanda"
// contra "Países Bajos") o directamente no tiene ("Uzbekistan", "Irlanda del N.").
//
// La señal: en una selección TODOS los jugadores existen también en su club, porque son las mismas
// personas. Medido sobre la base entera, las selecciones dan 96-100% de jugadores repetidos y los
// combinados de exhibición ("Bundesliga XI", "Soccer Aid") 88-91%; el club más internacional que
// hay, el Arsenal, da 78%. El corte en 85% deja a cada uno de su lado sin ninguna lista escrita a
// mano que se pueda quedar vieja.
const vecesQueAparece = new Map();
for (const p of jugadores) vecesQueAparece.set(p.player_id, (vecesQueAparece.get(p.player_id) ?? 0) + 1);
const conteoPorEquipo = new Map();
for (const p of jugadores) {
  if (!p.team_name) continue;
  let e = conteoPorEquipo.get(p.team_name);
  if (!e) { e = { total: 0, repetidos: 0 }; conteoPorEquipo.set(p.team_name, e); }
  e.total++;
  if (vecesQueAparece.get(p.player_id) > 1) e.repetidos++;
}
for (const [nombre, e] of conteoPorEquipo) {
  if (e.total >= 15 && e.repetidos / e.total >= 0.85) SELECCIONES.add(nombre);
}

// Jugadores por nombre completo, sólo las filas de CLUB.
const porNombre = new Map();
for (const p of jugadores) {
  if (!p.nombre_completo || SELECCIONES.has(p.team_name)) continue;
  const lista = porNombre.get(p.nombre_completo);
  if (lista) lista.push(p); else porNombre.set(p.nombre_completo, [p]);
}

/**
 * Las mismas cuentas, sobre el estado actual de la base. Se corren ANTES y DESPUÉS de mover.
 *
 * Un número suelto -- "12 clubes con más de 40 jugadores" -- no dice nada: puede ser algo que rompí
 * yo o algo que ya estaba desde antes. Lo único que sirve para decidir si aplicar es la DIFERENCIA.
 */
function radiografia() {
  const plantel = new Map();
  const clubesDe = new Map();
  for (const p of jugadores) {
    if (SELECCIONES.has(p.team_name)) continue;
    plantel.set(p.team_name, (plantel.get(p.team_name) ?? 0) + 1);
    if (!clubesDe.has(p.nombre_completo)) clubesDe.set(p.nombre_completo, new Set());
    clubesDe.get(p.nombre_completo).add(p.team_name);
  }
  return {
    plantel,
    chicos: [...plantel].filter(([, v]) => v < 14).length,
    grandes: [...plantel].filter(([, v]) => v > 40).length,
    repetidos: [...clubesDe.values()].filter(s => s.size > 1).length,
  };
}
const ANTES = radiografia();

// --- El cruce --------------------------------------------------------------------------------
const movidos = [];
const porOrigen = [];       // entraron por el criterio 1
const porUnico = [];        // entraron por el criterio 2
const sinJugador = [];
const clubDistinto = [];
const sinDestino = [];
const yaEstaba = [];

for (const liga of fichajes.ligas) {
  for (const club of liga.clubes) {
    const destino = buscarEquipo(club.nombre, liga.liga);
    for (const alta of club.altas) {
      const candidatos = porNombre.get(alta.nombre);
      if (!candidatos) { sinJugador.push({ liga: liga.liga, club: club.nombre, alta }); continue; }
      if (!destino) { sinDestino.push({ liga: liga.liga, club: club.nombre, alta }); continue; }

      // SIN liga, y no es un olvido: el club del que sale el jugador es de otro país casi siempre,
      // así que pasarle la liga de la tabla que estamos leyendo sería afirmar algo falso. Sin liga,
      // buscarEquipo sólo acepta el caso en que ese nombre es único en todo el juego.
      const origen = buscarEquipo(alta.otroClub);
      const desdeOrigen = origen ? candidatos.filter(p => p.team_name === origen.team_name) : [];

      let elegido = null;
      let criterio = null;
      if (desdeOrigen.length === 1) { elegido = desdeOrigen[0]; criterio = porOrigen; }
      else if (candidatos.length === 1) { elegido = candidatos[0]; criterio = porUnico; }

      if (!elegido) {
        clubDistinto.push({
          liga: liga.liga, club: club.nombre, alta,
          estaEn: candidatos.map(p => p.team_name).join(' / '),
        });
        continue;
      }
      // El criterio se anota DESPUÉS de saber que hubo mudanza: contarlo antes hacía que los dos
      // subtotales sumaran más que el total, que es la clase de informe que no se puede creer.
      if (elegido.team_name === destino.team_name) { yaEstaba.push(alta.nombre); continue; }
      criterio.push(alta.nombre);
      movidos.push({ nombre: elegido.nombre_completo, de: elegido.team_name, a: destino.team_name });
      elegido.team_name = destino.team_name;
      elegido.team_id = destino.team_id;
    }
  }
}

// --- LAS BAJAS HACIA AFUERA DEL JUEGO --------------------------------------------------------
//
// Un alta ya saca al jugador de su club anterior: la fila es una sola y cambia de equipo. Pero eso
// sólo funciona cuando el club que lo compra está en alguna de las ligas que se bajaron. El que se
// va a Qatar, a Japón o a un club que el juego no tiene, se queda en su club para siempre — y el
// plantel engorda fichaje tras fichaje. Medido: ocho clubes se pasaron de 40 jugadores por esto.
//
// Esos van a "Agentes libres", que es donde la base ya guarda a los 1.905 sin club. No desaparecen
// (el mercado de pases los puede volver a traer) pero dejan de jugar donde ya no están.
//
// Va DESPUÉS de las altas a propósito: si el jugador ya se movió a su club nuevo, el chequeo de
// "sigue en el club que lo vende" no se cumple y la baja no lo toca. Al revés lo mandaría a
// agentes libres justo antes de ficharlo.
const LIBRES = porNombreExacto.get('Agentes libres');
const aLibres = [];
const bajasIgnoradas = [];
for (const liga of fichajes.ligas) {
  for (const club of liga.clubes) {
    const origen = buscarEquipo(club.nombre, liga.liga);
    if (!origen || !LIBRES) continue;
    for (const baja of club.bajas) {
      if (buscarEquipo(baja.otroClub)) continue;   // se fue a un club que el juego sí tiene
      const candidatos = (porNombre.get(baja.nombre) ?? []).filter(p => p.team_name === origen.team_name);
      if (candidatos.length !== 1) { bajasIgnoradas.push(baja.nombre); continue; }
      const p = candidatos[0];
      aLibres.push({ nombre: p.nombre_completo, de: p.team_name, a: baja.otroClub });
      p.team_name = LIBRES.team_name;
      p.team_id = LIBRES.team_id;
    }
  }
}

const total = fichajes.ligas.reduce((a, l) => a + l.clubes.reduce((b, c) => b + c.altas.length, 0), 0);
console.log(`FICHAJES BAJADOS: ${total} altas en ${fichajes.ligas.length} ligas (temporada ${fichajes.saison})\n`);
console.log(`  MOVIDOS .................. ${movidos.length}`);
console.log(`     por club de origen .... ${porOrigen.length}`);
console.log(`     por nombre unico ...... ${porUnico.length}`);
console.log(`  ya estaba en su club ..... ${yaEstaba.length}`);
console.log(`  el club destino no existe  ${sinDestino.length}`);
console.log(`  el jugador no existe ..... ${sinJugador.length}`);
console.log(`  no se pudo identificar ... ${clubDistinto.length}`);
console.log(`  se fueron a agentes libres ${aLibres.length}  (a un club que el juego no tiene)`);
console.log(`     baja sin identificar .. ${bajasIgnoradas.length}`);

const cuenta = (lista, campo) => {
  const m = new Map();
  for (const x of lista) { const k = campo(x); if (k) m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m].sort((a, b) => b[1] - a[1]);
};

console.log(`\n--- MOVIDOS (muestra) ---`);
for (const m of movidos.slice(0, 20)) console.log(`   ${m.nombre.padEnd(26)} ${m.de.padEnd(24)} -> ${m.a}`);

console.log(`\n--- CLUBES DESTINO QUE NO EXISTEN EN LA BASE (top) ---`);
for (const [n, v] of cuenta(sinDestino, x => x.club).slice(0, 15)) console.log(`   ${String(v).padStart(3)}  ${n}`);

console.log(`\n--- NO SE PUDO IDENTIFICAR (muestra) ---`);
for (const c of clubDistinto.slice(0, 10)) {
  console.log(`   ${c.alta.nombre.padEnd(24)} sale de "${c.alta.otroClub}" y la base tiene ese nombre en "${c.estaEn}"`);
}

// --- VERIFICACIONES OBLIGATORIAS -------------------------------------------------------------
//
// Las pide docs/PROMPT_DATOS_Y_SCRAPING.md §5, y no son ceremonia: mover tres mil jugadores puede
// dejar un club con cuarenta y otro con seis sin que nada se queje. Corren SIEMPRE, se escriba o no,
// porque un informe que no mira el resultado no sirve para decidir si aplicarlo.
console.log(`\n=== VERIFICACIONES ===`);

const DESPUES = radiografia();
const tocados = new Set(movidos.flatMap(m => [m.de, m.a]));
const dif = (a, b) => `${a} -> ${b}` + (b === a ? '  (igual)' : b > a ? `  (+${b - a})` : `  (${b - a})`);
console.log(`  clubes tocados ................ ${tocados.size}`);
console.log(`  con menos de 14 jugadores ..... ${dif(ANTES.chicos, DESPUES.chicos)}`);
console.log(`  con más de 40 ................. ${dif(ANTES.grandes, DESPUES.grandes)}`);
// El mismo nombre en dos clubes son casi siempre dos personas distintas ("Gabriel" son siete). Lo
// que importa no es cuántos hay sino cuántos AGREGUÉ.
console.log(`  el mismo nombre en 2 clubes ... ${dif(ANTES.repetidos, DESPUES.repetidos)}`);

// DOS CLUBES DE TRANSFERMARKT QUE CAEN EN EL MISMO DEL JUEGO.
//
// Es el homónimo mirado del otro lado: la base tiene un solo "Club Nacional" y Transfermarkt tiene
// el de Montevideo y el de Asunción. Si los dos resuelven al mismo, ese club recibe los fichajes de
// dos equipos distintos y termina con cuarenta y cinco jugadores.
const tmPorDestino = new Map();
for (const liga of fichajes.ligas) {
  for (const club of liga.clubes) {
    const d = buscarEquipo(club.nombre, liga.liga);
    if (!d) continue;
    if (!tmPorDestino.has(d.team_name)) tmPorDestino.set(d.team_name, new Set());
    tmPorDestino.get(d.team_name).add(`${club.nombre} (${liga.liga})`);
  }
}
const fundidos = [...tmPorDestino].filter(([, s]) => s.size > 1);
console.log(`  dos clubes de TM en uno del juego  ${fundidos.length}`);
for (const [n, s] of fundidos.slice(0, 8)) console.log(`     ${n.padEnd(22)} <- ${[...s].join(' + ')}`);

const crecieron = [...DESPUES.plantel]
  .map(([n, v]) => [n, v - (ANTES.plantel.get(n) ?? 0), v])
  .filter(([n, d, v]) => tocados.has(n) && v > 40 && d > 0)
  .sort((a, b) => b[1] - a[1]);
if (crecieron.length) {
  console.log(`  --- clubes que pasaron de 40 y crecieron ---`);
  for (const [n, d, v] of crecieron.slice(0, 8)) console.log(`     ${n.padEnd(26)} ${v} jugadores (+${d})`);
}

// Casos concretos verificados a mano contra la ficha del jugador en Transfermarkt. Un total que
// cierra no prueba que los fichajes que el usuario va a mirar primero hayan quedado bien.
const CONTROL = [
  ['Anthony Gordon', 'FC Barcelona'], ['Rodri', 'FC Barcelona'], ['Luis Díaz', 'Bayern München'],
  ['Ferran Torres', 'Paris Saint-Germain'], ['Bruno Guimarães', 'Arsenal'],
];
console.log(`  --- casos de control ---`);
for (const [nombre, esperado] of CONTROL) {
  const filas = porNombre.get(nombre) ?? [];
  const donde = filas.map(p => p.team_name).join(' / ') || 'NO ESTÁ EN LA BASE';
  const ok = filas.some(p => p.team_name === esperado);
  console.log(`     ${ok ? 'OK  ' : 'MAL '} ${nombre.padEnd(20)} esperado ${esperado.padEnd(22)} está en ${donde}`);
}

if (ESCRIBIR) {
  await writeFile(DB, JSON.stringify(jugadores));
  console.log(`\nGUARDADO: ${DB} con ${movidos.length} jugadores movidos.`);
} else {
  console.log(`\n(informe: no se escribió nada. Correr con --escribir para aplicar.)`);
}
