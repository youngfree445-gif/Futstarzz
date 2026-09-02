/**
 * Aplica los fichajes bajados de Transfermarkt al plantel real del juego.
 *
 *   node scripts/aplicar_fichajes.mjs                 informe, no escribe nada
 *   node scripts/aplicar_fichajes.mjs --escribir      aplica y guarda
 *   ... --desde <archivo>    leer otra tanda en vez de data/fichajes_2026.json
 *   ... --informe <archivo>  dejar el veredicto de cada movimiento en JSON
 *   ... --igual              guardar aunque haya banderas rojas
 *
 * PARA EL USO DE TODOS LOS DÍAS ESTÁ `npm run fichajes`, que baja, filtra lo ya aplicado y llama a
 * este script con --desde. Éste sigue siendo el motor y el informe largo; el otro es la puerta.
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
 * dos veces, es que nunca se empareja por apellido. Acá hay tres criterios y los tres son más
 * fuertes que eso:
 *
 *   0. El ID de Transfermarkt, cuando la base lo tiene: los jugadores que este script creó guardan
 *      el suyo en `tm_id`. No hay identidad más fuerte, así que se pregunta primero.
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
import { leerClubesDelJuego, leerMapa } from './lib/data_ts.mjs';
import { equiposQueNoSonClub } from './lib/equipos.mjs';

const ESCRIBIR = process.argv.includes('--escribir');
const opcion = (nombre, porDefecto) => {
  const i = process.argv.indexOf(nombre);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
};
const DB = 'src/playersDatabase.json';
// El archivo de entrada se puede cambiar, y de eso vive el mecanismo incremental: scripts/fichajes.mjs
// le pasa la MISMA estructura pero con sólo los movimientos que todavía no se aplicaron.
const FICHAJES = opcion('--desde', 'data/fichajes_2026.json');
// Dónde dejar el veredicto de cada movimiento, para que quien orqueste sepa qué anotar como hecho.
const INFORME = opcion('--informe', null);

const jugadores = JSON.parse(await readFile(DB, 'utf8'));
const fichajes = JSON.parse(await readFile(FICHAJES, 'utf8'));

/**
 * La identidad de un movimiento, para el registro de lo ya aplicado.
 *
 * Por ID de Transfermarkt — el del jugador y el del club —, nunca por nombre: es la regla de
 * docs/PROMPT_DATOS_Y_SCRAPING.md §3. Dos "Luis Díaz" tienen dos ids distintos; el mismo Luis Díaz
 * escrito de dos formas tiene uno solo.
 */
const claveDe = (tipo, club, mov) => `${tipo}|${mov.tmId ?? mov.nombre}|${club.tmId ?? club.nombre}`;
const veredictos = new Map();          // clave -> 'aplicado' | 'sin_club' | 'pendiente'
const anotar = (tipo, club, mov, veredicto) => veredictos.set(claveDe(tipo, club, mov), veredicto);

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

  // LOS OCHO QUE LA GUARDIA DE HOMONIMOS FRENO. Son cuatro pares en los que los dos clubes existen
  // en la base con nombres distintos, pero la comparacion por palabras los mandaba al mismo -- y
  // como no se puede saber cual es cual, la guardia no aplicaba NINGUNO de los dos y esos ocho
  // clubes se quedaban sin su ventana de pases entera.
  //
  // Escribir el alias es la salida correcta: no hay regla automatica que distinga "Cercle Brugge" de
  // "Club Brugge KV" sin conocerlos, y son ocho lineas contra una regla nueva que puede volver a
  // fundir otro par el dia que se agregue una liga.
  'vitoria guimaraes sc': 'Vitória de Guimarães',          // Portugal
  'esporte clube vitoria': 'Vitória',                       // Brasil
  'cercle brugge': 'Cercle Brugge',                         // Belgica
  'club brugge kv': 'Club Brugge',                          // Belgica
  'fc cajamarca': 'FC Cajamarca',                           // Peru
  'universidad tecnica de cajamarca': 'UTC',                // Peru
  'libertad fc': 'Libertad F.C.',                           // Ecuador
  'club libertad asuncion': 'Libertad',                     // Paraguay

  // LOS FILIALES NO SON EL PRIMER EQUIPO. El juego no los tiene, y sin esto los fichajes del Celta
  // Fortuna -- que juega en Segunda -- caian en el Celta de Vigo. La guardia de homonimos lo agarro
  // apenas se destrabaron los cuatro pares de arriba. Se ignoran a proposito: es mejor no aplicar el
  // fichaje de un filial que sumarselo al primer equipo.
  'rc celta fortuna': null,
  'real madrid castilla': null,
  'barcelona atletic': null,
  'juventus next gen': null,
  'atletico madrid b': null,
  'athletic bilbao b': null,
  'villarreal b': null,
  'sevilla atletico': null,
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
// El lector vive en scripts/lib/data_ts.mjs: lo comparten éste y scripts/fichaje.mjs, y ahí está
// explicado por qué se lee por bloques y no por líneas.
const clubesDelJuego = leerClubesDelJuego(dataTs);   // { id, nombre, liga }

// Ligas que no dicen de qué país es el club: no sirven para desempatar homónimos, pero tampoco
// contradicen a nadie.
const SIN_PAIS = new Set(['Internacional', 'Resto del Mundo', '']);

