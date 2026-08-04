// Mete en src/realCalendarDates.ts los calendarios bajados por scrape_espn_liga.mjs.
//
// El emparejamiento es por NOMBRE dentro de la misma liga del juego, nunca global: los nombres se
// repiten entre países (Everton, Liverpool, Nacional, Internacional, Fortaleza) y cruzarlos ya nos
// hizo mezclar planteles una vez. Acotando a la liga, "Fortaleza" brasileño no puede pisar al
// "Fortaleza FC" colombiano.
//
// Uso:
//   node scripts/importar_calendarios_espn_liga.mjs --dry     (solo reporta, no escribe)
//   node scripts/importar_calendarios_espn_liga.mjs

import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const DESTINO = 'src/realCalendarDates.ts';

// archivo -> cómo entra al juego. `league` es la liga de data.ts contra la que se emparejan los
// nombres; `division` acota más todavía (la Serie B brasileña solo mira clubes con division 2).
const FUENTES = [
  { archivo: 'bra.1_liga.json',              id: 'bra1', name: 'Brasileirão Serie A', kind: 'league', league: 'Brasileña', division: 1 },
  { archivo: 'bra.2_liga.json',              id: 'bra2', name: 'Brasileirão Serie B', kind: 'league', league: 'Brasileña', division: 2 },
  { archivo: 'bra.copa_do_brazil_liga.json', id: 'copabr', name: 'Copa do Brasil',    kind: 'domestic_cup', league: 'Brasileña' },
  { archivo: 'ita.1_liga.json',              id: 'ita1', name: 'Serie A',             kind: 'league', league: 'Italiana', division: 1 },
  { archivo: 'ita.2_liga.json',              id: 'ita2', name: 'Serie B',             kind: 'league', league: 'Italiana' },
  { archivo: 'ned.1_liga.json', id: 'ned1', name: 'Eredivisie',        kind: 'league', league: 'Holandesa' },
  { archivo: 'por.1_liga.json', id: 'por1', name: 'Primeira Liga',     kind: 'league', league: 'Portuguesa' },
  { archivo: 'usa.1_liga.json', id: 'usa1', name: 'MLS',               kind: 'league', league: 'Estadounidense' },
  { archivo: 'mex.1_liga.json', id: 'mex1', name: 'Liga MX',           kind: 'league', league: 'Mexicana' },
  { archivo: 'uru.1_liga.json', id: 'uru1', name: 'Primera División Uruguaya', kind: 'league', league: 'Uruguaya' },
  { archivo: 'ecu.1_liga.json', id: 'ecu1', name: 'LigaPro Ecuador',   kind: 'league', league: 'Ecuatoriana' },
  { archivo: 'chi.1_liga.json', id: 'chi1', name: 'Primera División de Chile', kind: 'league', league: 'Chilena' },
  { archivo: 'per.1_liga.json', id: 'per1', name: 'Liga 1 Perú',       kind: 'league', league: 'Peruana' },
  { archivo: 'par.1_liga.json', id: 'par1', name: 'Primera División Paraguaya', kind: 'league', league: 'Paraguaya' },
  { archivo: 'bol.1_liga.json', id: 'bol1', name: 'División Profesional Boliviana', kind: 'league', league: 'Boliviana' },
  { archivo: 'ven.1_liga.json', id: 'ven1', name: 'Venezuela Primera División', kind: 'league', league: 'Venezolana' },
];

