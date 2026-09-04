/**
 * BAJA EL PLANTEL DE LOS CLUBES QUE LA BASE NO TIENE.
 *
 *   npm run bajar:plantel                    todos los clubes que hoy figuran sin plantel
 *   npm run bajar:plantel -- "GD Chaves"     uno solo
 *   npm run bajar:plantel -- --escribir      además de bajarlos, los mete en la base
 *
 * Escribe data/planteles_tm/<club>.json, que es lo que come
 * scripts/actualizar_plantel_tm.mjs. Con --escribir hace las dos cosas.
 *
 * ---------------------------------------------------------------------------------------------
 * LO QUE HACE QUE ESTO NO META EL PLANTEL DE OTRO CLUB
 * ---------------------------------------------------------------------------------------------
 *
 * Buscar el club por nombre en Transfermarkt y agarrar el primer resultado es exactamente como se
 * rompe: buscando "San Antonio" devuelve el boliviano aunque preguntes por el ecuatoriano, buscando
 * "Boavista FC" devuelve el de Timor-Leste, y buscando "Brescia" llegó a devolver la Fiorentina.
 *
 * Así que el club se elige POR PAÍS. La tabla de resultados de la búsqueda trae la bandera de cada
 * club, y sólo se acepta la fila cuyo país es el de la liga del club en el juego. Si ninguna fila
 * es de ese país, no se baja nada y se avisa: es mejor un club sin plantel que un club con el
 * plantel de otro.
 *
 * Y hay un segundo cerrojo: si el nombre con el que se va a guardar el plantel YA existe en la
 * base, tampoco se escribe. Ese nombre es de otro club, y pisarlo es el bug de los homónimos otra
 * vez.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { leerClubesDelJuego, leerNombresDeClub, nombreEnLaBase } from './lib/data_ts.mjs';

const run = promisify(execFile);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2);
const ESCRIBIR = args.includes('--escribir');
const pedidos = args.filter(a => !a.startsWith('--'));

/** La liga del juego dice de qué país es el club. Es el desempate de los homónimos. */
const PAIS_DE_LA_LIGA = {
  Chilena: 'Chile', Peruana: 'Perú', Ecuatoriana: 'Ecuador', Argentina: 'Argentina',
  Colombiana: 'Colombia', Brasileña: 'Brasil', Uruguaya: 'Uruguay', Paraguaya: 'Paraguay',
  Boliviana: 'Bolivia', Venezolana: 'Venezuela', Mexicana: 'México',
  Italiana: 'Italia', Francesa: 'Francia', Portuguesa: 'Portugal', Española: 'España',
  Inglesa: 'Inglaterra', Alemana: 'Alemania', Holandesa: 'Países Bajos', Belga: 'Bélgica',
  Escocesa: 'Escocia', Griega: 'Grecia', Turca: 'Turquía', Chipriota: 'Chipre',
  Kazaja: 'Kazajistán', Serbia: 'Serbia', Búlgara: 'Bulgaria', Israelí: 'Israel',
  Suiza: 'Suiza', Austríaca: 'Austria', Danesa: 'Dinamarca', Noruega: 'Noruega',
  Sueca: 'Suecia', Checa: 'Chequia', Croata: 'Croacia', Rumana: 'Rumania', Húngara: 'Hungría',
};

// "Resto del Mundo" no dice de qué país es nadie, así que estos van escritos. Son pocos y cada uno
// se puede comprobar de un vistazo; adivinar el país sería justo lo que este script evita.
const PAIS_A_MANO = {
  olimpia_h: 'Honduras',
  'independiente_de_panamá': 'Panamá',
  general_caballero: 'Paraguay',
  alianza_universidad: 'Perú',
  river_plate_uruguay: 'Uruguay',
  santiago_morning: 'Chile',
  wydad_casablanca: 'Marruecos',
  urawa_red_diamonds: 'Japón',
  alajuelense: 'Costa Rica',
  herediano: 'Costa Rica',
  jorge_wilstermann: 'Bolivia',
  'atlético_tembetary': 'Paraguay',
};

