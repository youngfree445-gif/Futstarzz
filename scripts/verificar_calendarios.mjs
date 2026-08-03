// Chequea que el calendario no tenga imposibles: un club jugando dos veces el mismo día, o dos
// veces la misma ronda de una copa. Fue lo que atrapó la lectura mala del DFB-Pokal.
//
// Uso: node scripts/verificar_calendarios.mjs

import { readFile } from 'node:fs/promises';

const txt = await readFile('src/realCalendarDates.ts', 'utf8');
const comps = JSON.parse(
  txt.split('export const DATED_CALENDARS: DatedCompetition[] = ')[1].trim().replace(/;$/, ''));

let problemas = 0;

// 1. Un club no puede jugar dos partidos el mismo día DENTRO de la misma competición: eso es dato
//    mal mapeado (dos clubes distintos colapsados en un nombre). Entre competiciones distintas SÍ
//    puede pasar -- liga y copa continental chocan de verdad en el calendario real -- y el motor ya
//    lo resuelve con pickPrimary(), que prioriza la copa sobre la fecha de liga. Marcar eso como
//    error escondía los duplicados que sí importan.
const porClubFecha = new Map();
const choquesEntreTorneos = [];
for (const c of comps) {
  for (const m of c.matches) {
    for (const club of [m.home, m.away]) {
      const k = `${club}|${m.date}`;
      const prev = porClubFecha.get(k);
      if (prev && prev.compId === c.id) {
        console.log(`DIA DUPLICADO EN ${c.name}  ${club}  ${m.date}`);
        console.log(`   ${prev.home} vs ${prev.away}`);
        console.log(`   ${m.home} vs ${m.away}`);
        problemas++;
      } else if (prev) {
        choquesEntreTorneos.push(`${club} ${m.date}: ${prev.comp} / ${c.name}`);
      } else {
        porClubFecha.set(k, { compId: c.id, comp: c.name, home: m.home, away: m.away });
      }
    }
  }
}

// 2. En una copa, un club no puede aparecer dos veces en la misma ronda.
for (const c of comps.filter(c => c.kind === 'domestic_cup')) {
  const porRonda = new Map();
  for (const m of c.matches) {
    if (!m.round) continue;
    for (const club of [m.home, m.away]) {
      const k = `${m.round}|${club}`;
      if (porRonda.has(k)) {
        console.log(`RONDA REPETIDA  ${c.name}  ${m.round}  ${club}`);
        problemas++;
      } else porRonda.set(k, true);
    }
  }
}

// 3. Un club no puede jugar contra sí mismo.
for (const c of comps) {
  for (const m of c.matches) {
    if (m.home === m.away) { console.log(`AUTOPARTIDO  ${c.name}  ${m.date}  ${m.home}`); problemas++; }
  }
}

const clubes = new Set();
for (const c of comps) for (const m of c.matches) { clubes.add(m.home); clubes.add(m.away); }

console.log(`\n${comps.length} competiciones · ${comps.reduce((n, c) => n + c.matches.length, 0)} partidos · ${clubes.size} clubes`);
if (choquesEntreTorneos.length) {
  // Informativo, no es un error: el motor los resuelve con pickPrimary().
  console.log(`\n${choquesEntreTorneos.length} choques liga/copa el mismo día (los resuelve pickPrimary):`);
  for (const ch of choquesEntreTorneos.slice(0, 8)) console.log(`   ${ch}`);
}
console.log(problemas ? `\n${problemas} PROBLEMAS` : '\nsin problemas');
process.exit(problemas ? 1 : 0);