// Los dos diccionarios que traducen del nombre del juego al de la base.
const SIN_POR_ID = leerMapa(dataTs, 'EQUIPO_SYNONYMS_POR_ID');
const SIN_POR_NOMBRE = leerMapa(dataTs, 'EQUIPO_SYNONYMS');

// Los equipos de la base, por nombre exacto y por clave de palabras. Las claves que apuntan a dos
// equipos distintos quedan marcadas y no resuelven a nadie: "FC Barcelona" y "Barcelona SC" dan las
// dos "barcelona", y elegir una es mandar a Rodri a jugar a Guayaquil.
const porNombreExacto = new Map();
const equiposPorClave = new Map();
const clavesDeLaBaseAmbiguas = new Set();
for (const p of jugadores) {
  if (!p.team_name) continue;
  if (!porNombreExacto.has(p.team_name)) porNombreExacto.set(p.team_name, { team_name: p.team_name, team_id: p.team_id });
  const k = clave(p.team_name);
  const ya = equiposPorClave.get(k);
  if (!ya) equiposPorClave.set(k, { team_name: p.team_name, team_id: p.team_id });
  else if (ya.team_name !== p.team_name) clavesDeLaBaseAmbiguas.add(k);
}

/**
 * El equipo de la base que corresponde a un nombre de Transfermarkt, o null.
 *
 * Tres pasadas: alias escrito a mano, coincidencia exacta de palabras, y por último SUBCONJUNTO
 * ("acf fiorentina" contiene a "fiorentina"). El subconjunto sólo vale si encuentra UNO: "inter
 * milan" contiene a "inter" y a "milan" y ahí adivinar sería inventar un fichaje.
 */
const cacheEquipo = new Map();
const cachear = (k, v) => { cacheEquipo.set(k, v); return v; };
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
    const mias = new Set(palabras(nombreTM));

    // DENTRO DE UN PAÍS la comparación puede ser generosa, y ahí está la clave de todo esto: los
    // homónimos que rompen el juego son SIEMPRE de países distintos -- el Everton de Viña del Mar y
    // el de Liverpool, el Nacional de Montevideo y el de Asunción. Entre clubes del mismo país,
    // "CD Everton" y "Everton de Viña del Mar" son el mismo y no hay con quién confundirlo.
    const delPais = pais ? clubesDelJuego.filter(c => c.liga === pais) : [];
    const buscarEn = (lista) => {
      let m = lista.filter(c => c.nombre === nombreTM);
      if (m.length !== 1) m = lista.filter(c => clave(c.nombre) === k);
      if (m.length !== 1) {
        // Una palabra distintiva en común alcanza, pero sólo si la encuentra en UNO.
        m = lista.filter(c => {
          const suyas = palabras(c.nombre);
          return suyas.length && (suyas.every(w => mias.has(w)) || [...mias].every(w => suyas.includes(w)));
        });
      }
      return m.length === 1 ? m[0] : null;
    };

    club = buscarEn(delPais);
    if (!club) {
      // Fuera del país sólo vale el nombre o la clave exactos, y sólo si hay UNO en todo el juego.
      const todos = clubesDelJuego.filter(c => c.nombre === nombreTM || clave(c.nombre) === k);
      if (todos.length === 1 && (!pais || SIN_PAIS.has(todos[0].liga))) club = todos[0];
      // Si hay candidatos de OTRO país, no se elige ninguno y tampoco se sigue buscando en la base:
      // que exista un "Everton" inglés es justamente la razón para no adivinar con el chileno.
      else if (todos.length && pais) return cachear(cacheKey, null);
    }
  }

  // 2) Del club del juego al equipo de la base, con el diccionario del propio juego.
  if (club) {
    const enLaBase = SIN_POR_ID.get(club.id) || SIN_POR_NOMBRE.get(club.nombre) || club.nombre;
    r = porNombreExacto.get(enLaBase) ?? null;
    // Y si la base lo escribe apenas distinto ("Rangers FC" contra "Rangers"), se compara por
    // palabras -- pero las del CLUB DEL JUEGO, que ya sabemos de qué país es, no las de
    // Transfermarkt. Ahí está toda la diferencia: "Everton de Viña del Mar" da la clave
    // "everton vina mar" y no encuentra nada, que es lo correcto; el que buscaba con la clave de
    // Transfermarkt encontraba "Everton" y mandaba los fichajes chilenos a Inglaterra.
    if (!r) {
      const kJuego = clave(enLaBase);
      if (!clavesDeLaBaseAmbiguas.has(kJuego)) r = equiposPorClave.get(kJuego) ?? null;
    }
  }

  // 3) Y si el club no está en data.ts, se prueba contra la base directamente: hay equipos en la
  // base que el juego todavía no tiene como club jugable. El Rangers escocés es uno -- existe en la
  // base con 27 jugadores y no figura en data.ts --, así que sin esto sus veinte bajas no se
  // aplicaban y el plantel quedaba con gente que ya no está.
  //
  // Primero por nombre exacto y después por clave de palabras, siempre que la clave apunte a UN
  // solo equipo. La clave exige que las palabras que importan sean LAS MISMAS -- "Rangers FC" y
  // "Rangers" dan las dos "rangers" --, así que no repite el error de "Liverpool FC Montevideo",
  // cuya clave es "liverpool montevideo" y no coincide con "liverpool".
  //
  // Y sólo si NO se identificó el club: si data.ts sí lo tiene y lo que falta es su plantel en la
  // base, no hay nada que buscar. Sin esta condición, "CD Everton" (Chile) se identificaba bien como
  // el club chileno, la base no tenía su plantel, y la búsqueda seguía de largo hasta encontrar
  // "Everton" a secas -- el de Goodison Park. Los fichajes de Viña del Mar terminaban en Liverpool.
  // Es el primer ejemplo que da docs/PROMPT_DATOS_Y_SCRAPING.md §3, y volvió a entrar por la puerta
  // de atrás al agregar la liga chilena.
  if (!r && !club && alias === undefined) {
    if (porNombreExacto.has(nombreTM)) r = porNombreExacto.get(nombreTM);
    else if (!clavesDeLaBaseAmbiguas.has(k)) r = equiposPorClave.get(k) ?? null;
  }
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