// Los nombres de ESPN no coinciden siempre con los del juego. Solo lo mínimo verificado a mano.
const ALIAS = {
  Brasileña: {
    'Red Bull Bragantino': 'RB Bragantino',
    'Atlético-MG': 'Atlético Mineiro',
    'Athletico-PR': 'Athletico Paranaense',
    'América-MG': 'América Mineiro',
    'Vasco da Gama': 'Vasco da Gama',
    // Los dos Botafogo: el de Río juega la Serie A y el de Ribeirão Preto la B. El alias solo no
    // alcanzaba porque norm() le borra el "FC" y ambos colapsaban en "botafogo"; por eso el -SP
    // lleva el nombre de su ciudad en data.ts.
    'Botafogo': 'Botafogo',
    'Botafogo-SP': 'Botafogo de Ribeirão Preto',
    'Atlético-GO': 'Atlético Goianiense',
    'Remo': 'Clube do Remo',
    // El brasileño lleva su nombre completo para no colisionar con el Athletic de Bilbao.
    'Athletic': 'Athletic Club de São João del-Rei',
  },
  // ESPN en español castellaniza varios nombres italianos ("Génova" por Genoa, "Bolonia" por
  // Bologna) y usa el nombre corto en otros. Sin esto quedaban 15 clubes sin mapear.
  Italiana: {
    'Internazionale': 'Inter',
    'Inter Milan': 'Inter',
    'AC Milan': 'Milan',
    'AS Roma': 'Roma',
    'Génova': 'Genoa',
    'Bolonia': 'Bologna',
    'Nápoles': 'Napoli',
    'Turín': 'Torino',
    'Verona': 'Hellas Verona',
    'Vicenza': 'LR Vicenza',
    'US Avellino': 'Avellino',
    'Virtus Entella': 'Virtus Entella',
  },
  Holandesa: {
    'Ajax Amsterdam': 'Ajax',
    'PSV Eindhoven': 'PSV',
    'Feyenoord Rotterdam': 'Feyenoord',
    'Excelsior': 'Excelsior Rotterdam',
    'Heerenveen': 'SC Heerenveen',
  },
  Portuguesa: {
    'C.D. Nacional': 'CD Nacional',
    'Vitória de Guimaraes': 'Vitória SC',
    'Braga': 'SC Braga',
    'FC Famalicao': 'FC Famalicão',
    'Benfica': 'SL Benfica',
    'Santa Clara': 'CD Santa Clara',
  },
  Estadounidense: {
    'D.C. United': 'DC United',
    'Chicago Fire FC': 'Chicago Fire',
    'Houston Dynamo FC': 'Houston Dynamo',
    'Minnesota United FC': 'Minnesota United',
    'Red Bull New York': 'NY Red Bulls',
    'New England Revolution': 'New England',
    'Orlando City SC': 'Orlando City',
    'Philadelphia Union': 'Philadelphia',
    'San Jose Earthquakes': 'San Jose',
    'Seattle Sounders FC': 'Seattle Sounders',
    'Sporting Kansas City': 'Sporting KC',
  },
  Mexicana: {
    'FC Juarez': 'FC Juárez',
    'Pumas UNAM': 'Pumas U.N.A.M.',
    'Santos': 'Santos Laguna',
    'Tigres UANL': 'Tigres U.A.N.L.',
    'Tijuana': 'Club Tijuana',
  },
  Uruguaya: {
    'Central Español Fútbol Club': 'C. Español',
    'Juventud': 'Juventud de Las Piedras',
    'Liverpool': 'Liverpool de Montevideo',
    'Deportivo Maldonado': 'Maldonado',
    'Racing (Montevideo)': 'Racing Club',
  },
  Ecuatoriana: {
    'Libertad (Ecuador)': 'Libertad FC',
    'Liga de Quito': 'LDU Quito',
    'Manta F.C.': 'Manta FC',
    'Universidad Católica (Quito)': 'Universidad Católica',
    'Guayaquil City FC': 'Guayaquil City',
  },
  Chilena: {
    'Colo Colo': 'Colo-Colo',
    'Everton CD': 'Everton',
    'Deportes Concepcion': 'Deportes Concepción',
    'La Serena': 'Deportes La Serena',
  },
  Peruana: {
    'Cienciano del Cusco': 'Cienciano',
    'Deportivo Moquegua': 'Moquegua',
  },
  Paraguaya: {
    'Club Olimpia': 'Olimpia',
    'Nacional Asunción': 'Nacional',
    'Deportivo Recoleta': 'Recoleta',
    'Rubio Ñú': 'Rubio Ñu',
  },
  Boliviana: {
    'ABB': 'Club ABB',
    'GV San José': 'Gualberto Villarroel',
  },
  Venezolana: {
    'Anzoátegui FC': 'Deportivo Anzoátegui',
    'Carabobo': 'Carabobo FC',
    'Metropolitanos': 'Metropolitanos FC',
    'Portuguesa': 'Portuguesa FC',
    'UCV FC': 'Universidad Central',
  },
};

