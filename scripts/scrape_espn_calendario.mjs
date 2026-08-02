// Baja el calendario REAL con fechas exactas desde ESPN y lo deja en data/calendarios_espn/.
//
// Por qué ESPN y no Transfermarkt: ESPN embebe todo el fixture en un JSON dentro del HTML
// (window['__espnfitt__']), así que no hay que parsear tablas ni adivinar formatos de fecha -- cada
// partido trae fecha ISO, los dos equipos con su id, quién es local y de qué torneo es.
//
// Y sobre todo: trae la FECHA EXACTA. El motor viejo asumía un partido por semana, y con eso los
// torneos no cerraban -- en el calendario real del Junior hay 37 partidos en 23 semanas, con 14
// semanas de dos partidos (liga el domingo, Libertadores el jueves). Ver docs de la migración.
//
// Uso:
//   node scripts/scrape_espn_calendario.mjs            (todos los clubes de LIGAS)
//   node scripts/scrape_espn_calendario.mjs 4815       (solo un club, para probar)

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const OUT_DIR = 'data/calendarios_espn';

// id de ESPN -> nombre del club EN data.ts. El nombre es el que manda: si no coincide, el
// calendario no se puede enganchar al club y el partido se pierde.
const LIGAS = {
  'col.1': {
    nombre: 'Colombiana',
    clubs: {
      9761: 'Alianza FC',
      8109: 'América de Cali',
      6137: 'Atlético Bucaramanga',
      4815: 'Junior de Barranquilla',
      5264: 'Atlético Nacional',
      5480: 'Boyacá Chicó',
      6101: 'Cúcuta Deportivo',
      5489: 'Deportes Tolima',
      2672: 'Deportivo Cali',
      5485: 'Deportivo Pasto',
      5486: 'Deportivo Pereira',
      4928: 'Fortaleza FC',
      2690: 'Independiente Medellín',
      5488: 'Independiente Santa Fe',
      7445: 'Internacional de Bogotá',
      10309: 'Jaguares de Córdoba',
      7915: 'Llaneros FC',
      5484: 'Millonarios FC',
      2919: 'Once Caldas',
      9762: 'Águilas Doradas',
    },
  },
};

// "Mozilla/5.0" a secas y nada más: probado, ESPN responde 202 con cuerpo vacío ante cualquier
// User-Agent que mencione Chrome. Alargarlo para parecer "más real" rompe la descarga.
const UA = 'Mozilla/5.0';

