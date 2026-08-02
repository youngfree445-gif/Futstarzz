// Convierte data/calendarios_espn/*.json (fechas reales de ESPN) en src/realCalendarDates.ts,
// que es lo que consume el motor.
//
// La diferencia con src/realCalendar.ts (el viejo): ahí cada partido tenía una SEMANA (w: 12) y el
// motor asumía un partido por semana. Acá cada partido tiene su FECHA EXACTA (2026-05-07), que es
// como se juega de verdad -- en el calendario real del Junior hay 14 semanas con dos partidos
// (liga el domingo, Libertadores el jueves) y con el modelo por semanas esos partidos no entraban.
//
// Uso: node scripts/generar_calendario_fechas.mjs

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const IN_DIR = 'data/calendarios_espn';
const OUT = 'src/realCalendarDates.ts';

// Nombre de ESPN -> el tipo de competición que entiende el motor.
const TIPO_POR_TORNEO = {
  'Colombian Primera A': 'league',
  'Copa Colombia': 'domestic_cup',
  'CONMEBOL Libertadores': 'continental_cup',
  'CONMEBOL Sudamericana': 'continental_cup',
  'Superliga de Colombia': 'domestic_cup',
};

// Los amistosos no son un torneo: no dan puntos ni eliminan, y meterlos ensuciaría la tabla.
const IGNORAR = new Set(['Amistoso']);

// Nombre de ESPN -> nombre mostrable en el juego.
const NOMBRE_TORNEO = {
  'Colombian Primera A': 'Liga BetPlay Dimayor',
  'Copa Colombia': 'Copa BetPlay',
  'CONMEBOL Libertadores': 'Copa Libertadores',
  'CONMEBOL Sudamericana': 'Copa Sudamericana',
  'Superliga de Colombia': 'Superliga de Colombia',
};

async function main() {
  const archivos = (await readdir(IN_DIR)).filter(f => f.endsWith('.json'));
  const competiciones = new Map();
  // id de ESPN -> nombre del club, para resolver rivales por id y no por texto.
  const nombrePorId = new Map();

  for (const archivo of archivos) {
    const { liga, clubs } = JSON.parse(await readFile(join(IN_DIR, archivo), 'utf8'));

    // Primero el índice de ids: los rivales se resuelven por id, nunca por nombre. Los nombres se
    // repiten entre países y emparejar por texto ya cruzó planteles una vez.
    for (const [nombreClub, partidos] of Object.entries(clubs)) {
      for (const p of partidos) {
        if (p.localJuego) nombrePorId.set(p.localId, p.localJuego);
        if (p.visitaJuego) nombrePorId.set(p.visitaId, p.visitaJuego);
      }
      void nombreClub;
    }

    // Cada partido aparece en el calendario de los dos equipos: se deduplica por fecha+ids.
    const vistos = new Set();
    for (const partidos of Object.values(clubs)) {
      for (const p of partidos) {
        if (IGNORAR.has(p.torneo)) continue;
        const kind = TIPO_POR_TORNEO[p.torneo];
        if (!kind) continue;

        const clave = `${p.fecha}|${p.localId}|${p.visitaId}`;
        if (vistos.has(clave)) continue;
        vistos.add(clave);

        const local = nombrePorId.get(p.localId) ?? p.local;
        const visita = nombrePorId.get(p.visitaId) ?? p.visita;

        const compId = p.torneo;
        if (!competiciones.has(compId)) {
          competiciones.set(compId, {
            id: compId.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            name: NOMBRE_TORNEO[p.torneo] ?? p.torneo,
            kind,
            league: kind === 'league' || kind === 'domestic_cup' ? liga : undefined,
            matches: [],
          });
        }
        // Solo fecha y equipos: el resultado lo simula el motor, no se importa el real.
        competiciones.get(compId).matches.push({ date: p.fecha, home: local, away: visita });
      }
    }
  }

  const salida = [...competiciones.values()].map(c => {
    c.matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home));
    return {
      ...c,
      firstDate: c.matches[0]?.date ?? null,
      lastDate: c.matches[c.matches.length - 1]?.date ?? null,
    };
  });

  const ts = `// GENERADO por scripts/generar_calendario_fechas.mjs -- no editar a mano.
// Fuente: data/calendarios_espn/**.json (fechas reales de ESPN).
//
// A diferencia de realCalendar.ts, que ubicaba cada partido en una SEMANA, acá cada uno tiene su
// FECHA EXACTA. Es lo que permite que un club juegue liga el domingo y copa el jueves de la misma
// semana -- con el modelo por semanas esos partidos no tenían dónde entrar y los torneos no
// cerraban.

export type CompetitionKind =
  | 'league'
  | 'domestic_cup'
  | 'continental_cup'
  | 'national_tournament';

export interface DatedMatch {
  /** Fecha real del partido, YYYY-MM-DD. */
  date: string;
  home: string;
  away: string;
}

export interface DatedCompetition {
  id: string;
  name: string;
  kind: CompetitionKind;
  /** Solo en ligas y copas nacionales: el valor de Club.league al que pertenece. */
  league?: string;
  firstDate: string | null;
  lastDate: string | null;
  matches: DatedMatch[];
}

export const DATED_CALENDARS: DatedCompetition[] = ${JSON.stringify(salida, null, 1)};
`;

  await writeFile(OUT, ts, 'utf8');

  console.log(`-> ${OUT}`);
  for (const c of salida) {
    console.log(`   ${String(c.matches.length).padStart(4)}  ${c.name.padEnd(24)} ${c.firstDate} .. ${c.lastDate}`);
  }
  console.log(`   total: ${salida.reduce((n, c) => n + c.matches.length, 0)} partidos`);
}

main().catch(e => { console.error(e); process.exit(1); });
