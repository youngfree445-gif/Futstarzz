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
  // La Serie A de ESPN (ita.1) NO entra: ya viene de ALLgames como `it1` con la 2025/26, que es la
  // temporada en curso cuando arranca la carrera -- igual que Premier, LaLiga, Bundesliga y Ligue
  // 1. Cargar las dos hacía que un club italiano jugara 57 partidos de liga en una misma temporada
  // (el resto juega 17-19), porque fixturesForClub le devolvía las dos temporadas juntas.
  //
  // La Serie B sí entra, y es la única fuente que hay para ella. Viene con la 2026/27, así que se
  // corre un año atrás para quedar alineada con la Serie A: sin eso, un club de Serie B tendría su
  // primer partido en agosto de 2026 y la carrera le "arrancaría" ahí en vez de en enero -- el
  // mismo bug que ya pasó con Barranquilla FC ("por qué inicia la carrera allí y no en enero?").
  // Corrida, un club de Serie B llega al 12 de enero con media temporada por delante, igual que
  // uno de Serie A. Es para lo que sirve una temporada de otro año: como molde.
  //
  // `sustituir`: el archivo es la 2026/27, o sea DESPUÉS del descenso, así que trae a Hellas
  // Verona, Pisa y Cremonese -- que en el juego siguen en la Serie A 2025/26. Sin esto esos tres
  // jugarían 76 partidos de liga en una misma temporada (38 en cada categoría). Se los reemplaza
  // por los tres clubes de Serie B de mayor reputación que este calendario no usa, así el
  // round-robin queda intacto (38 partidos por club, sin excepción) y todos los que juegan la
  // Serie B son clubes de Serie B de verdad.
  { archivo: 'ita.2_liga.json', id: 'ita2', name: 'Serie B', kind: 'league', league: 'Italiana', desplazarAnios: -1,
    sustituir: { 'Hellas Verona': 'Monza', 'Pisa': 'Venezia', 'Cremonese': 'Frosinone' } },
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

/** Misma fecha, `anios` años después (o antes, con negativo). El 29/2 cae en 28/2 los no bisiestos. */
function correrAnios(date, anios) {
  if (!anios) return date;
  const [a, m, d] = date.split('-').map(Number);
  const anio = a + anios;
  const ultimoDia = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  return `${anio}-${String(m).padStart(2, '0')}-${String(Math.min(d, ultimoDia)).padStart(2, '0')}`;
}

// ============================================================================================
// ATENCIÓN ANTES DE CORRER ESTE SCRIPT
// ============================================================================================
//
// Lee la base de clubes de `_import_clubs/clubs.js`, que es una COPIA VIEJA -- no src/data.ts.
// Regenerar a ciegas revierte todo lo que se corrigió a mano en data.ts desde esa copia. Medido el
// 12 de agosto de 2026, una regeneración deshizo cuatro desambiguaciones de homónimos:
//
//   Nacional de Asunción          -> Nacional            (se fusionó con el Nacional de Uruguay)
//   Universidad Católica de Quito -> Universidad Católica (con la chilena)
//   Leones FC de Ecuador          -> Leones FC            (con el colombiano)
//   Everton de Viña del Mar       -> Everton              (con el inglés)
//
// El calendario se indexa por NOMBRE de club, así que fusionarlos hace que uno juegue los partidos
// del otro: "Nacional" pasó de 69 partidos a 211, y el validador de calendario saltó de 30 a 97
// casos de menos de dos días de descanso.
//
// Poner alias acá NO alcanza: apuntarían a nombres que la copia vieja no tiene, el club no
// resolvería y se perderían sus partidos (medido: la LigaPro de Ecuador cayó de 228 a 198).
//
// Lo que hay que hacer ANTES de regenerar es refrescar `_import_clubs/clubs.js` desde src/data.ts.
// Mientras tanto, si sólo hace falta agregar UNA competición, conviene injertarla en el archivo
// existente en vez de regenerar todo.
// ============================================================================================

// Los nombres de ESPN no coinciden siempre con los del juego. Solo lo mínimo verificado a mano. El calendario se indexa por
// NOMBRE de club, así que dos clubes que se llaman igual comparten una sola entrada y terminan
// jugando los partidos del otro. Medido cuando se perdieron estos alias: "Nacional" pasó de 69 a
// 211 partidos (los 69 suyos de Uruguay más los 132 del Nacional paraguayo), "Universidad Católica"
// juntó la chilena con la de Quito y "Leones FC" el colombiano con el ecuatoriano. En la base ya
// existen con el nombre largo -- Nacional de Asunción, Universidad Católica de Quito, Leones FC de
// Ecuador, Everton de Viña del Mar -- y acá se los mapea para que la regeneración no los pierda.
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
    const sustituto = f.sustituir ?? {};
    const resolver = nombre => {
      if (sustituto[nombre]) return porNombre.get(norm(sustituto[nombre])) ?? null;
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
      matches.push({ date: correrAnios(p.fecha, f.desplazarAnios ?? 0), home, away, ...(p.ronda ? { round: p.ronda } : {}) });
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
