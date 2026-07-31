/**
 * Convierte los JSON de data/calendarios/ en src/realCalendar.ts, que es lo que consume el motor.
 *
 *   npx tsx scripts/importar_calendarios.ts
 *
 * Qué hace, y por qué así:
 *
 * - Resuelve los alias UNA sola vez, acá: el runtime recibe ya los nombres de data.ts y no tiene
 *   que arrastrar tablas de alias ni normalizar strings en cada partido.
 * - Agrupa por SEMANA DE JUEGO, no por fecha: el motor avanza de a una semana, así que dos partidos
 *   del mismo torneo en días distintos de la misma semana son la misma "fecha" para el jugador.
 *   Esto es lo que permite que Copa do Brasil (12 rondas en 10 semanas) y la Eurocopa (10 rondas en
 *   5 semanas) entren sin romperse.
 * - Normaliza la semana al arranque de temporada de CADA competición, para que todas empiecen en
 *   la semana 1 de su propio ciclo y el motor pueda ubicarlas dentro de su temporada de 38 semanas.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(HERE, '..');
const BASE = join(RAIZ, 'data', 'calendarios');

interface RawMatch { date: string; round: string | number; home: string; away: string; stage?: string }
interface RawDoc {
  competition: { id: string; name: string; league?: string; type: string; format?: string; season: number };
  aliases?: Record<string, string>;
  matches: RawMatch[];
}

// Semana ISO como número absoluto y comparable: sirve para agrupar y para restar semanas.
function weekIndex(iso: string): number {
  const d = new Date(iso + 'T00:00:00Z');
  return Math.floor(d.getTime() / (7 * 86400000));
}

function cargar(dir: string): RawDoc[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(readFileSync(join(dir, f), 'utf8')) as RawDoc);
}

const ligas = cargar(BASE);
const copas = cargar(join(BASE, 'copas'));
const selecciones = cargar(join(BASE, 'selecciones'));
const eliminatorias = cargar(join(BASE, 'eliminatorias'));

interface OutMatch { w: number; home: string; away: string; round: string; stage?: string }
interface OutComp {
  id: string; name: string; league?: string; kind: string; season: number;
  weeks: number; matches: OutMatch[];
}

function convertir(doc: RawDoc, kind: string): OutComp | null {
  const al = doc.aliases ?? {};
  const resolver = (n: string) => al[n] ?? n;

  const conSemana = doc.matches
    .filter(m => /^\d{4}-\d{2}-\d{2}$/.test(m.date))
    .map(m => ({
      wAbs: weekIndex(m.date),
      home: resolver(m.home),
      away: resolver(m.away),
      round: String(m.round ?? ''),
      stage: m.stage,
    }));

  if (!conSemana.length) return null;

  // Semana 1 = primera semana con partido de esta competición.
  const inicio = Math.min(...conSemana.map(m => m.wAbs));
  const matches: OutMatch[] = conSemana
    .map(m => ({ w: m.wAbs - inicio + 1, home: m.home, away: m.away, round: m.round, stage: m.stage }))
    .sort((a, b) => a.w - b.w);

  return {
    id: doc.competition.id,
    name: doc.competition.name,
    league: doc.competition.league,
    kind,
    season: doc.competition.season,
    weeks: Math.max(...matches.map(m => m.w)),
    matches,
  };
}

const todas: OutComp[] = [
  ...ligas.map(d => convertir(d, 'league')),
  ...copas.map(d => convertir(d, d.competition.type === 'international_cup' ? 'continental_cup' : 'domestic_cup')),
  ...selecciones.map(d => convertir(d, 'national_tournament')),
  ...eliminatorias.map(d => convertir(d, 'qualifier')),
].filter((c): c is OutComp => c !== null);

// --- informe ---
const porTipo: Record<string, { n: number; p: number }> = {};
for (const c of todas) {
  porTipo[c.kind] ??= { n: 0, p: 0 };
  porTipo[c.kind].n++;
  porTipo[c.kind].p += c.matches.length;
}
console.log('TIPO                 COMPETICIONES  PARTIDOS');
for (const [k, v] of Object.entries(porTipo)) {
  console.log(`  ${k.padEnd(20)} ${String(v.n).padStart(11)} ${String(v.p).padStart(9)}`);
}
const totalP = todas.reduce((a, c) => a + c.matches.length, 0);
console.log(`  ${'TOTAL'.padEnd(20)} ${String(todas.length).padStart(11)} ${String(totalP).padStart(9)}`);

// Competiciones que exceden una temporada de 38 semanas: hay que saberlo antes de que el motor
// las intente encajar.
const largas = todas.filter(c => c.weeks > 38);
if (largas.length) {
  console.log(`\ncompeticiones que superan 38 semanas (${largas.length}):`);
  for (const c of largas) console.log(`  ${c.name.padEnd(30)} ${c.weeks} semanas`);
}

const salida = join(RAIZ, 'src', 'realCalendar.ts');
writeFileSync(
  salida,
  `// GENERADO por scripts/importar_calendarios.ts -- no editar a mano.
// Fuente: data/calendarios/**.json (fechas reales de Transfermarkt).
//
// Las semanas ya vienen normalizadas: w=1 es la primera semana con partido de esa competición, así
// que el motor solo tiene que decidir en qué semana de carrera arranca cada torneo. Los alias ya
// están resueltos: los nombres son los de data.ts.

export type CompetitionKind =
  | 'league'
  | 'domestic_cup'
  | 'continental_cup'
  | 'national_tournament'
  | 'qualifier';

export interface RealMatch {
  /** Semana dentro de la competición (1 = primera semana con partido). */
  w: number;
  home: string;
  away: string;
  round: string;
  stage?: string;
}

export interface RealCompetition {
  id: string;
  name: string;
  /** Solo en ligas y copas nacionales: el valor de Club.league al que pertenece. */
  league?: string;
  kind: CompetitionKind;
  season: number;
  /** Cuántas semanas ocupa de punta a punta. */
  weeks: number;
  matches: RealMatch[];
}

export const REAL_CALENDARS: RealCompetition[] = ${JSON.stringify(todas, null, 1)};

/** Competición de liga de un país, si tiene calendario real. */
export function realLeagueFor(league: string): RealCompetition | undefined {
  return REAL_CALENDARS.find(c => c.kind === 'league' && c.league === league);
}

/** Copa nacional de un país, si tiene calendario real. */
export function realDomesticCupFor(league: string): RealCompetition | undefined {
  return REAL_CALENDARS.find(c => c.kind === 'domestic_cup' && c.league === league);
}

export function realCompetitionById(id: string): RealCompetition | undefined {
  return REAL_CALENDARS.find(c => c.id === id);
}

/** Partidos de un club en una semana concreta de la competición. */
export function matchesForClubInWeek(comp: RealCompetition, clubName: string, week: number): RealMatch[] {
  return comp.matches.filter(m => m.w === week && (m.home === clubName || m.away === clubName));
}
`
);
console.log(`\nescrito ${salida}`);
