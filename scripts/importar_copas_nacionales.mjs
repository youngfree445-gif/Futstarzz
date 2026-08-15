/**
 * Injerta las COPAS NACIONALES que estaban en el repo sin cargar.
 *
 *   node scripts/importar_copas_nacionales.mjs --dry
 *   node scripts/importar_copas_nacionales.mjs
 *
 * Entrada: data/calendarios/copas/*.json (formato Transfermarkt: competition + aliases + matches).
 *
 * Estas copas no necesitan estar completas. Desde que el calendario RESERVA fechas de copa y el
 * cuadro del motor pone el rival (ver copaNacional.ts y RESERVAS DE COPA en dateSchedule.ts), lo
 * único que hace falta del calendario es que la competición EXISTA y traiga sus fechas: el torneo
 * se completa solo hasta la final. Por eso entra la Copa Uruguay con 8 partidos igual que la Copa
 * Chile con 69.
 *
 * INJERTA, NO REGENERA: ver la nota en importar_segundas.mjs sobre la copia vieja de la base.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data.ts';

const DRY = process.argv.includes('--dry');
const DESTINO = 'src/realCalendarDates.ts';
const ORIGEN = 'data/calendarios/copas';

/**
 * `anioObjetivo` es la temporada de carrera con la que tiene que alinearse. Estos archivos son de
 * temporadas pasadas -- la Copa MX es de 2018 -- así que se les corren los años hasta que caigan
 * dentro del año 1 de la carrera (2026). Sin eso, un club tendría su primera fecha de copa años
 * antes o después de su liga.
 *
 * El `name` es el que el motor usa para reconocer la copa del país: tiene que coincidir EXACTO con
 * nombreCopaNacional(league) en copaNacional.ts, o el calendario no le reserva fechas.
 */
const FUENTES = [
  { archivo: 'ARCA.json', id: 'arca', name: 'Copa Argentina',    league: 'Argentina' },
  { archivo: 'NLP.json',  id: 'nlp',  name: 'KNVB Beker',        league: 'Holandesa' },
  { archivo: 'CH1C.json', id: 'ch1c', name: 'Copa Chile',        league: 'Chilena' },
  { archivo: 'ECUP.json', id: 'ecup', name: 'Copa Ecuador',      league: 'Ecuatoriana' },
  { archivo: 'BVC1.json', id: 'bvc1', name: 'Copa Bolivia',      league: 'Boliviana' },
  { archivo: 'URP1.json', id: 'urp1', name: 'Copa Uruguay',      league: 'Uruguaya' },
  { archivo: 'VEC1.json', id: 'vec1', name: 'Copa Venezuela',    league: 'Venezolana' },
  { archivo: 'MXCA.json', id: 'mxca', name: 'Copa MX',           league: 'Mexicana' },
  { archivo: 'MLSP.json', id: 'mlsp', name: 'US Open Cup',       league: 'Estadounidense' },
  // Scrapeadas el 12 de agosto de 2026 (Transfermarkt FRC y POPO). Son copas ABIERTAS: la Coupe de
  // France trae 426 clubes y la Taça 148, casi todos amateurs que no están en la base. Los que no
  // están simplemente no entran y el cuadro del motor completa el torneo -- que es exactamente para
  // lo que sirve.
  { archivo: 'FRC.json',  id: 'frc',  name: 'Coupe de France',   league: 'Francesa' },
  { archivo: 'POPO.json', id: 'popo', name: 'Taça de Portugal',  league: 'Portuguesa' },
  // Copa Paraguay, 15 de agosto de 2026. Cierra el mapa de copas de Sudamerica junto con Peru.
  // No salio del scraper: Transfermarkt y Sofascore bloquean al agente y la APF no publica
  // calendario estructurado. Entra con las seis fechas verificables de la edicion 2025 -- ver la
  // nota adentro del JSON -- y el cuadro del motor la completa, que es para lo que sirve.
  { archivo: 'PYCO.json', id: 'pyco', name: 'Copa Paraguay',    league: 'Paraguaya' },
];

const ANIO_CARRERA = 2026;

const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\b(fc|cf|sc|ac|as|ss|us|ud|sd|cd|ad|rc|club|de|del|la|el|the)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

/** Misma fecha, `anios` años después. El 29/2 cae en 28/2 los años no bisiestos. */
function correrAnios(date, anios) {
  if (!anios) return date;
  const [a, m, d] = date.split('-').map(Number);
  const anio = a + anios;
  const ultimo = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  return `${anio}-${String(m).padStart(2, '0')}-${String(Math.min(d, ultimo)).padStart(2, '0')}`;
}

