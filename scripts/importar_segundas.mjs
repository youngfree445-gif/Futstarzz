/**
 * Injerta las Segundas divisiones europeas en src/realCalendarDates.ts.
 *
 *   node scripts/importar_segundas.mjs --dry     (sólo reporta)
 *   node scripts/importar_segundas.mjs
 *
 * Entrada: data/calendarios_segundas/*.json, bajados de Transfermarkt con
 * scripts/scrape_transfermarkt.mjs (temporada 2025/26, saison_id 2025). Son los calendarios REALES,
 * así que no hay que correrles las fechas: la 2025/26 es la misma que ya corre en Premier, LaLiga,
 * Bundesliga, Ligue 1 y Eredivisie dentro del juego.
 *
 * INJERTA, NO REGENERA. Regenerar pasa por _import_clubs/clubs.js, que es una copia vieja de la
 * base, y deshace correcciones hechas a mano en src/data.ts -- ya se comió cuatro desambiguaciones
 * de homónimos una vez ("Nacional" pasó de 69 partidos a 211). Acá se lee el archivo actual, se le
 * agregan las competiciones nuevas y se comprueba que ninguna de las viejas cambie ni un club.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data.ts';

const DRY = process.argv.includes('--dry');
const DESTINO = 'src/realCalendarDates.ts';
const ORIGEN = 'data/calendarios_segundas';

const FUENTES = [
  { archivo: 'gb2_championship.json', id: 'gb2', name: 'Championship',       league: 'Inglesa' },
  { archivo: 'es2_hypermotion.json',  id: 'es2', name: 'LaLiga Hypermotion', league: 'Española' },
  { archivo: 'l2_bundesliga2.json',   id: 'l2',  name: '2. Bundesliga',      league: 'Alemana' },
  { archivo: 'fr2_ligue2.json',       id: 'fr2', name: 'Ligue 2',            league: 'Francesa' },
  // Holanda entra con las DOS: la Eredivisie del juego venía de otra temporada, así que ADO Den
  // Haag, SC Cambuur y Willem II figuraban en Primera Y en la Eerste Divisie real. Bajando las dos
  // de la misma fuente y el mismo año quedan coherentes entre sí.
  { archivo: 'nl1_eredivisie.json',   id: 'ned1', name: 'Eredivisie',        league: 'Holandesa' },
  { archivo: 'nl2_eerste.json',       id: 'nl2', name: 'Eerste Divisie',     league: 'Holandesa' },
];

/**
 * Alias de los nombres que Transfermarkt abrevia y el emparejador automático no puede resolver
 * solo. Sólo van acá los AMBIGUOS o los que no comparten prefijo: "Birmingham" -> "Birmingham City"
 * lo resuelve el prefijo, pero "QPR" -> "Queens Park Rangers" no comparte ni una letra.
 */
const ALIAS = {
  Inglesa: {
    'QPR': 'Queens Park Rangers',
    'Sheff Utd': 'Sheffield United',
    'West Brom': 'West Bromwich Albion',
  },
  'Española': {
    'Dep. La Coruña': 'RC Deportivo',
    'Sporting Gijón': 'R. Sporting',
    'Racing': 'R. Racing Club',
    'CyD Leonesa': 'Cultural Leonesa',
    'Real Valladolid': 'R. Valladolid CF',
  },
  Alemana: {
    "1.FC K'lautern": '1. FC Kaiserslautern',
    '1.FC Magdeburg': 'Magdeburg',
    '1.FC Nuremberg': '1. FC Nürnberg',
    'Arm. Bielefeld': 'Arminia Bielefeld',
    'E. Braunschweig': 'Eintracht Braunschweig',
    'F. Düsseldorf': 'Fortuna Düsseldorf',
    'Pr. Münster': 'Preußen Münster',
  },
  Francesa: {},
  Holandesa: {
    'Ajax U21': 'Jong Ajax',
    'PSV U21': 'Jong PSV',
    'AZ Alkmaar U21': 'Jong AZ',
    'Utrecht U21': 'Jong FC Utrecht',
  },
};