// --- LA GUARDIA FINAL CONTRA HOMÓNIMOS -------------------------------------------------------
//
// Antes de mover a nadie se resuelven TODOS los clubes y se mira si dos cayeron en el mismo. Si dos
// clubes distintos de Transfermarkt apuntan al mismo equipo de la base, no se puede saber cuál es
// cuál, así que no se elige: se anulan los dos y sus fichajes quedan sin aplicar.
//
// Es la verificación convertida en regla. Cada vez que se aflojó una comparación para ganar unos
// cientos de fichajes, apareció una fusión nueva -- el Everton de Viña del Mar con el de Goodison
// Park, el Nacional de Montevideo con el de Asunción, dos clubes peruanos que comparten la palabra
// "Cajamarca" -- y siempre la encontró este conteo, nunca la lectura del código. Poniéndolo como
// guardia, la próxima vez no llega a pasar.
const usadoPor = new Map();
for (const liga of fichajes.ligas) {
  for (const c of liga.clubes) {
    const d = buscarEquipo(c.nombre, liga.liga);
    if (!d) continue;
    const clave = `${c.nombre}|${liga.liga}`;
    const l = usadoPor.get(d.team_name);
    if (l) l.push(clave); else usadoPor.set(d.team_name, [clave]);
  }
}
let fusionesEvitadas = 0;
for (const [equipo, claves] of usadoPor) {
  if (claves.length < 2) continue;
  fusionesEvitadas++;
  console.log(`  (homónimos) ${claves.join(' + ')} caían los dos en "${equipo}": no se aplica ninguno`);
  for (const k of claves) cacheEquipo.set(k, null);
}

// Las selecciones y los combinados de exhibición NO son clubes: un jugador figura en su club y otra
// vez en su selección, y mover la fila de la selección lo sacaría del Mundial. La pregunta se
// contesta en scripts/lib/equipos.mjs, que es el único lugar donde vive.
const SELECCIONES = equiposQueNoSonClub(dataTs, jugadores);

// --- AGENTES LIBRES NO ES UNA SELECCIÓN, Y CONFUNDIRLOS CLONABA JUGADORES --------------------
//
// "Agentes libres" está en esa lista porque no es un club jugable: no tiene que sumar al tope de
// plantel ni salir en la radiografía. Pero el índice de búsqueda por nombre usaba la MISMA lista, y
// eso lo dejaba ciego a los 4.859 jugadores sin club: si un club fichaba a alguien que estaba libre,
// la base "no lo tenía" y se lo CREABA de nuevo. Correr el script dos veces sobre los mismos datos
// dejaba 625 jugadores duplicados — Michael Gregoritsch llegó a tener cuatro filas —, así que
// actualizar planteles era una operación que no se podía repetir. Medido: la base ya arrastraba 604
// filas clonadas de corridas anteriores.
//
// Ahora son dos preguntas distintas: "¿es un club?" (SELECCIONES, para el tope y las cuentas) y
// "¿puedo buscar un jugador acá?" (esto, que sí mira a los libres). Con esto el mercado de pases
// devuelve al jugador que estaba libre en vez de inventar una copia.
const LIBRES_NOMBRE = 'Agentes libres';
const esSeleccion = (equipo) => SELECCIONES.has(equipo) && equipo !== LIBRES_NOMBRE;

// Y se barren los clones que quedaron de antes, que son 604 filas.
//
// CÓMO SE SABE CUÁL ES EL CLON, sin adivinar: los ids de la base original llegan hasta 279.948 y
// después hay un hueco de veinte mil hasta 300.000, que es donde empiezan los ids INVENTADOS por los
// scripts. Medido sobre la base entera: 4.469 ids por encima de 300.000 y uno solo entre 290.000 y
// 300.000. Así que un id >= 300.000 es una fila que creó un script, no un dato de la fuente.
//
// Con eso la regla se puede escribir sin riesgo, y sólo dentro de agentes libres:
//   . si en el grupo hay un original y filas inventadas -> las inventadas son el clon
//   . si son todas inventadas -> se queda la primera (clones de clones, de correr varias veces)
//   . si son todas originales -> NO SE TOCAN: son dos personas distintas que se llaman igual y las
//     dos están sin club. Hay 28 casos así y borrarlos sería perder un jugador de verdad.
const ID_INVENTADO = 300000;
const clonesBorrados = [];
{
  const porNombreLibre = new Map();
  for (const p of jugadores) {
    if (p.team_name !== LIBRES_NOMBRE || !p.nombre_completo) continue;
    const l = porNombreLibre.get(p.nombre_completo);
    if (l) l.push(p); else porNombreLibre.set(p.nombre_completo, [p]);
  }
  const aBorrar = new Set();
  for (const [, filas] of porNombreLibre) {
    if (filas.length < 2) continue;
    const inventadas = filas.filter(p => (Number(p.player_id) || 0) >= ID_INVENTADO)
      .sort((a, b) => Number(a.player_id) - Number(b.player_id));
    if (!inventadas.length) continue;                      // dos originales: no se tocan
    const sobran = inventadas.length === filas.length ? inventadas.slice(1) : inventadas;
    for (const p of sobran) { aBorrar.add(p); clonesBorrados.push(p.nombre_completo); }
  }
  if (aBorrar.size) {
    for (let i = jugadores.length - 1; i >= 0; i--) if (aBorrar.has(jugadores[i])) jugadores.splice(i, 1);
  }
}

