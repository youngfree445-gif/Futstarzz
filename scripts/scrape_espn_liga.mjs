// Baja el calendario COMPLETO de una competición desde ESPN, fecha por fecha.
//
// Diferencia con scrape_espn_calendario.mjs: aquel recorre CLUBES (una página por equipo), útil
// cuando querés todos los torneos de un club. Este recorre la COMPETICIÓN, que es lo que sirve para
// cargar una liga entera de una: una sola lista de fechas y todos los partidos de cada una.
//
// La clave está en `content.calendar`: ESPN publica ahí las fechas que TIENEN partidos (73 en el
// Brasileirão 2026). La página sin parámetros muestra solo un par de días; con ?date=YYYYMMDD
// devuelve los de esa jornada. Así se baja el año completo sin adivinar qué días hubo fútbol.
//
// Uso:
//   node scripts/scrape_espn_liga.mjs bra.1
//   node scripts/scrape_espn_liga.mjs bra.1 --max 5     (solo 5 fechas, para probar)

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const OUT_DIR = 'data/calendarios_espn';

// "Mozilla/5.0" a secas: ESPN responde 202 con cuerpo vacío ante cualquier UA que mencione Chrome.
const UA = 'Mozilla/5.0';

// Se usa curl y no el fetch de Node porque a Node lo toma por bot y le devuelve 202 vacío.
// Sin --compressed: el curl de este entorno no trae gzip y devolvería 0 bytes.
async function bajarJson(url) {
  const { stdout: html } = await execFileAsync('curl', ['-sS', '-A', UA, url], { maxBuffer: 64 * 1024 * 1024 });
  const marca = html.indexOf("window['__espnfitt__']=");
  if (marca < 0) throw new Error(`sin __espnfitt__ en ${url}`);
  // Se recorta contando llaves, no con un regex hasta "</script>": el JSON trae "</script>"
  // escapado dentro de strings y el regex cortaba en el lugar equivocado.
  const inicio = html.indexOf('{', marca);
  let prof = 0, enString = false, escapado = false, fin = -1;
  for (let i = inicio; i < html.length; i++) {
    const c = html[i];
    if (escapado) { escapado = false; continue; }
    if (c === '\\') { escapado = true; continue; }
    if (c === '"') { enString = !enString; continue; }
    if (enString) continue;
    if (c === '{') prof++;
    else if (c === '}' && --prof === 0) { fin = i + 1; break; }
  }
  if (fin < 0) throw new Error(`JSON incompleto en ${url}`);
  return JSON.parse(html.slice(inicio, fin));
}

const partidosDe = (content, ronda = null) => {
  const out = [];
  // events viene como objeto { '20260729': [...], ... }, no como array.
  for (const lista of Object.values(content?.events ?? {})) {
    for (const ev of lista ?? []) {
      const local = ev.competitors?.find(c => c.isHome);
      const visita = ev.competitors?.find(c => !c.isHome);
      if (!local || !visita || !ev.date) continue;
      out.push({
        fecha: ev.date.slice(0, 10),
        localId: String(local.id), local: local.displayName,
        visitaId: String(visita.id), visita: visita.displayName,
        jugado: !!ev.completed,
        marcador: ev.completed ? `${local.score}-${visita.score}` : null,
        ...(ronda ? { ronda } : {}),
      });
    }
  }
  return out;
};

/**
 * Qué hay que pedirle a ESPN para recorrer la competición entera.
 *
 * Las LIGAS traen `calendar` como lista plana de fechas ISO -> se pide ?date=YYYYMMDD.
 * Las COPAS lo traen como secciones con `entries`, una por ronda, y cada una con su label
 * ("Octavos de Final", "Semifinales") -> se pide ?season=AAAA&type=N&week=N. Suponer la forma de
 * liga en una copa reventaba con "f.slice is not a function".
 */
function pasosDelCalendario(content) {
  const cal = content?.calendar ?? [];
  if (cal.length && typeof cal[0] === 'string') {
    return cal.map(f => ({ query: `date=${f.slice(0, 10).replace(/-/g, '')}`, ronda: null }));
  }
  const anio = content?.currentSeason?.year;
  const tipo = content?.currentSeason?.seasonType;
  const pasos = [];
  for (const sec of cal) {
    for (const en of sec?.entries ?? []) {
      // El label es el nombre de la ronda tal como el juego lo muestra en pantalla.
      pasos.push({ query: `season=${anio}&type=${tipo}&week=${en.value}`, ronda: en.label ?? null });
    }
  }
  return pasos;
}

async function main() {
  const ligaId = process.argv[2];
  if (!ligaId) { console.error('falta el id de liga, p.ej. bra.1'); process.exit(1); }
  const iMax = process.argv.indexOf('--max');
  const max = iMax > 0 ? Number(process.argv[iMax + 1]) : Infinity;

  const base = `https://www.espn.com.co/futbol/calendario/_/liga/${ligaId}`;
  const inicial = await bajarJson(base);
  const content = inicial?.page?.content ?? {};
  const temporada = content.currentSeason?.name?.trim() ?? '';
  const pasos = pasosDelCalendario(content);
  const esCopa = pasos.some(p => p.ronda);
  console.log(`${ligaId} · ${temporada} · ${pasos.length} ${esCopa ? 'rondas' : 'jornadas'} con partidos`);

  const todos = [];
  const vistos = new Set();
  const agregar = ps => {
    for (const p of ps) {
      // Un partido puede repetirse entre jornadas consultadas.
      const k = `${p.fecha}|${p.localId}|${p.visitaId}`;
      if (vistos.has(k)) continue;
      vistos.add(k);
      todos.push(p);
    }
  };
  agregar(partidosDe(content));

  for (const [i, paso] of pasos.slice(0, max).entries()) {
    try {
      const d = await bajarJson(`${base}?${paso.query}`);
      agregar(partidosDe(d?.page?.content ?? {}, paso.ronda));
      process.stdout.write(`\r  ${i + 1}/${Math.min(pasos.length, max)} · ${todos.length} partidos${paso.ronda ? ` · ${paso.ronda}` : ''}          `);
    } catch (e) {
      console.error(`\n   aviso en ${paso.query}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log();

  todos.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.local.localeCompare(b.local));
  const equipos = new Map();
  for (const p of todos) { equipos.set(p.localId, p.local); equipos.set(p.visitaId, p.visita); }

  await mkdir(OUT_DIR, { recursive: true });
  const destino = join(OUT_DIR, `${ligaId}_liga.json`);
  await writeFile(destino, JSON.stringify({
    fuente: base, espnLeagueId: ligaId, temporada,
    equipos: Object.fromEntries([...equipos].sort((a, b) => a[1].localeCompare(b[1]))),
    partidos: todos,
  }, null, 1), 'utf8');

  console.log(`${todos.length} partidos · ${equipos.size} equipos · ${todos[0]?.fecha} .. ${todos[todos.length - 1]?.fecha}`);
  console.log(`-> ${destino}`);
}

main().catch(e => { console.error(e); process.exit(1); });