// Los que la búsqueda por nombre no encuentra, con su id de Transfermarkt escrito a mano.
//
// No es pereza del buscador: el juego los llama de una forma y Transfermarkt de otra. "FK Crvena
// Zvezda" allá es "Estrella Roja de Belgrado" (la página está en español) y buscando el nombre del
// juego gana un homónimo amateur de cinco jugadores. "General Caballero" son DOS clubes paraguayos
// -- el JLM que juega la primera y el ZC que no -- y el buscador devuelve los dos.
//
// El id se saca de la propia búsqueda, mirando el país y el tamaño del plantel; no se escribe de
// memoria.
const A_MANO = {
  red_star_belgrade: ['roter-stern-belgrad', 159],                 // Estrella Roja de Belgrado
  maccabi_tel_aviv: ['maccabi-tel-aviv', 119],
  river_plate_uruguay: ['atletico-river-plate-montevideo', 2419],
  general_caballero: ['club-general-caballero-jlm-', 95573],       // el JLM, no el ZC
  olimpia_h: ['cd-olimpia', 2720],                                 // el de Tegucigalpa
};

const limpiar = (s) => s
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/&([a-zA-Z]+);/g, (m, n) => ({ aacute:'á', eacute:'é', iacute:'í', oacute:'ó', uacute:'ú',
    ntilde:'ñ', Aacute:'Á', Eacute:'É', Iacute:'Í', Oacute:'Ó', Uacute:'Ú', Ntilde:'Ñ', uuml:'ü',
    ouml:'ö', auml:'ä', ccedil:'ç', atilde:'ã', otilde:'õ', ecirc:'ê', acirc:'â', ocirc:'ô',
    egrave:'è', agrave:'à', amp:'&', quot:'"', apos:"'", nbsp:' ' })[n] ?? m)
  .replace(/\s+/g, ' ').trim();

const bajar = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
};

/**
 * Las filas de la búsqueda de clubes: nombre, id, PAÍS y cuántos jugadores tiene.
 *
 * El país sale de la bandera de la propia fila (`class="flaggenrahmen"`), así que no hace falta un
 * pedido más por candidato.
 */
async function buscarClubes(nombre) {
  const html = await bajar('https://www.transfermarkt.co/schnellsuche/ergebnis/schnellsuche?query=' + encodeURIComponent(nombre));
  const i = html.indexOf('<table class="items"');
  if (i < 0) return [];
  const fuera = [];
  for (const fila of html.slice(i).split(/<tr class="(?:odd|even)">/).slice(1)) {
    const club = fila.match(/href="\/([^"\/]+)\/startseite\/verein\/(\d+)"[^>]*>([^<]+)</);
    if (!club) continue;
    const pais = fila.match(/title="([^"]+)"[^>]*class="flaggenrahmen"/);
    const plantilla = fila.match(/\/kader\/verein\/\d+"[^>]*>(\d+)</);
    fuera.push({
      slug: club[1], id: club[2], nombre: limpiar(club[3]),
      pais: pais ? limpiar(pais[1]) : '',
      jugadores: plantilla ? Number(plantilla[1]) : 0,
    });
  }
  return fuera;
}