// Jugadores por nombre completo, sólo las filas de CLUB (y las de agentes libres).
const porNombre = new Map();
for (const p of jugadores) {
  if (!p.nombre_completo || esSeleccion(p.team_name)) continue;
  const lista = porNombre.get(p.nombre_completo);
  if (lista) lista.push(p); else porNombre.set(p.nombre_completo, [p]);
}

/**
 * El nombre listo para comparar entre las dos fuentes: sin acentos y sin letras dobles.
 *
 * Las dos fuentes escriben distinto a la misma persona: Transfermarkt pone "Mohamed Diomandé" y la
 * base "Mohammed Diomande". Sin esto, su pase del Rangers al Çorum no se aplicaba y el jugador se
 * quedaba en Escocia.
 *
 * ESTO SÓLO SE USA DENTRO DEL PLANTEL DE UN CLUB, nunca contra la base entera, y ahí está la
 * diferencia: aflojar la comparación de nombres a nivel global es exactamente cómo se juntan dos
 * personas distintas. En un plantel de 30 no hay dos "Diomande", y si los hubiera, el chequeo de
 * unicidad de abajo lo deja pasar sin tocar nada.
 */
const nombreLaxo = (n) => (n || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/(.)\1+/g, '$1')
  .replace(/[^a-z ]/g, '')
  .trim();

// Índice de plantel por club, con el nombre laxo. Agentes libres entra igual que un club: el que
// estaba sin equipo y vuelve al fútbol se encuentra por su "club" de origen como cualquier otro.
const planteles = new Map();
for (const p of jugadores) {
  if (!p.nombre_completo || esSeleccion(p.team_name)) continue;
  let m = planteles.get(p.team_name);
  if (!m) { m = new Map(); planteles.set(p.team_name, m); }
  const k = nombreLaxo(p.nombre_completo);
  const ya = m.get(k);
  if (ya) ya.push(p); else m.set(k, [p]);
}

/** El jugador de ESE club que se llama así, o null si no hay exactamente uno. */
function enElPlantel(teamName, nombre) {
  const l = planteles.get(teamName)?.get(nombreLaxo(nombre));
  return l && l.length === 1 ? l[0] : null;
}

/**
 * Mueve al jugador y MANTIENE EL ÍNDICE AL DÍA.
 *
 * Sin esto el índice queda viejo apenas alguien se mueve: el jugador sigue figurando en el plantel
 * de su club anterior, la baja del club que lo vendió no lo encuentra, y el club se queda con un
 * jugador que ya no tiene. Con el índice congelado, once clubes se pasaron de cuarenta jugadores.
 */
function mover(p, destino) {
  const antes = planteles.get(p.team_name)?.get(nombreLaxo(p.nombre_completo));
  if (antes) {
    const i = antes.indexOf(p);
    if (i >= 0) antes.splice(i, 1);
  }
  p.team_name = destino.team_name;
  p.team_id = destino.team_id;
  let m = planteles.get(destino.team_name);
  if (!m) { m = new Map(); planteles.set(destino.team_name, m); }
  const k = nombreLaxo(p.nombre_completo);
  const ya = m.get(k);
  if (ya) ya.push(p); else m.set(k, [p]);
}

// --- CREAR AL JUGADOR QUE LA BASE NO TIENE ---------------------------------------------------
//
// Si el club que lo ficha está en el juego, el jugador tiene que existir: si no, el club recibe un
// refuerzo que nunca aparece en su plantel.
const POSICION = {
  'Goalkeeper': 'GK',
  'Centre-Back': 'CB', 'Left-Back': 'LB', 'Right-Back': 'RB', 'Defender': 'CB',
  'Defensive Midfield': 'CDM', 'Central Midfield': 'CM', 'Attacking Midfield': 'CAM',
  'Left Midfield': 'LM', 'Right Midfield': 'RM', 'Midfielder': 'CM',
  'Left Winger': 'LW', 'Right Winger': 'RW',
  'Centre-Forward': 'ST', 'Second Striker': 'ST', 'Striker': 'ST',
};
const CATEGORIA = {
  GK: 'portero', CB: 'defensivo', LB: 'defensivo', RB: 'defensivo', CDM: 'defensivo',
  CM: 'ofensivo', CAM: 'ofensivo', LM: 'ofensivo', RM: 'ofensivo',
  LW: 'ofensivo', RW: 'ofensivo', ST: 'ofensivo',
};

