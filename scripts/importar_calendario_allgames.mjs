// Importa calendarios con FECHA REAL desde src/ALLgames.json, que ya estaba en el repo sin usarse.
//
// El archivo trae 88.958 partidos de Transfermarkt con fecha exacta, hasta la temporada 2025/26.
// Ahí están completas las cinco grandes de Europa -- Premier, LaLiga, Serie A, Bundesliga y
// Ligue 1 -- que eran justamente las ligas con CERO fechas reales en el juego. No hace falta
// scrapearlas: el dato ya estaba en casa.
//
// Uso:
//   node scripts/importar_calendario_allgames.mjs --dry    (solo reporta)
//   node scripts/importar_calendario_allgames.mjs          (escribe el JSON de salida)

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const FUENTE = 'src/ALLgames.json';
const SALIDA = 'data/calendarios_allgames/ligas.json';
// Volcado de CLUBS_DATABASE que genera el paso previo (ver README del script).
const CLUBES_TMP = 'data/calendarios_allgames/_clubes.json';

// competition_id de Transfermarkt -> cómo se llama la liga en data.ts.
// Solo las ligas que el juego ya modela: importar una que no existe generaría partidos huérfanos.
const LIGAS = {
  GB1: { league: 'Inglesa', nombre: 'Premier League' },
  ES1: { league: 'Española', nombre: 'LaLiga' },
  IT1: { league: 'Italiana', nombre: 'Serie A' },
  L1: { league: 'Alemana', nombre: 'Bundesliga' },
  FR1: { league: 'Francesa', nombre: 'Ligue 1' },
  NL1: { league: 'Holandesa', nombre: 'Eredivisie' },
  PO1: { league: 'Portuguesa', nombre: 'Liga Portugal' },
  BRA1: { league: 'Brasileña', nombre: 'Brasileirão' },
  MLS1: { league: 'Estadounidense', nombre: 'MLS' },
  TR1: { league: 'Turca', nombre: 'Süper Lig' },
  BE1: { league: 'Belga', nombre: 'Pro League' },
  // Copas nacionales. Van con kind 'domestic_cup' para que el motor las trate como copa y no como
  // liga: son a eliminación directa y no suman a la tabla.
  FAC: { league: 'Inglesa', nombre: 'FA Cup', kind: 'domestic_cup' },
  CGB: { league: 'Inglesa', nombre: 'EFL Cup', kind: 'domestic_cup' },
  CDR: { league: 'Española', nombre: 'Copa del Rey', kind: 'domestic_cup' },
  DFB: { league: 'Alemana', nombre: 'DFB-Pokal', kind: 'domestic_cup' },
  CIT: { league: 'Italiana', nombre: 'Coppa Italia', kind: 'domestic_cup' },
};

// Nombre en ALLgames -> nombre en data.ts, cuando la normalización no alcanza porque las dos
// fuentes escriben el club de forma distinta ("Deportivo Alavés" vs "D. Alavés", "Inter Milan" vs
// "Inter"). Se resuelven a mano y solo dentro de su liga.
const ALIAS = {
  // España
  'Deportivo Alavés': 'D. Alavés', 'Real Betis Balompié': 'Real Betis', 'Real Oviedo': 'R. Oviedo',
  'Athletic Bilbao': 'Athletic Club', 'Celta de Vigo': 'Celta', 'RCD Espanyol Barcelona': 'RCD Espanyol',
  'Real Sociedad': 'Real Sociedad', 'Girona FC': 'Girona FC', 'Levante UD': 'Levante UD',
  'Getafe CF': 'Getafe CF', 'Elche CF': 'Elche CF', 'Sevilla FC': 'Sevilla FC', 'FC Barcelona': 'FC Barcelona',
  'Valencia CF': 'Valencia CF', 'RCD Mallorca': 'RCD Mallorca', 'Rayo Vallecano': 'Rayo Vallecano',
  'CA Osasuna': 'CA Osasuna', 'Villarreal CF': 'Villarreal CF', 'Atlético de Madrid': 'Atlético de Madrid',
  // Italia
  'Atalanta BC': 'Atalanta', 'Pisa Sporting Club': 'Pisa', 'Cagliari Calcio': 'Cagliari',
  'ACF Fiorentina': 'Fiorentina', 'Como 1907': 'Como', 'Genoa CFC': 'Genoa',
  'Società Sportiva Lazio S.p.A.': 'Lazio', 'Inter Milan': 'Inter', 'Parma Calcio 1913': 'Parma',
  'Associazione Sportiva Roma': 'Roma', 'Bologna Football Club 1909': 'Bologna',
  'Udinese Calcio': 'Udinese', 'AC Milan': 'Milan', 'Juventus FC': 'Juventus',
  'Torino Calcio': 'Torino', 'US Lecce': 'Lecce', 'Hellas Verona': 'Hellas Verona',
  'US Sassuolo': 'Sassuolo', 'US Cremonese': 'Cremonese', 'SSC Napoli': 'Napoli',
  // Alemania
  'Bayern Munich': 'FC Bayern München', 'TSG 1899 Hoffenheim': 'TSG Hoffenheim',
  '1. Fußballclub Heidenheim 1846': 'FC Heidenheim', 'Borussia Mönchengladbach': 'Borussia Mönchengladbach',
  '1. FC Köln': 'FC Köln', '1. FSV Mainz 05': 'Mainz 05', '1. FC Union Berlin': 'Union Berlin',
  'FC St. Pauli': 'St. Pauli', 'SV Werder Bremen': 'SV Werder Bremen',
  // Francia
  'Olympique Lyon': 'Olympique Lyonnais', 'Stade Brestois 29': 'Brest', 'LOSC Lille': 'Lille OSC',
  'FC Metz': 'Metz', 'RC Strasbourg Alsace': 'Racing Club de Strasbourg Alsace',
  'Olympique Marseille': 'Olympique de Marseille', 'Paris Saint-Germain': 'Paris Saint-Germain',
  'OGC Nice': 'Nice', 'RC Lens': 'Lens', 'Stade Rennais FC': 'Stade Rennais FC',
  'AJ Auxerre': 'Auxerre', 'Angers SCO': 'Angers', 'Toulouse FC': 'Toulouse',
  'FC Nantes': 'Nantes', 'Le Havre AC': 'Le Havre', 'FC Lorient': 'FC Lorient',
  // Holanda
  'Fortuna Sittardia Combinatie': 'Fortuna Sittard', 'Excelsior Rotterdam': 'Excelsior',
  'Feyenoord Rotterdam': 'Feyenoord', 'FC Volendam': 'Volendam', 'AFC Ajax': 'Ajax',
  'PSV Eindhoven': 'PSV', 'FC Twente Enschede': 'FC Twente', 'FC Groningen': 'Groningen',
  'FC Utrecht': 'FC Utrecht', 'Go Ahead Eagles': 'Go Ahead Eagles',
};