// El HTML del plantel: la tabla es `<table class="items">`, pero no se puede aislar con un
// `</table>` no-greedy porque cada fila trae `inline-table` anidadas y el corte se come 23 filas.
function parsearPlantel(html) {
  const i = html.indexOf('<table class="items"');
  if (i < 0) return [];
  const jugadores = [];
  for (const fila of html.slice(i).split(/<tr class="(?:odd|even)">/).slice(1)) {
    const nombre = fila.match(/\/profil\/spieler\/\d+"[^>]*>([^<]+)</);
    if (!nombre) continue;
    const pos = fila.match(/<td[^>]*>\s*([A-ZÁÉÍÓÚÑ][^<]{3,28}?)\s*<\/td>\s*<\/tr>\s*<\/table>/);
    const edad = fila.match(/<td class="zentriert">\s*(?:[^<]*\((\d{2})\)|(\d{2}))\s*<\/td>/);
    const valor = fila.match(/([\d.,]+)\s*(mil|mill\.)\s*€/);
    let eur = 0;
    if (valor) {
      const n = parseFloat(valor[1].replace(/\./g, '').replace(',', '.'));
      eur = valor[2] === 'mil' ? n * 1000 : n * 1_000_000;
    }
    jugadores.push({
      nombre: limpiar(nombre[1]),
      pos: pos ? limpiar(pos[1]) : 'Mediocentro',
      edad: edad ? Number(edad[1] ?? edad[2]) : 24,
      valor: Math.round(eur),
    });
  }
  return jugadores;
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const archivoDe = (s) => norm(s).replace(/ /g, '_');

// --- qué clubes faltan ---
const dataTs = await readFile('src/data.ts', 'utf8');
const NOMBRES = await leerNombresDeClub();
const clubes = leerClubesDelJuego(dataTs);
const db = JSON.parse(await readFile('src/playersDatabase.json', 'utf8'));
const equiposDeLaBase = new Set(db.map(p => p.team_name?.toLowerCase()).filter(Boolean));

// Sólo los que tienen LIGA. data.ts no guarda nada más que clubes en objetos con `id` y `name`:
// también los logros ("Hat-Trick"), los patrocinadores ("Nutricionista de Estrellas"), los
// personajes y hasta las inversiones. Sin este filtro la lista pasaba de 36 a 203 y el script se
// ponía a buscar en Transfermarkt un club llamado "Corazón Ocupado".
const esClub = (c) => !!c.liga;

const faltan = pedidos.length
  ? clubes.filter(c => esClub(c) && pedidos.some(p => c.nombre.toLowerCase() === p.toLowerCase() || c.id === p))
  : clubes.filter(c => esClub(c) && (() => { const n = nombreEnLaBase(c, NOMBRES).toLowerCase(); return !n || !equiposDeLaBase.has(n); })());

console.log(`${faltan.length} club(es) sin plantel.\n`);
await mkdir('data/planteles_tm', { recursive: true });

const bajados = [], sinBajar = [];
for (const c of faltan) {
  const pais = PAIS_A_MANO[c.id] ?? PAIS_DE_LA_LIGA[c.liga];
  if (!pais) { sinBajar.push([c.nombre, `no sé de qué país es (liga "${c.liga}"): ponerlo en PAIS_A_MANO`]); continue; }

  try {
    // Con el id escrito a mano no hace falta buscar ni elegir: ya está decidido.
    if (A_MANO[c.id]) {
      const [slug, id] = A_MANO[c.id];
      const teamName = nombreEnLaBase(c, NOMBRES) || c.nombre;
      if (equiposDeLaBase.has(teamName.toLowerCase())) {
        sinBajar.push([c.nombre, `"${teamName}" ya es el plantel de otro club en la base`]);
        continue;
      }
      const url = `https://www.transfermarkt.co/${slug}/startseite/verein/${id}`;
      const players = parsearPlantel(await bajar(url));
      await dormir(1100);
      if (!players.length) { sinBajar.push([c.nombre, 'el id escrito a mano no muestra plantel']); continue; }
      const destino = `data/planteles_tm/${archivoDe(c.nombre)}.json`;
      await writeFile(destino, JSON.stringify({ fuente: url, teamName, players }, null, 2) + '\n', 'utf-8');
      console.log(`  ok     ${c.nombre.padEnd(32)} ${String(players.length).padStart(2)} jugadores  <- id ${id} (escrito a mano)`);
      bajados.push({ club: c, destino, teamName, n: players.length });
      continue;
    }

    const candidatos = await buscarClubes(c.nombre);
    await dormir(1100);
    const delPais = candidatos.filter(x => norm(x.pais) === norm(pais) && x.jugadores > 0);
    if (!delPais.length) {
      sinBajar.push([c.nombre, `en Transfermarkt no hay ningún "${c.nombre}" de ${pais} con plantel` +
        (candidatos.length ? ` (la búsqueda dio: ${candidatos.slice(0, 3).map(x => `${x.nombre} [${x.pais}]`).join(', ')})` : '')]);
      continue;
    }
    // FUERA LAS CATEGORIAS INFERIORES Y LOS FILIALES. Aparecen en la misma búsqueda, del mismo país
    // y a veces con MÁS jugadores que el primer equipo: la Primavera del Brescia tiene 35 y el
    // primer equipo 26, así que "el del plantel más grande" elegía a los pibes. Se descartan por
    // nombre, que es donde Transfermarkt los marca.
    const esInferior = (n) => /\b(?:u|sub|under)[- ]?\d{2}\b|primavera|giovanili|juvenil|juvenis|academy|youth|reserv|\bcj\b|\bii\b|\bb$/i.test(n);
    const mayores = delPais.filter(x => !esInferior(x.nombre));
    if (!mayores.length) {
      sinBajar.push([c.nombre, `sólo aparecen sus categorías inferiores (${delPais.map(x => x.nombre).join(', ')})`]);
      continue;
    }
    // Y entre los que quedan, el que más se parezca de nombre; a igualdad, el de más jugadores.
    const distintivas = (n) => new Set(norm(n).split(' ').filter(w => w.length > 2));
    const parecido = (x) => {
      const A = distintivas(c.nombre), B = distintivas(x.nombre);
      const comunes = [...A].filter(w => B.has(w)).length;
      return comunes / Math.max(1, Math.max(A.size, B.size));
    };
    const puntaje = (x) => (norm(x.nombre) === norm(c.nombre) ? 100 : 0)
      + parecido(x) * 50 + Math.min(x.jugadores, 40) / 10;
    const elegido = mayores.sort((a, b) => puntaje(b) - puntaje(a))[0];

    // UN PLANTEL DE PRIMERA NO TIENE NUEVE JUGADORES. Cuando el club de verdad no está en
    // Transfermarkt con ese nombre, el que gana es un homónimo amateur del mismo país: buscando
    // "FK Crvena Zvezda" ganó el "Crvena Zvezda Pavlis" con 5, y buscando "General Caballero" ganó
    // el ZC con 9 en vez del JLM que juega la primera. Los dos habrían entrado como buenos.
    //
    // Se avisa y no se baja: el club correcto se escribe en A_MANO con su id de Transfermarkt.
    if (elegido.jugadores < 15) {
      sinBajar.push([c.nombre, `el único "${c.nombre}" de ${pais} con plantel es "${elegido.nombre}" y tiene ${elegido.jugadores} jugadores` +
        `: no es un primer equipo. Si el club es otro, ponerlo en A_MANO con su id de Transfermarkt` +
        (mayores.length > 1 ? ` (los otros: ${mayores.slice(1, 4).map(x => `${x.nombre} ${x.jugadores}`).join(', ')})` : '')]);
      continue;
    }

    // El nombre con el que se guarda el plantel. Si ya existe en la base es de OTRO club: no se pisa.
    const teamName = nombreEnLaBase(c, NOMBRES) || c.nombre;
    if (equiposDeLaBase.has(teamName.toLowerCase())) {
      sinBajar.push([c.nombre, `"${teamName}" ya es el plantel de otro club en la base: hace falta un nombre propio`]);
      continue;
    }

    const url = `https://www.transfermarkt.co/${elegido.slug}/startseite/verein/${elegido.id}`;
    const players = parsearPlantel(await bajar(url));
    await dormir(1100);
    if (!players.length) { sinBajar.push([c.nombre, 'Transfermarkt no le muestra plantel']); continue; }

    const destino = `data/planteles_tm/${archivoDe(c.nombre)}.json`;
    await writeFile(destino, JSON.stringify({ fuente: url, teamName, players }, null, 2) + '\n', 'utf-8');
    console.log(`  ok     ${c.nombre.padEnd(32)} ${String(players.length).padStart(2)} jugadores  <- "${elegido.nombre}" [${elegido.pais}]`);
    bajados.push({ club: c, destino, teamName, n: players.length });
  } catch (e) {
    sinBajar.push([c.nombre, e.message]);
  }
}

console.log(`\n${bajados.length} planteles bajados.`);
if (sinBajar.length) {
  console.log(`\nNO SE BAJARON (${sinBajar.length}) — y es a propósito, no un error a corregir a la fuerza:`);
  for (const [club, por] of sinBajar) console.log(`  ${club.padEnd(32)} ${por}`);
}

if (ESCRIBIR) {
  console.log('\n--- metiéndolos en la base ---');
  for (const b of bajados) {
    const { stdout } = await run('node', ['scripts/actualizar_plantel_tm.mjs', b.destino]);
    console.log(`  ${b.club.nombre.padEnd(32)} ${stdout.trim().split('\n').pop()}`);
  }
} else if (bajados.length) {
  console.log('\n(--escribir los mete en la base; sin eso quedan sólo los archivos)');
}