/** "€70.00m" / "€450k" -> euros. */
const euros = (s) => {
  if (!s) return null;
  const m = /€\s*([\d.,]+)\s*(m|k|bn)?/i.exec(s.replace(/\s/g, ''));
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  if (!isFinite(n)) return null;
  const u = (m[2] || '').toLowerCase();
  return u === 'm' ? n * 1e6 : u === 'k' ? n * 1e3 : u === 'bn' ? n * 1e9 : n;
};

/**
 * La media de un jugador nuevo, a partir de su valor de mercado y su edad.
 *
 * LA TABLA ESTÁ MEDIDA, no elegida: se cruzaron los 3.181 jugadores que aparecen a la vez en los
 * fichajes de Transfermarkt y en la base del juego, y se tomó la MEDIANA de la media real por tramo
 * de valor. Sale monótona y sin saltos raros. Inventar la curva habría sido inventar el dato — que
 * es justo lo que docs/PROMPT_DATOS_Y_SCRAPING.md §0 prohíbe. Se puede rehacer con
 * scripts/_calibrar.mjs si la base cambia.
 *
 * Ojo: el `valor_mercado_eur` de la base NO está en la escala de Transfermarkt (la base topa cerca
 * de 50M y TM llega a 200M), así que la tabla va de valor DE TM a media, sin pasar por el otro.
 */
const MEDIA_POR_VALOR = [
  [100e6, 82], [60e6, 82], [40e6, 80], [25e6, 77], [15e6, 76], [8e6, 74],
  [4e6, 72], [2e6, 70], [1e6, 69], [500e3, 66], [250e3, 65], [0, 62],
];
function estimarMedia(valorEur, edad) {
  let m = 62;
  for (const [minimo, media] of MEDIA_POR_VALOR) if (valorEur >= minimo) { m = media; break; }
  // El mismo ajuste por edad que usa scripts/actualizar_plantel_tm.mjs: un pibe de 19 con valor alto
  // vale por lo que promete, no por lo que rinde hoy.
  if (edad != null) {
    if (edad <= 20) m -= 3;
    else if (edad <= 22) m -= 2;
    else if (edad >= 35) m -= 2;
  }
  return Math.max(52, Math.min(90, m));
}

let maxId = 0;
for (const p of jugadores) { const n = Number(p.player_id); if (isFinite(n) && n > maxId) maxId = n; }