const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\b(fc|cf|sc|ac|as|ss|us|ud|sd|cd|ad|rc|r|bp|af|ea|estac|usl|sbv|mvv|top|de|del|la|el|the)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function main() {
  const actual = await readFile(DESTINO, 'utf8');
  const ini = actual.indexOf('[{');
  const fin = actual.lastIndexOf(']') + 1;
  const head = actual.slice(0, ini);
  const tail = actual.slice(fin);
  const existentes = JSON.parse(actual.slice(ini, fin));

  const nuevas = [];
  for (const f of FUENTES) {
    let datos;
    try { datos = JSON.parse(await readFile(`${ORIGEN}/${f.archivo}`, 'utf8')); }
    catch { console.log(`${f.name.padEnd(20)} SIN ARCHIVO, se saltea`); continue; }
    const crudos = datos.matches ?? [];
    if (!crudos.length) { console.log(`${f.name.padEnd(20)} VACÍO, se saltea`); continue; }

    // Los clubes del país que hay en el juego. La división NO se filtra: el calendario es real y
    // ya refleja ascensos y descensos que data.ts todavía no tiene.
    const delPais = CLUBS.filter(c => c.league === f.league);
    const porNombre = new Map(delPais.map(c => [norm(c.name), c.name]));
    const alias = ALIAS[f.league] ?? {};

    const resolver = nombre => {
      if (alias[nombre]) return porNombre.get(norm(alias[nombre])) ?? null;
      const n = norm(nombre);
      const directo = porNombre.get(n);
      if (directo) return directo;
      // Un FILIAL no es su primer equipo. La Eerste Divisie la juegan Jong Ajax, Jong PSV, Jong AZ
      // y Jong Utrecht, que Transfermarkt escribe "Ajax U21", "PSV U21", "AZ Alkmaar U21". Todos
      // comparten prefijo con el club grande, así que el emparejador los daba por iguales y metía
      // al Ajax y al PSV a jugar la Segunda -- además de la Eredivisie, en la misma temporada.
      //
      // La regla es simétrica: un filial sólo puede cruzar con un filial, y un primer equipo sólo
      // con un primer equipo.
      const marcaDeFilial = x => /\b(u ?\d+|jong|ii|b)\s*$/i.test(x.trim());
      const filialCrudo = marcaDeFilial(nombre);

      // Prefijo, pero sólo si es INEQUÍVOCO: "Birmingham" -> "Birmingham City". Con dos candidatos
      // no hay forma de saber cuál es, y adivinar es como se cruzaron los planteles una vez.
      const hits = [...porNombre].filter(([k, nombreReal]) => {
        if (marcaDeFilial(nombreReal) !== filialCrudo) return false;
        return k === n || k.startsWith(n) || n.startsWith(k);
      });
      return hits.length === 1 ? hits[0][1] : null;
    };

    const clubesCrudos = [...new Set(crudos.flatMap(m => [m.home, m.away]))].sort();
    const mapa = new Map();
    const sinResolver = [];
    for (const n of clubesCrudos) {
      const r = resolver(n);
      if (r) mapa.set(n, r); else sinResolver.push(n);
    }

    // SUSTITUCIÓN. El calendario real trae clubes que la base no tiene (el Championship 2025/26
    // juega con Leicester, Sheffield Wednesday y Oxford United, que en data.ts no existen). En vez
    // de perder sus partidos -- lo que rompería el round-robin y dejaría clubes con la mitad de
    // fechas -- se les da el lugar a los clubes de Segunda del país que este calendario no usa.
    // El cuadro queda intacto y todos los que juegan la Segunda son clubes de ese país.
    const yaUsados = new Set(mapa.values());
    const libres = delPais
      .filter(c => (c.division ?? 1) === 2 && !yaUsados.has(c.name))
      .sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))
      .map(c => c.name);
    // GUARDIA. Sustituir sólo vale cuando el club REALMENTE no está en la base. Si el nombre sin
    // resolver comparte una palabra con algún club libre, lo que falta es un alias, no el club --
    // y sustituir ahí baraja clubes existentes entre sí. Pasó: "1.FC Magdeburg" terminó jugando
    // los partidos del Nürnberg y "Arm. Bielefeld" los del Fortuna Düsseldorf, seis clubes
    // alemanes cruzados en silencio. El importador tiene que frenar, no adivinar.
    const palabras = s => new Set(norm(s).split(' ').filter(p => p.length >= 4));
    const sospechosos = [];
    for (const n of sinResolver) {
      const pn = palabras(n);
      const parecido = libres.find(l => [...palabras(l)].some(p => pn.has(p)));
      if (parecido) sospechosos.push(`"${n}" se parece a "${parecido}" -- falta un ALIAS, no es una ausencia`);
    }
    if (sospechosos.length) {
      console.log(`\n${f.name}: NO SE IMPORTA, hay ${sospechosos.length} nombre(s) sin resolver que sí existen:`);
      for (const s of sospechosos) console.log(`   ${s}`);
      continue;
    }

    const sustituidos = [];
    for (const n of sinResolver) {
      const reemplazo = libres.shift();
      if (!reemplazo) { console.log(`   ${f.name}: sin reemplazo para "${n}"`); continue; }
      mapa.set(n, reemplazo);
      sustituidos.push(`${n} -> ${reemplazo}`);
    }

    // SOLAPE CON PRIMERA. El calendario de Segunda es real, así que trae a los que ascendieron y
    // descendieron -- y en el juego esos pueden seguir en Primera. Un club en las dos ligas juega
    // el doble de partidos de liga en la misma temporada. Pasó con la Serie B (Hellas Verona, Pisa
    // y Cremonese) y se detectó a mano; acá se detecta solo.
    // La Primera contra la que se compara NO puede ser una que este mismo import va a reemplazar:
    // Holanda entra con las dos divisiones a la vez, y comparando contra la Eredivisie vieja -- de
    // otra temporada, con ADO Den Haag y Willem II en Primera -- la guardia se disparaba contra un
    // dato que estaba por dejar de existir. Se mira primero lo ya construido en esta corrida.
    const enPrimera = new Set();
    const aReemplazar = new Set(FUENTES.map(x => x.id));
    const primeraDelPais = nuevas.find(c => c.kind === 'league' && c.league === f.league && c.id !== f.id)
      ?? existentes.find(c => c.kind === 'league' && c.league === f.league && !aReemplazar.has(c.id));
    if (primeraDelPais) for (const m of primeraDelPais.matches) { enPrimera.add(m.home); enPrimera.add(m.away); }
    const solapan = [...new Set(mapa.values())].filter(n => enPrimera.has(n));
    if (solapan.length) {
      console.log(`
${f.name}: NO SE IMPORTA, ${solapan.length} club(es) jugarían TAMBIÉN en ${primeraDelPais.name}:`);
      console.log(`   ${solapan.join(' · ')}`);
      console.log('   (son los que ascendieron/descendieron: hay que sustituirlos o sacarlos)');
      continue;
    }

    const matches = [];
    for (const m of crudos) {
      const home = mapa.get(m.home), away = mapa.get(m.away);
      if (!home || !away || home === away) continue;
      matches.push({ date: m.date, home, away, ...(m.round ? { round: m.round } : {}) });
    }
    const fechas = matches.map(m => m.date).sort();

    nuevas.push({
      id: f.id, name: f.name, kind: 'league', league: f.league,
      firstDate: fechas[0] ?? null, lastDate: fechas[fechas.length - 1] ?? null,
      matches: matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home)),
    });

    const porClub = {};
    for (const m of matches) { porClub[m.home] = (porClub[m.home] ?? 0) + 1; porClub[m.away] = (porClub[m.away] ?? 0) + 1; }
    const v = Object.values(porClub);
    console.log(`${f.name.padEnd(20)} ${matches.length}/${crudos.length} partidos · ${new Set([...matches.flatMap(m => [m.home, m.away])]).size} clubes · ${Math.min(...v)}-${Math.max(...v)} por club · ${fechas[0]}..${fechas[fechas.length - 1]}`);
    if (sustituidos.length) console.log(`   sustituidos: ${sustituidos.join(' · ')}`);
  }

  // Comprobación de injerto: ninguna competición vieja puede cambiar.
  const ids = new Set(nuevas.map(c => c.id));
  const conservadas = existentes.filter(c => !ids.has(c.id));
  if (conservadas.length !== existentes.length) {
    console.log(`\nATENCIÓN: ${existentes.length - conservadas.length} competiciones existentes serían reemplazadas`);
  }
  const final = [...conservadas, ...nuevas];
  console.log(`\n${existentes.length} -> ${final.length} competiciones | ${final.reduce((n, c) => n + c.matches.length, 0)} partidos`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }
  await writeFile(DESTINO, `${head}${JSON.stringify(final)}${tail}`, 'utf8');
  console.log(`-> ${DESTINO}`);
}

main();
