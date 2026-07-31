/**
 * Valida un JSON/CSV de calendario antes de importarlo al juego.
 *
 *   npx tsx scripts/validar_calendario.ts <archivo>
 *
 * Comprueba lo que realmente rompe una importación: nombres de club que no existen en data.ts
 * (esos partidos se perderían en silencio), fechas mal formadas, jornadas faltantes y equipos
 * jugando dos veces el mismo día. Ver docs/FORMATO_CALENDARIO.md.
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// El proyecto es ESM ("type": "module"), así que no hay __dirname.
const HERE = dirname(fileURLToPath(import.meta.url));

// Los nombres de club se leen del TEXTO de data.ts en vez de importarlo: data.ts importa los
// escudos (.png), que solo Vite sabe resolver, así que un `import` acá haría fallar el script con
// ERR_UNKNOWN_FILE_EXTENSION. Solo hacen falta los nombres y su liga, no el módulo entero.
function loadClubs(): { name: string; league: string }[] {
  const src = readFileSync(join(HERE, '..', 'src', 'data.ts'), 'utf8');
  const out: { name: string; league: string }[] = [];
  // Cada club declara name y league en el mismo literal, en ese orden. Se exige que el nombre no
  // contenga comillas sin escapar para no capturar fragmentos de textos de eventos que también
  // tienen "name:" cerca de un "league:".
  const re = /name:\s*(["'])([^"'\\]{2,60})\1[\s\S]{0,400}?league:\s*(["'])([^"'\\]{2,40})\3/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.push({ name: m[2], league: m[4] });
  // Deduplicar: un mismo club puede aparecer más de una vez si el regex solapa.
  const byName = new Map(out.map(c => [c.name, c]));
  return [...byName.values()];
}

const CLUBS = loadClubs();

const file = process.argv[2];
if (!file) {
  console.error('uso: npx tsx scripts/validar_calendario.ts <archivo.json|.csv>');
  process.exit(1);
}

interface Match {
  date: string; round: string | number; home: string; away: string;
  stage?: string; leg?: number; group?: string;
}

const raw = readFileSync(file, 'utf8');
let competition: any = {};
let matches: Match[] = [];
let aliases: Record<string, string> = {};

if (file.endsWith('.csv')) {
  const lines = raw.trim().split(/\r?\n/);
  const cols = lines[0].split(',').map(c => c.trim());
  const idx = (n: string) => cols.indexOf(n);
  matches = lines.slice(1).map(l => {
    const v = l.split(',');
    return {
      date: v[idx('date')]?.trim(),
      round: v[idx('round')]?.trim(),
      home: v[idx('home')]?.trim(),
      away: v[idx('away')]?.trim(),
      stage: idx('stage') >= 0 ? v[idx('stage')]?.trim() : undefined,
    };
  });
  competition = { league: matches.length ? raw.split(/\r?\n/)[1]?.split(',')[idx('league')]?.trim() : undefined };
} else {
  const j = JSON.parse(raw);
  // Se aceptan las tres formas: {competition,matches}, array suelto, o formato ALLgames.json
  if (Array.isArray(j)) {
    matches = j.map((g: any) => ({
      date: g.date, round: g.round, home: g.home ?? g.home_club_name, away: g.away ?? g.away_club_name,
      stage: g.stage, leg: g.leg, group: g.group,
    }));
  } else {
    competition = j.competition ?? {};
    aliases = j.aliases ?? {};
    matches = (j.matches ?? []).map((g: any) => ({
      date: g.date, round: g.round, home: g.home ?? g.home_club_name, away: g.away ?? g.away_club_name,
      stage: g.stage, leg: g.leg, group: g.group,
    }));
  }
}

console.log(`archivo:      ${file}`);
console.log(`competición:  ${competition.name ?? competition.id ?? '(sin declarar)'}`);
console.log(`liga:         ${competition.league ?? '(sin declarar)'}`);
console.log(`partidos:     ${matches.length}\n`);

if (!matches.length) {
  console.error('*** no se leyó ningún partido: revisá la estructura (docs/FORMATO_CALENDARIO.md)');
  process.exit(1);
}

// --- nombres de club ---
const byName = new Map(CLUBS.map(c => [c.name.toLowerCase(), c]));
const resolve = (n: string) => {
  if (!n) return null;
  const alias = aliases[n] ?? n;
  return byName.get(alias.toLowerCase()) ?? null;
};

const unknown = new Map<string, number>();
for (const m of matches) {
  for (const n of [m.home, m.away]) if (!resolve(n)) unknown.set(n, (unknown.get(n) ?? 0) + 1);
}

const teams = new Set<string>();
for (const m of matches) { if (resolve(m.home)) teams.add(m.home); if (resolve(m.away)) teams.add(m.away); }

console.log(`equipos reconocidos:     ${teams.size}`);
console.log(`nombres NO reconocidos:  ${unknown.size}`);
if (unknown.size) {
  console.log('\n  Estos partidos se perderían. Agregalos al bloque "aliases" o corregí el nombre:');
  [...unknown.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40)
    .forEach(([n, c]) => console.log(`    "${n}"  (${c} partidos)`));
  // Sugerencia por parecido: ayuda a detectar "CSD Colo Colo" vs "Colo-Colo"
  console.log('\n  Candidatos parecidos en la base del juego:');
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [n] of [...unknown.entries()].slice(0, 12)) {
    const t = norm(n);
    const near = CLUBS.filter(c => { const x = norm(c.name); return x.includes(t) || t.includes(x); }).slice(0, 3);
    if (near.length) console.log(`    "${n}" -> ${near.map(c => `"${c.name}"`).join(' | ')}`);
  }
}

// --- fechas ---
const badDates = matches.filter(m => !/^\d{4}-\d{2}-\d{2}$/.test(String(m.date ?? '')));
console.log(`\nfechas mal formadas:     ${badDates.length}`);
if (badDates.length) badDates.slice(0, 5).forEach(m => console.log(`    "${m.date}" (${m.home} vs ${m.away})`));

const dates = matches.map(m => m.date).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(String(d))).sort();
if (dates.length) {
  console.log(`rango:                   ${dates[0]} a ${dates[dates.length - 1]}`);
  const meses = new Set(dates.map(d => d.slice(0, 7)));
  console.log(`meses cubiertos:         ${meses.size}`);
}

// --- jornadas ---
const roundNum = (r: any) => {
  const m = String(r ?? '').match(/(\d+)/);
  return m ? Number(m[1]) : null;
};
const nums = matches.map(m => roundNum(m.round)).filter((n): n is number => n !== null);
if (nums.length) {
  const max = Math.max(...nums), min = Math.min(...nums);
  const present = new Set(nums);
  const faltan: number[] = [];
  for (let i = min; i <= max; i++) if (!present.has(i)) faltan.push(i);
  console.log(`\njornadas:                ${min} a ${max}`);
  if (faltan.length) console.log(`  *** jornadas faltantes: ${faltan.slice(0, 20).join(', ')}${faltan.length > 20 ? '…' : ''}`);
}
const sinRound = matches.filter(m => m.round === undefined || m.round === '').length;
if (sinRound) console.log(`  *** ${sinRound} partidos sin "round"`);

// --- coherencia ---
let sameTeam = 0;
const perDay = new Map<string, Set<string>>();
let dobles = 0;
for (const m of matches) {
  if (m.home && m.away && m.home === m.away) sameTeam++;
  const key = String(m.date);
  const set = perDay.get(key) ?? new Set<string>();
  for (const t of [m.home, m.away]) {
    if (set.has(t)) dobles++;
    set.add(t);
  }
  perDay.set(key, set);
}
console.log(`\nequipo contra sí mismo:  ${sameTeam}`);
console.log(`equipos 2 veces/día:     ${dobles}`);

// --- veredicto ---
const errores = unknown.size + badDates.length + sameTeam;
console.log('\n=====================================');
if (errores === 0) {
  console.log('LISTO PARA IMPORTAR');
} else {
  console.log(`${errores} problemas a revisar (lo más importante: los ${unknown.size} nombres no reconocidos)`);
}