const creados = [];
function crearJugador(alta, destino) {
  const pos = POSICION[alta.posicion];
  // Sin posición no se crea: un jugador sin posición no lo puede alinear nadie, y adivinarla sería
  // meter un dato inventado en la base.
  if (!pos) return null;
  const valor = euros(alta.valor) ?? 0;
  return {
    player_id: String(++maxId),
    nombre_completo: alta.nombre,
    posicion_especifica: pos,
    valor_mercado_eur: valor,
    media_valoracion: estimarMedia(valor, alta.edad ?? null),
    team_name: destino.team_name,
    team_id: destino.team_id,
    categoria_tactica: CATEGORIA[pos],
    // EL ID DE TRANSFERMARKT DEL QUE SALIÓ. Se guarda porque es la única identidad que no se
    // discute: la próxima ventana lo encuentra por acá y no por su nombre, así que ni se clona ni
    // se confunde con un homónimo. Los jugadores que ya venían en la base no lo tienen — la base
    // usa otra numeración (Bruno Guimarães es 247851 acá y 520624 en Transfermarkt) —, así que el
    // mapa se va llenando solo, un fichaje por vez.
    tm_id: alta.tmId ?? undefined,
  };
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
const porTmId = [];         // entraron por el id de Transfermarkt

// Los jugadores que una corrida anterior creó quedaron con su id de Transfermarkt guardado. Ese
// índice es la identidad más fuerte que hay -- no depende de cómo se escriba el nombre ni de que no
// exista otro igual -- y crece solo: cada ventana deja unos cientos más.
const indiceTm = new Map();
for (const p of jugadores) {
  if (!p.tm_id || esSeleccion(p.team_name)) continue;
  const l = indiceTm.get(String(p.tm_id));
  if (l) l.push(p); else indiceTm.set(String(p.tm_id), [p]);
}
const porSuTmId = (tmId) => {
  const l = tmId ? indiceTm.get(String(tmId)) : null;
  return l && l.length === 1 ? l[0] : null;
};

for (const liga of fichajes.ligas) {
  for (const club of liga.clubes) {
    const destino = buscarEquipo(club.nombre, liga.liga);
    for (const alta of club.altas) {
      // EL CLUB PRIMERO, y no es un detalle de orden. Si el club que ficha no está en el juego, el
      // fichaje no nos importa y el jugador tampoco: preguntar antes por el jugador mezclaba las dos
      // cosas en un solo número y hacía parecer que faltaban dos mil jugadores de clubes reales.
      if (!destino) { sinDestino.push({ liga: liga.liga, club: club.nombre, alta }); anotar('A', club, alta, 'sin_club'); continue; }

      // CRITERIO 0: el id de Transfermarkt, si la base ya lo tiene. No hay nada más fuerte, así que
      // va primero y no necesita ninguna de las verificaciones de nombre que vienen después.
      const porId = porSuTmId(alta.tmId);
      if (porId) {
        if (porId.team_name === destino.team_name) { yaEstaba.push(alta.nombre); anotar('A', club, alta, 'aplicado'); continue; }
        porTmId.push(alta.nombre);
        anotar('A', club, alta, 'aplicado');
        movidos.push({ nombre: porId.nombre_completo, de: porId.team_name, a: destino.team_name, jugador: porId });
        mover(porId, destino);
        continue;
      }

      const candidatos = porNombre.get(alta.nombre);
      if (!candidatos) {
        // El club SÍ está en el juego y el jugador no existe en la base: hay que crearlo, o el
        // plantel se queda sin el refuerzo.
        const nuevo = crearJugador(alta, destino);
        if (nuevo) {
          jugadores.push(nuevo);
          porNombre.set(alta.nombre, [nuevo]);
          if (nuevo.tm_id) indiceTm.set(String(nuevo.tm_id), [nuevo]);
          let m = planteles.get(destino.team_name);
          if (!m) { m = new Map(); planteles.set(destino.team_name, m); }
          const k = nombreLaxo(nuevo.nombre_completo);
          const ya = m.get(k);
          if (ya) ya.push(nuevo); else m.set(k, [nuevo]);
          creados.push(nuevo);
          anotar('A', club, alta, 'aplicado');
        }
        else { sinJugador.push({ liga: liga.liga, club: club.nombre, alta }); anotar('A', club, alta, 'pendiente'); }
        continue;
      }

      // SIN liga, y no es un olvido: el club del que sale el jugador es de otro país casi siempre,
      // así que pasarle la liga de la tabla que estamos leyendo sería afirmar algo falso. Sin liga,
      // buscarEquipo sólo acepta el caso en que ese nombre es único en todo el juego.
      const origen = buscarEquipo(alta.otroClub);
      // Dentro del plantel del club que lo vende, la comparacion puede ser laxa sin riesgo.
      const enOrigen = origen ? enElPlantel(origen.team_name, alta.nombre) : null;
      const desdeOrigen = enOrigen ? [enOrigen] : [];

      let elegido = null;
      let criterio = null;
      if (desdeOrigen.length === 1) { elegido = desdeOrigen[0]; criterio = porOrigen; }
      else if (candidatos.length === 1) { elegido = candidatos[0]; criterio = porUnico; }

      if (!elegido) {
        clubDistinto.push({
          liga: liga.liga, club: club.nombre, alta,
          estaEn: candidatos.map(p => p.team_name).join(' / '),
        });
        anotar('A', club, alta, 'pendiente');
        continue;
      }
      // El criterio se anota DESPUÉS de saber que hubo mudanza: contarlo antes hacía que los dos
      // subtotales sumaran más que el total, que es la clase de informe que no se puede creer.
      if (elegido.team_name === destino.team_name) { yaEstaba.push(alta.nombre); anotar('A', club, alta, 'aplicado'); continue; }
      criterio.push(alta.nombre);
      anotar('A', club, alta, 'aplicado');
      movidos.push({ nombre: elegido.nombre_completo, de: elegido.team_name, a: destino.team_name, jugador: elegido });
      mover(elegido, destino);
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
    if (!origen || !LIBRES) {
      // El club que lo vende no está en el juego: no hay plantel del que sacarlo. Se anota igual,
      // porque si no, cada corrida vuelve a contar las mismas 931 bajas como si fueran novedad.
      for (const baja of club.bajas) anotar('B', club, baja, 'sin_club');
      continue;
    }
    for (const baja of club.bajas) {
      // SIGUE EN EL CLUB QUE LO VENDIÓ: eso es lo único que hay que mirar. Si el alta del club que
      // lo compró ya lo movió, acá no queda nada por hacer y este filtro lo deja pasar de largo.
      const p = enElPlantel(origen.team_name, baja.nombre);
      // Que ya no esté en el club que lo vendió es la baja HECHA: o la movió su alta, o nunca
      // estuvo. En los dos casos no queda nada por hacer y no hay que volver a mirarla.
      if (!p) { bajasIgnoradas.push(baja.nombre); anotar('B', club, baja, 'aplicado'); continue; }
      // Si el club que lo compra está en el juego, va ahí; si no, a agentes libres. Antes esta rama
      // sólo corría para los destinos de afuera, y el jugador cuya alta no se pudo emparejar se
      // quedaba en su club viejo aunque Transfermarkt dijera que se fue.
      const destino = buscarEquipo(baja.otroClub) ?? LIBRES;
      anotar('B', club, baja, 'aplicado');
      if (destino === LIBRES) aLibres.push({ nombre: p.nombre_completo, de: p.team_name, a: baja.otroClub });
      else movidos.push({ nombre: p.nombre_completo, de: p.team_name, a: destino.team_name, jugador: p });
      mover(p, destino);
    }
  }
}

// --- EL TOPE DE PLANTEL ------------------------------------------------------------------------
//
// Transfermarkt lista como altas las vueltas de préstamo y los juveniles que suben, así que un club
// puede terminar con 27 altas y 8 bajas en una ventana. Aplicado tal cual, Boca quedaba con 54
// jugadores. Boca no tiene 54 jugadores.
//
// El tope sale del propio juego, no de una idea: medida la base entera, la mediana de plantel es 27,
// el percentil 75 es 30 y el 90 es 34. 32 deja pasar a los planteles grandes de verdad y corta los
// que no son planteles sino acumulaciones.
//
// Se corta por MEDIA, de abajo hacia arriba, y con dos protecciones:
//
//   . Los que acaban de llegar NO se tocan. Cortar por media a secas podía sacar del Real Madrid al
//     jugador que el club compró la semana pasada, y "fiché a Diomande y no está" es peor que un
//     plantel largo.
//   . Se respetan mínimos por línea. Ordenar por media y quedarse con los 32 mejores puede dejar a
//     un club con un arquero, y ahí no hay equipo que se pueda parar en la cancha.
const TOPE_DE_PLANTEL = 32;
const MIN_PORTEROS = 3, MIN_DEFENSIVOS = 9, MIN_OFENSIVOS = 9;

const reciénLlegados = new Set([...creados, ...movidos.map(m => m.jugador).filter(Boolean)]);
const podados = [];
if (LIBRES) {
  const porClub = new Map();
  for (const p of jugadores) {
    if (!p.team_name || SELECCIONES.has(p.team_name)) continue;
    const l = porClub.get(p.team_name);
    if (l) l.push(p); else porClub.set(p.team_name, [p]);
  }
  for (const [club, plantel] of porClub) {
    if (plantel.length <= TOPE_DE_PLANTEL) continue;
    const cupo = { portero: MIN_PORTEROS, defensivo: MIN_DEFENSIVOS, ofensivo: MIN_OFENSIVOS };
    const quedan = { portero: 0, defensivo: 0, ofensivo: 0 };
    for (const p of plantel) quedan[p.categoria_tactica] = (quedan[p.categoria_tactica] ?? 0) + 1;

    // De peor a mejor, que es el orden en que se va un plantel inflado.
    const candidatos = plantel
      .filter(p => !reciénLlegados.has(p))
      .sort((a, b) => (a.media_valoracion ?? 0) - (b.media_valoracion ?? 0));
    let sobran = plantel.length - TOPE_DE_PLANTEL;
    for (const p of candidatos) {
      if (sobran <= 0) break;
      const cat = p.categoria_tactica;
      if ((quedan[cat] ?? 0) <= (cupo[cat] ?? 0)) continue;   // no bajar del mínimo de su línea
      quedan[cat]--;
      sobran--;
      podados.push({ nombre: p.nombre_completo, de: club, media: p.media_valoracion });
      mover(p, LIBRES);
    }
  }
}
console.log(`\n  TOPE DE PLANTEL (${TOPE_DE_PLANTEL}): ${podados.length} jugadores a agentes libres`);

if (clonesBorrados.length) console.log(`  CLONES BORRADOS: ${clonesBorrados.length} filas repetidas en agentes libres (de corridas anteriores)`);

const total = fichajes.ligas.reduce((a, l) => a + l.clubes.reduce((b, c) => b + c.altas.length, 0), 0);
console.log(`FICHAJES BAJADOS: ${total} altas en ${fichajes.ligas.length} ligas (temporada ${fichajes.saison})\n`);
console.log(`  MOVIDOS .................. ${movidos.length}`);
console.log(`     por id de Transfermarkt ${porTmId.length}`);
console.log(`     por club de origen .... ${porOrigen.length}`);
console.log(`     por nombre unico ...... ${porUnico.length}`);
console.log(`  ya estaba en su club ..... ${yaEstaba.length}`);
console.log(`  el club destino no existe  ${sinDestino.length}`);
console.log(`  CREADOS (club del juego) . ${creados.length}`);
console.log(`  no se pudo crear ......... ${sinJugador.length}  (sin posicion)`);
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
  // Los tres Diomande de esta misma ventana, que son tres personas distintas y van a tres clubes
  // distintos. Si el cruce se equivoca de persona, se ve acá y en ningún otro lado.
  ['Yan Diomande', 'Real Madrid'], ['Ousmane Diomande', 'Nottingham Forest'],
  ['Mohammed Diomande', 'Agentes libres'],
  ['Marc Cucurella', 'Real Madrid'], ['Ibrahima Konaté', 'Real Madrid'],
];
console.log(`  --- casos de control ---`);
for (const [nombre, esperado] of CONTROL) {
  const filas = porNombre.get(nombre) ?? [];
  const donde = filas.map(p => p.team_name).join(' / ') || 'NO ESTÁ EN LA BASE';
  const ok = filas.some(p => p.team_name === esperado);
  console.log(`     ${ok ? 'OK  ' : 'MAL '} ${nombre.padEnd(20)} esperado ${esperado.padEnd(22)} está en ${donde}`);
}

// --- LA OTRA FUENTE: starPlayers de data.ts --------------------------------------------------
//
// data.ts tiene una lista corta de figuras por club, y getJugadoresMudados la usa para ESCONDER del
// plantel a los que figuran en otro club. Es un buen mecanismo -- así el juego no muestra a alguien
// que ya se fue -- pero apunta al revés cuando la lista queda vieja: después de mover a Rodri al
// Barcelona, el starPlayers del Manchester City seguía nombrándolo, así que el juego lo daba por
// "mudado al City" y lo borraba del plantel del Barcelona. El fichaje se aplicaba y no se veía.
//
// Se borra SÓLO la entrada del club que el jugador dejó, y sólo para los que este script movió. No
// se toca el resto de la lista: es la fuente de las figuras de cada club y reescribirla entera por
// las dudas sería cambiar mucho más de lo que hace falta.
const POSICION_AL_FINAL = /\s*\((GK|CB|LB|RB|CDM|CM|CAM|LM|RM|LW|RW|ST)\)\s*$/;
const nombreDeStar = (s) => s.replace(POSICION_AL_FINAL, '').replace(/#\d+/g, '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

// De qué club se fue cada jugador movido, con el nombre que usa la BASE.
const seFueDe = new Map();
for (const m of movidos) seFueDe.set(nombreDeStar(m.nombre), { de: m.de, a: m.a });

let lineasTocadas = 0, entradasBorradas = 0;
const lineas = dataTs.split('\n');
for (let i = 0; i < lineas.length; i++) {
  const mid = /^\s*\{\s*id: '([^']+)'/.exec(lineas[i]);
  const mnm = /\bname: '([^']+)'/.exec(lineas[i]);
  const msp = /starPlayers: \[([^\]]*)\]/.exec(lineas[i]);
  if (!mid || !mnm || !msp) continue;
  const enLaBase = SIN_POR_ID.get(mid[1]) || SIN_POR_NOMBRE.get(mnm[1]) || mnm[1];
  const quedan = [];
  let borre = false;
  for (const x of msp[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
    const mov = seFueDe.get(nombreDeStar(x[1]));
    // Se borra sólo si este club es EL QUE DEJÓ. Si el jugador no se movió, o se movió desde otro
    // lado, la entrada se queda como está.
    if (mov && mov.de === enLaBase && mov.a !== enLaBase) { borre = true; entradasBorradas++; continue; }
    quedan.push(`'${x[1]}'`);
  }
  if (!borre) continue;
  lineas[i] = lineas[i].replace(msp[0], `starPlayers: [${quedan.join(', ')}]`);
  lineasTocadas++;
}
console.log(`\n  starPlayers: ${entradasBorradas} entradas viejas borradas en ${lineasTocadas} clubes`);

