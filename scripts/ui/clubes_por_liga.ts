// Un club JUGABLE por liga, el de mayor reputacion. Sirve para armar el barrido.
//   npx vite-node scripts/ui/clubes_por_liga.ts
import { clubesJugables } from '../../src/clubesJugables';
const porLiga = new Map<string, { name: string; rep: number }[]>();
for (const c of clubesJugables()) {
  if ((c.division ?? 1) !== 1) continue;
  if (!porLiga.has(c.league)) porLiga.set(c.league, []);
  porLiga.get(c.league)!.push({ name: c.name, rep: c.reputation ?? 0 });
}
for (const [liga, clubes] of [...porLiga].sort()) {
  clubes.sort((a, b) => b.rep - a.rep);
  console.log(`${liga.padEnd(18)} (${String(clubes.length).padStart(3)} clubes)  ->  ${clubes.slice(0, 3).map(c => c.name).join('  |  ')}`);
}