/** Nombre reducido a lo comparable: sin acentos, sin puntuación y sin siglas societarias. */
const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\b(fc|cf|sc|cd|ca|ac|afc|sv|vfb|vfl|tsg|bsc|rc|as|ss|ssc|us|aj|og|ogc|losc|rcd|ud|club|de|del|la|el|los|las|1|and)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function main() {
  console.log(`leyendo ${FUENTE}...`);
  const todos = JSON.parse(await readFile(FUENTE, 'utf8'));

  // Los clubes del juego salen del módulo COMPILADO, no de leer data.ts como texto: los clubes
  // están escritos en una sola línea por objeto, así que un regex por `name:` no los encontraba
  // y el emparejamiento daba 0 de 380.
  const { clubs: clubesJuego } = JSON.parse(await readFile(CLUBES_TMP, 'utf8'));
  const porNorm = new Map();
  for (const c of clubesJuego) {
    // Solo se empareja dentro de la MISMA liga: hay 7 pares de clubes homónimos entre países
    // (Everton chileno/inglés, Liverpool uruguayo/inglés...) y emparejar global mezclaría países.
    const k = `${c.league}|${norm(c.name)}`;
    if (!porNorm.has(k)) porNorm.set(k, c.name);
  }

  const salida = [];
  const sinMapear = new Map();

  for (const [compId, cfg] of Object.entries(LIGAS)) {
    const deLaLiga = todos.filter(g => g.competition_id === compId);
    if (!deLaLiga.length) { console.log(`${cfg.nombre.padEnd(16)} SIN DATOS`); continue; }

    // La temporada más reciente disponible.
    const season = Math.max(...deLaLiga.map(g => g.season));
    const partidos = deLaLiga.filter(g => g.season === season && g.date);

    let mapeados = 0;
    const matches = [];
    for (const g of partidos) {
      const busca = n => porNorm.get(`${cfg.league}|${norm(ALIAS[n] ?? n)}`);
      const home = busca(g.home_club_name);
      const away = busca(g.away_club_name);
      if (!home) sinMapear.set(g.home_club_name, cfg.league);
      if (!away) sinMapear.set(g.away_club_name, cfg.league);
      // Solo entran los partidos con LOS DOS clubes reconocidos: uno a medias dejaría un rival
      // fantasma en el calendario.
      if (!home || !away) continue;
      matches.push({ date: g.date, home, away });
      mapeados++;
    }

    const cobertura = partidos.length ? mapeados / partidos.length : 0;
    const fechas = matches.map(m => m.date).sort();
    // Por debajo del 70% el calendario queda tan incompleto que es peor que el generado: se
    // descarta entero en vez de dejar una liga con la mitad de las fechas faltando.
    if (cobertura < 0.7 && (cfg.kind ?? 'league') === 'league') {
      console.log(`${cfg.nombre.padEnd(16)} DESCARTADA -- solo ${(cobertura*100).toFixed(0)}% de los clubes existen en el juego`);
      continue;
    }
    salida.push({
      id: compId.toLowerCase(),
      name: cfg.nombre,
      kind: cfg.kind ?? 'league',
      league: cfg.league,
      firstDate: fechas[0] ?? null,
      lastDate: fechas[fechas.length - 1] ?? null,
      matches: matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home)),
    });
    console.log(`${cfg.nombre.padEnd(16)} temp.${season} ${String(mapeados).padStart(4)}/${String(partidos.length).padStart(4)} partidos  ${fechas[0] ?? '-'} .. ${fechas[fechas.length - 1] ?? '-'}`);
  }

  const total = salida.reduce((n, c) => n + c.matches.length, 0);
  console.log(`\ntotal: ${total} partidos en ${salida.length} competiciones`);

  if (sinMapear.size) {
    console.log(`\nclubes de la fuente que NO existen en el juego (${sinMapear.size}) -- sus partidos se descartan:`);
    for (const [n, l] of [...sinMapear].slice(0, 30)) console.log(`   ${l.padEnd(16)} ${n}`);
    if (sinMapear.size > 30) console.log(`   ... y ${sinMapear.size - 30} más`);
  }

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }

  await mkdir('data/calendarios_allgames', { recursive: true });
  await writeFile(SALIDA, JSON.stringify(salida), 'utf8');
  console.log(`\n-> ${SALIDA}`);
}

main().catch(e => { console.error(e); process.exit(1); });