// --- LAS BANDERAS ROJAS: cuándo NO hay que guardar -------------------------------------------
//
// Las verificaciones de arriba ya miran lo que importa, pero mirarlas es un trabajo humano que se
// hace bien la primera vez y de reojo la décima. Estas tres se leen solas y frenan la escritura,
// para que el mecanismo se pueda correr seguido sin que "casi no lo miré" termine en la base.
//
// Son sólo las que no admiten discusión: un club del juego recibiendo los fichajes de DOS clubes de
// Transfermarkt es un homónimo fundido, y un plantel que crece pasando de 40 es un club que quedó
// con gente que ya no tiene. Lo demás se informa y decide el que mira.
const banderas = [];
if (fundidos.length) banderas.push(`${fundidos.length} club(es) del juego reciben fichajes de dos clubes de Transfermarkt`);
if (DESPUES.grandes > ANTES.grandes) banderas.push(`los clubes con más de 40 jugadores pasaron de ${ANTES.grandes} a ${DESPUES.grandes}`);
if (DESPUES.chicos > ANTES.chicos + 5) banderas.push(`los clubes con menos de 14 jugadores pasaron de ${ANTES.chicos} a ${DESPUES.chicos}`);

if (INFORME) {
  const porVeredicto = (v) => [...veredictos].filter(([, x]) => x === v).map(([k]) => k);
  await writeFile(INFORME, JSON.stringify({
    aplicados: porVeredicto('aplicado'),
    // Los que se miraron y no se pudieron aplicar. No son "nuevos" nunca más: el que orquesta los
    // sigue mandando por si la base cambió, pero ya no los cuenta como novedad.
    noAplicados: [...porVeredicto('sin_club'), ...porVeredicto('pendiente')],
    movimientos: movidos.map(m => ({ nombre: m.nombre, de: m.de, a: m.a })),
    creados: creados.map(p => ({ nombre: p.nombre_completo, a: p.team_name, media: p.media_valoracion })),
    aLibres: aLibres.map(x => ({ nombre: x.nombre, de: x.de, a: x.a })),
    pendientes: clubDistinto.map(c => ({ nombre: c.alta.nombre, club: c.club, sale_de: c.alta.otroClub, esta_en: c.estaEn })),
    sinClub: [...new Set(sinDestino.map(x => x.club))],
    clonesBorrados: clonesBorrados.length,
    podados: podados.length,
    yaEstaban: yaEstaba.length,
    banderas,
  }, null, 1));
}

if (banderas.length) {
  console.log(`\n!! BANDERAS ROJAS:`);
  for (const b of banderas) console.log(`   - ${b}`);
}

if (ESCRIBIR && banderas.length && !process.argv.includes('--igual')) {
  console.log(`\nNO SE GUARDÓ NADA: hay banderas rojas. Revisar arriba, o correr con --igual si ya se sabe por qué.`);
  process.exitCode = 2;
} else if (ESCRIBIR) {
  await writeFile(DB, JSON.stringify(jugadores));
  if (entradasBorradas) await writeFile('src/data.ts', lineas.join('\n'));
  console.log(`\nGUARDADO: ${DB} con ${movidos.length} jugadores movidos.`);
} else {
  console.log(`\n(informe: no se escribió nada. Correr con --escribir para aplicar.)`);
}