async function main() {
  const actual = await readFile(DESTINO, 'utf8');
  const ini = actual.indexOf('[{');
  const fin = actual.lastIndexOf(']') + 1;
  const head = actual.slice(0, ini);
  const tail = actual.slice(fin);
  const existentes = JSON.parse(actual.slice(ini, fin));

  const nuevas = [];
  for (const f of FUENTES) {
    let datos;
    try { datos = JSON.parse(await readFile(`${ORIGEN}/${f.archivo}`, 'utf8')); }
    catch { console.log(`${f.name.padEnd(18)} SIN ARCHIVO`); continue; }
    const crudos = (datos.matches ?? []).filter(m => m.date && m.home && m.away);
    if (!crudos.length) { console.log(`${f.name.padEnd(18)} VACÍO`); continue; }

    // Los años se corren para alinear la copa con la LIGA de su país, no con el año 1 a secas.
    //
    // Forzar "que la primera fecha caiga en 2026" funciona en Sudamérica, donde la temporada es el
    // año calendario, y rompe en Europa, donde va de agosto a mayo: la Coupe de France arranca en
    // octubre de 2025 y ya está alineada con la Ligue 1 2025/26, pero la regla vieja la corría un
    // año y la dejaba jugándose en 2026/27, una temporada entera después de su liga.
    const primeraDeLaCopa = crudos.map(m => m.date).sort()[0];
    const ligaDelPais = existentes.find(c => c.kind === 'league' && c.league === f.league && c.firstDate);
    const anioDeReferencia = ligaDelPais ? Number(ligaDelPais.firstDate.slice(0, 4)) : ANIO_CARRERA;
    const desplazamiento = anioDeReferencia - Number(primeraDeLaCopa.slice(0, 4));

    const delPais = CLUBS.filter(c => c.league === f.league);
    const porNombre = new Map(delPais.map(c => [norm(c.name), c.name]));
    const alias = datos.aliases ?? {};

    const resolver = nombre => {
      const directo = porNombre.get(norm(alias[nombre] ?? nombre));
      if (directo) return directo;
      const n = norm(nombre);
      // Prefijo sólo si es INEQUÍVOCO, y nunca entre un filial y su primer equipo.
      const filial = x => /\b(u ?\d+|jong|ii|b)\s*$/i.test(x.trim());
      const esFilial = filial(nombre);
      const hits = [...porNombre].filter(([k, real]) =>
        filial(real) === esFilial && (k === n || k.startsWith(n) || n.startsWith(k)));
      return hits.length === 1 ? hits[0][1] : null;
    };

    const matches = [];
    const sinMapear = new Set();
    for (const m of crudos) {
      const home = resolver(m.home), away = resolver(m.away);
      if (!home) sinMapear.add(m.home);
      if (!away) sinMapear.add(m.away);
      // Una copa nacional cruza divisiones y categorías: los clubes que no están en la base
      // simplemente no entran, y el cuadro del motor completa el torneo igual. No se sustituye
      // nada -- a diferencia de una liga, acá perder un partido no rompe ningún round-robin.
      if (!home || !away || home === away) continue;
      matches.push({ date: correrAnios(m.date, desplazamiento), home, away, ...(m.round ? { round: m.round } : {}) });
    }
    if (!matches.length) { console.log(`${f.name.padEnd(18)} 0 partidos mapeados, se saltea`); continue; }

    const fechas = matches.map(m => m.date).sort();
    nuevas.push({
      id: f.id, name: f.name, kind: 'domestic_cup', league: f.league,
      // Sus fechas vienen de otra temporada: sirven para saber que el torneo existe y quiénes lo
      // juegan, pero no para ponerlas en el calendario -- corridas de año caen encima de la liga.
      // Ver soloReservas en realCalendarDates.ts.
      soloReservas: true,
      firstDate: fechas[0], lastDate: fechas[fechas.length - 1],
      matches: matches.sort((a, b) => a.date.localeCompare(b.date) || a.home.localeCompare(b.home)),
    });

    const clubes = new Set(matches.flatMap(m => [m.home, m.away]));
    console.log(`${f.name.padEnd(18)} ${String(matches.length).padStart(3)}/${String(crudos.length).padEnd(3)} partidos · ${String(clubes.size).padStart(2)} clubes · ${fechas[0]}..${fechas[fechas.length - 1]}` +
      (desplazamiento ? `  (corrida ${desplazamiento > 0 ? '+' : ''}${desplazamiento} años)` : ''));
    if (sinMapear.size) console.log(`   sin mapear (${sinMapear.size}): ${[...sinMapear].slice(0, 8).join(', ')}${sinMapear.size > 8 ? '…' : ''}`);
  }

  const ids = new Set(nuevas.map(c => c.id));
  const final = [...existentes.filter(c => !ids.has(c.id)), ...nuevas];
  console.log(`\n${existentes.length} -> ${final.length} competiciones | ${final.reduce((n, c) => n + c.matches.length, 0)} partidos`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }
  await writeFile(DESTINO, `${head}${JSON.stringify(final)}${tail}`, 'utf8');
  console.log(`-> ${DESTINO}`);
}

main();
