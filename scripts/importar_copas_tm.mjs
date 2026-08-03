// Mete en el calendario las copas cargadas a mano desde Transfermarkt (data/copas_tm/*.json).
//
// ALLgames.json también trae FA Cup y EFL, pero incompletas: de los 122 partidos de la FA Cup solo
// 33 tenían los dos clubes reconocibles. Transfermarkt las tiene enteras y además con el nombre de
// cada ronda ("Octavos de Final", "Semifinal (Ida)"), que es lo que el juego muestra en pantalla.
//
// Estas versiones REEMPLAZAN a las de ALLgames: mismo torneo, mejor dato.
//
// Uso: node scripts/importar_copas_tm.mjs [--dry]

import { readFile, writeFile, readdir } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const DIR = 'data/copas_tm';
const DESTINO = 'src/realCalendarDates.ts';
const CLUBES = 'data/calendarios_allgames/_clubes.json';

// id de la versión incompleta que viene de ALLgames -> se descarta al importar la buena.
const REEMPLAZA = { fac_tm: 'fac', cgb_tm: 'cgb', cdr_tm: 'cdr', cit_tm: 'cit', dfb_tm: 'dfb' };

const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\b(fc|cf|sc|cd|afc|club|de|del|la|el|los|las|and)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function main() {
  const { clubs } = JSON.parse(await readFile(CLUBES, 'utf8'));

  // Índice por liga: los homónimos entre países no se pueden resolver por nombre suelto.
  const porLiga = new Map();
  for (const c of clubs) {
    const k = `${c.league}|${norm(c.name)}`;
    if (!porLiga.has(k)) porLiga.set(k, c.name);
  }

  const archivos = (await readdir(DIR)).filter(f => f.endsWith('.json'));
  const nuevas = [];
  const descartar = new Set();

  for (const archivo of archivos) {
    const copa = JSON.parse(await readFile(`${DIR}/${archivo}`, 'utf8'));
    const matches = [];
    const sinMapear = new Set();

    for (const m of copa.matches) {
      const home = porLiga.get(`${copa.league}|${norm(m.home)}`);
      const away = porLiga.get(`${copa.league}|${norm(m.away)}`);
      if (!home) sinMapear.add(m.home);
      if (!away) sinMapear.add(m.away);
      // Un partido con un solo club reconocido dejaría un rival fantasma en el calendario.
      if (!home || !away) continue;
      matches.push({ date: m.date, home, away, round: m.round });
    }

    const fechas = matches.map(x => x.date).sort();
    nuevas.push({
      id: copa.id, name: copa.name, kind: copa.kind, league: copa.league,
      firstDate: fechas[0] ?? null, lastDate: fechas[fechas.length - 1] ?? null,
      matches: matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home)),
    });
    if (REEMPLAZA[copa.id]) descartar.add(REEMPLAZA[copa.id]);

    console.log(`${copa.name.padEnd(12)} ${String(matches.length).padStart(3)}/${String(copa.matches.length).padStart(3)} partidos  ${fechas[0]} .. ${fechas[fechas.length - 1]}`);
    if (sinMapear.size) {
      console.log(`   clubes fuera del juego (${sinMapear.size}): ${[...sinMapear].slice(0, 12).join(', ')}${sinMapear.size > 12 ? '…' : ''}`);
    }
  }

  const txt = await readFile(DESTINO, 'utf8');
  const [head, arr] = txt.split('export const DATED_CALENDARS: DatedCompetition[] = ');
  const actuales = JSON.parse(arr.trim().replace(/;$/, ''));

  const ids = new Set(nuevas.map(c => c.id));
  const final = [
    ...actuales.filter(c => !ids.has(c.id) && !descartar.has(c.id)),
    ...nuevas,
  ];

  console.log(`\n${actuales.length} -> ${final.length} competiciones | ${final.reduce((n, c) => n + c.matches.length, 0)} partidos`);
  if (descartar.size) console.log(`reemplazadas (venían incompletas de ALLgames): ${[...descartar].join(', ')}`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }
  await writeFile(DESTINO, `${head}export const DATED_CALENDARS: DatedCompetition[] = ${JSON.stringify(final)};\n`, 'utf8');
  console.log(`-> ${DESTINO}`);
}

main().catch(e => { console.error(e); process.exit(1); });