const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\b(fc|cf|sc|ac|as|ss|us|calcio|club|de|del|da|do|the)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function main() {
  const { CLUBS_DATABASE } = await import('../_import_clubs/clubs.js');

  const txt = await readFile(DESTINO, 'utf8');
  const [head, arr] = txt.split('export const DATED_CALENDARS: DatedCompetition[] = ');
  const actuales = JSON.parse(arr.trim().replace(/;$/, ''));

  const nuevas = [];
  for (const f of FUENTES) {
    let datos;
    try {
      datos = JSON.parse(await readFile(`data/calendarios_espn/${f.archivo}`, 'utf8'));
    } catch { console.log(`(falta ${f.archivo}, se saltea)`); continue; }

    // Índice de los clubes de ESA liga. A propósito NO se filtra por división: el calendario de
    // ESPN es de 2026 y ya refleja el ascenso/descenso de 2025, mientras que data.ts guarda las
    // divisiones del año anterior. Filtrando, los ocho clubes que cambiaron de categoría en Brasil
    // (Chapecoense, Coritiba, Athletico-PR y Remo arriba; Fortaleza, Ceará, Sport y Juventude
    // abajo) quedaban sin mapear y se perdían sus partidos. La liga sola ya desambigua los
    // homónimos entre países, que es de lo que hay que cuidarse.
    const candidatos = CLUBS_DATABASE.filter(c => c.league === f.league);
    const porNombre = new Map();
    for (const c of candidatos) porNombre.set(norm(c.name), c.name);

    const alias = ALIAS[f.league] ?? {};
    const resolver = nombre => {
      const directo = porNombre.get(norm(alias[nombre] ?? nombre));
      if (directo) return directo;
      // Si hay alias explícito y aun así no matcheó, es un error de datos: NO se cae al prefijo,
      // porque el alias justamente existe para desambiguar y adivinar lo arruinaría.
      if (alias[nombre]) return null;
      // Último recurso: prefijo, que atrapa "Napoli" vs "SSC Napoli". Solo si es INEQUÍVOCO: con
      // dos candidatos no hay forma de saber cuál es. "Botafogo" matcheaba "Botafogo FC" (el -SP)
      // y los dos clubes terminaban jugando el mismo día.
      const n = norm(nombre);
      const hits = [...porNombre].filter(([k]) => k.startsWith(n) || n.startsWith(k));
      return hits.length === 1 ? hits[0][1] : null;
    };

    const matches = [];
    const sinMapear = new Set();
    for (const p of datos.partidos) {
      const home = resolver(p.local), away = resolver(p.visita);
      if (!home) sinMapear.add(p.local);
      if (!away) sinMapear.add(p.visita);
      // Un partido con un solo club reconocido dejaría un rival fantasma en el calendario.
      if (!home || !away || home === away) continue;
      matches.push({ date: p.fecha, home, away, ...(p.ronda ? { round: p.ronda } : {}) });
    }

    const fechas = matches.map(m => m.date).sort();
    nuevas.push({
      id: f.id, name: f.name, kind: f.kind, league: f.league,
      firstDate: fechas[0] ?? null, lastDate: fechas[fechas.length - 1] ?? null,
      matches: matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home)),
    });

    const pct = datos.partidos.length ? Math.round(matches.length / datos.partidos.length * 100) : 0;
    console.log(`${f.name.padEnd(22)} ${String(matches.length).padStart(3)}/${String(datos.partidos.length).padStart(3)} (${pct}%)  ${fechas[0]} .. ${fechas[fechas.length - 1]}`);
    if (sinMapear.size) console.log(`   sin mapear (${sinMapear.size}): ${[...sinMapear].slice(0, 10).join(', ')}${sinMapear.size > 10 ? '…' : ''}`);
  }

  const ids = new Set(nuevas.map(c => c.id));
  const final = [...actuales.filter(c => !ids.has(c.id)), ...nuevas];
  console.log(`\n${actuales.length} -> ${final.length} competiciones | ${final.reduce((n, c) => n + c.matches.length, 0)} partidos`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }
  await writeFile(DESTINO, `${head}export const DATED_CALENDARS: DatedCompetition[] = ${JSON.stringify(final)};\n`, 'utf8');
  console.log(`-> ${DESTINO}`);
}

main().catch(e => { console.error(e); process.exit(1); });
