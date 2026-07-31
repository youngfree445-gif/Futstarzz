/**
 * Rellena el bloque "aliases" de un calendario cruzando los nombres abreviados de Transfermarkt
 * ("Sport. Cristal", "U. de Chile") contra los nombres de src/data.ts.
 *
 *   npx tsx scripts/generar_aliases.ts data/calendarios/Peruana.json          # muestra propuesta
 *   npx tsx scripts/generar_aliases.ts data/calendarios/Peruana.json --write  # la escribe
 *
 * Solo escribe las coincidencias que considera seguras. Las dudosas las lista aparte para
 * decidirlas a mano: un alias equivocado mete partidos del club que no es, que es peor que dejarlo
 * sin resolver (el validador al menos avisa de lo que falta).
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));

const file = process.argv[2];
const write = process.argv.includes('--write');
if (!file) {
  console.error('uso: npx tsx scripts/generar_aliases.ts <archivo.json> [--write]');
  process.exit(1);
}

// Igual que en validar_calendario.ts: se lee el texto de data.ts porque importarlo arrastra los
// escudos .png que solo Vite resuelve.
function loadClubs(): { name: string; league: string }[] {
  const src = readFileSync(join(HERE, '..', 'src', 'data.ts'), 'utf8');
  const out: { name: string; league: string }[] = [];
  // El nombre puede contener la otra comilla (O"Higgins va con dobles): se excluye solo el
  // delimitador propio. Ver la nota equivalente en validar_calendario.ts.
  const re = /name:\s*(["'])((?:\\.|(?!\1)[^\\]){2,60})\1[\s\S]{0,400}?league:\s*(["'])((?:\\.|(?!\3)[^\\]){2,40})\3/g;
  let m: RegExpExecArray | null;
  const unesc = (s: string) => s.replace(/\\(.)/g, '$1');
  while ((m = re.exec(src))) out.push({ name: unesc(m[2]), league: unesc(m[4]) });
  return [...new Map(out.map(c => [c.name, c])).values()];
}

const CLUBS = loadClubs();
const doc = JSON.parse(readFileSync(file, 'utf8'));
const league: string | undefined = doc.competition?.league;
const pool = league ? CLUBS.filter(c => c.league === league) : CLUBS;

if (!pool.length) {
  console.error(`no hay clubes con league="${league}" en data.ts`);
  process.exit(1);
}

// Normalización agresiva: quita acentos, puntuación y los prefijos/sufijos de club que Transfermarkt
// pone y data.ts no (o viceversa) -- CD, CA, FC, SC, AD, CSD, Club, Deportivo...
const STOP = /\b(cd|ca|fc|sc|ac|ad|cs|csd|afc|cf|club|deportivo|deportes|asociacion|atletico|atletica|social|sociedad|sport|sporting|fbc|de|del|la|el)\b/g;
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(STOP, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const known = new Set(CLUBS.map(c => c.name));
const names = new Set<string>();
for (const m of doc.matches ?? []) { names.add(m.home); names.add(m.away); }

const propuestas: Record<string, string> = {};
const dudosas: [string, string[]][] = [];
const sinNada: string[] = [];

for (const raw of [...names].sort()) {
  if (known.has(raw)) continue;                    // ya coincide exacto
  if (doc.aliases?.[raw]) continue;                // ya resuelto a mano

  const n = norm(raw);
  if (!n) { sinNada.push(raw); continue; }

  const scored = pool
    .map(c => {
      const cn = norm(c.name);
      let score = 0;
      if (cn === n) score = 100;
      else if (cn.startsWith(n) || n.startsWith(cn)) score = 80;
      else if (cn.includes(n) || n.includes(cn)) score = 60;
      else {
        // Palabra distintiva compartida (>=4 letras): "melgar", "garcilaso", "chankas"
        const wa = new Set(n.split(' ').filter(w => w.length >= 4));
        const wb = new Set(cn.split(' ').filter(w => w.length >= 4));
        const common = [...wa].filter(w => wb.has(w));
        if (common.length) score = 40 + common.length * 5;
      }
      return { club: c.name, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) { sinNada.push(raw); continue; }

  const best = scored[0];
  const second = scored[1];
  // Se acepta solo si es claramente mejor que la segunda opción: empate = ambigüedad real.
  const seguro = best.score >= 80 && (!second || best.score > second.score);
  if (seguro) propuestas[raw] = best.club;
  else dudosas.push([raw, scored.slice(0, 3).map(s => `${s.club} (${s.score})`)]);
}

console.log(`archivo: ${file}`);
console.log(`liga:    ${league} (${pool.length} clubes en data.ts)\n`);

console.log(`ALIAS SEGUROS (${Object.keys(propuestas).length}):`);
for (const [k, v] of Object.entries(propuestas)) console.log(`  "${k}" -> "${v}"`);

if (dudosas.length) {
  console.log(`\nAMBIGUOS (${dudosas.length}) — resolver a mano:`);
  for (const [k, cands] of dudosas) console.log(`  "${k}"  ->  ${cands.join('  |  ')}`);
}
if (sinNada.length) {
  console.log(`\nSIN CANDIDATO (${sinNada.length}) — probablemente no están en data.ts:`);
  for (const k of sinNada) console.log(`  "${k}"`);
}

if (write) {
  doc.aliases = { ...(doc.aliases ?? {}), ...propuestas };
  writeFileSync(file, JSON.stringify(doc, null, 2));
  console.log(`\nescritos ${Object.keys(propuestas).length} alias en ${file}`);
} else {
  console.log('\n(nada escrito — volvé a correr con --write para aplicar los seguros)');
}