// Se descarga con curl y no con el fetch de Node a propósito: ESPN le responde 202 con cuerpo
// vacío al cliente de Node (lo toma por bot) mientras que a curl le entrega el HTML completo.
async function bajarJson(url) {
  const { stdout: html } = await execFileAsync(
    'curl',
    // Sin --compressed: el curl de este entorno no trae soporte de gzip y devuelve 0 bytes.
    ['-sS', '-A', UA, url],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  // El payload se recorta contando llaves y no con un regex hasta "</script>": el JSON contiene
  // "</script>" escapado dentro de strings, así que el regex cortaba en el lugar equivocado (o no
  // matcheaba) y parecía que la página no traía datos.
  const marca = html.indexOf("window['__espnfitt__']=");
  if (marca < 0) throw new Error(`sin __espnfitt__ en ${url}`);

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

/**
 * Los partidos de un club: los ya jugados (resultados) y los que vienen (calendario).
 *
 * La URL se arma SIN el slug del nombre. ESPN acepta el id solo, y derivar el slug del nombre en
 * data.ts no funciona: da "junior-de-barranquilla" cuando ESPN espera "atletico-junior", y con un
 * slug que no es el suyo la página vuelve sin datos.
 */
async function partidosDe(espnId) {
  const urls = [
    `https://www.espn.com.co/futbol/equipo/resultados/_/id/${espnId}`,
    `https://www.espn.com.co/futbol/equipo/calendario/_/id/${espnId}`,
  ];
  const out = [];
  for (const url of urls) {
    let data;
    try {
      data = await bajarJson(url);
    } catch (e) {
      console.error(`   aviso: ${e.message}`);
      continue;
    }
    // Las dos páginas guardan los eventos en ramas distintas: "calendario" en content.fixtures y
    // "resultados" en content.results. Se leen las dos en vez de asumir una.
    const events = data?.page?.content?.fixtures?.events
      ?? data?.page?.content?.results?.events
      ?? [];
    for (const ev of events) {
      const local = ev.competitors?.find(c => c.isHome);
      const visita = ev.competitors?.find(c => !c.isHome);
      if (!local || !visita || !ev.date) continue;
      out.push({
        fecha: ev.date.slice(0, 10),           // YYYY-MM-DD, sin la hora
        // league viene como string plano ("Copa Colombia"), no como objeto.
        torneo: typeof ev.league === 'string' ? ev.league : (ev.league?.shortName ?? ev.league?.name ?? ''),
        localId: String(local.id),
        local: local.displayName,
        visitaId: String(visita.id),
        visita: visita.displayName,
        jugado: !!ev.completed,
        marcador: ev.score || null,
      });
    }
  }
  // Un mismo partido puede venir en las dos páginas.
  const vistos = new Set();
  return out
    .filter(p => {
      const k = `${p.fecha}|${p.localId}|${p.visitaId}`;
      if (vistos.has(k)) return false;
      vistos.add(k);
      return true;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

async function main() {
  const soloId = process.argv[2];
  await mkdir(OUT_DIR, { recursive: true });

  for (const [ligaId, liga] of Object.entries(LIGAS)) {
    const entradas = Object.entries(liga.clubs)
      .filter(([id]) => !soloId || id === soloId);

    // Los rivales se traducen por ID de ESPN, nunca por nombre. Los nombres se repiten entre países
    // (Everton, Liverpool, Nacional, Universidad Católica...) y emparejar por texto ya nos hizo
    // cruzar planteles una vez. El id es único y no miente.
    const nombrePorEspnId = new Map(
      Object.entries(liga.clubs).map(([id, nombre]) => [String(id), nombre])
    );

    const porClub = {};
    const rivalesDesconocidos = new Map();

    for (const [espnId, nombreClub] of entradas) {
      const partidos = await partidosDe(espnId);

      // Se anota el nombre del juego junto al de ESPN, resuelto por id.
      for (const p of partidos) {
        p.localJuego = nombrePorEspnId.get(p.localId) ?? null;
        p.visitaJuego = nombrePorEspnId.get(p.visitaId) ?? null;
        // Rivales de otras competiciones (Libertadores, Copa Colombia) no están en la liga local:
        // se reportan al final para mapearlos aparte, no se descartan en silencio.
        if (!p.localJuego) rivalesDesconocidos.set(p.localId, p.local);
        if (!p.visitaJuego) rivalesDesconocidos.set(p.visitaId, p.visita);
      }

      porClub[nombreClub] = partidos;
      const torneos = [...new Set(partidos.map(p => p.torneo))];
      console.log(`${nombreClub.padEnd(26)} ${String(partidos.length).padStart(3)} partidos · ${torneos.join(', ')}`);
      // ESPN no pide rate limit explícito, pero no hay apuro y así no lo golpeamos.
      await new Promise(r => setTimeout(r, 400));
    }

    const destino = join(OUT_DIR, `${ligaId}.json`);
    await writeFile(destino, JSON.stringify({ liga: liga.nombre, espnLeagueId: ligaId, clubs: porClub }, null, 1), 'utf8');
    console.log(`\n-> ${destino}`);

    if (rivalesDesconocidos.size) {
      console.log(`\nRivales sin mapear (${rivalesDesconocidos.size}) -- de copas, hay que agregarlos:`);
      for (const [id, nombre] of rivalesDesconocidos) console.log(`   ${id}  ${nombre}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
