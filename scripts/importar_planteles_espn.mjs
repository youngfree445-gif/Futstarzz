// Trae los planteles REALES de ESPN a src/playersDatabase.json.
//
// El usuario notó que la plantilla del juego mostraba menos jugadores que ESPN. Medido en los 20
// clubes de Colombia: ESPN 548 vs juego 480, con 214 jugadores de ESPN que no estaban en la base y
// 159 de la base que ya no están en el club.
//
// ESPN manda: entran los que faltan y salen los que ya no están. Así el plantel del juego es el
// plantel de verdad, con dorsal, edad, posición y nacionalidad reales.
//
// Lo que NO se toca:
//  - Los jugadores de otros clubes/ligas (solo se reescriben los 20 clubes colombianos).
//  - La media y el valor de los que YA existían: se conservan para no alterar el balance del juego
//    ni la progresión de una carrera en curso. Solo los jugadores nuevos reciben valores estimados.
//
// Uso: node scripts/importar_planteles_espn.mjs [--dry]

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';

const execFileAsync = promisify(execFile);
const DRY = process.argv.includes('--dry');
const DB = 'src/playersDatabase.json';

// id de ESPN -> team_name que usa playersDatabase.json para ese club.
// Ojo: es el team_name del JSON, no el name de data.ts. El puente entre ambos es EQUIPO_SYNONYMS.
const CLUBS = {
  9761: 'Alianza F.C.', 8109: 'América de Cali', 6137: 'Bucaramanga',
  4815: 'Junior', 5264: 'Atl. Nacional', 5480: 'Boyacá Chicó',
  5489: 'Deportes Tolima', 2672: 'Deportivo Cali', 5485: 'Deportivo Pasto',
  5486: 'Dep. Pereira', 4928: 'Fortaleza CEIF', 2690: 'DIM',
  5488: 'Santa Fe', 7915: 'Llaneros F.C.', 5484: 'Millonarios',
  2919: 'Once Caldas', 9762: 'Águilas Doradas',
};
// Cúcuta (6101) y Jaguares (10309) quedan afuera: ESPN los tiene en Segunda División y su página de
// plantel responde "Sin información disponible". Se conserva el plantel que ya tenía el juego.
// Internacional de Bogotá (7445) devuelve 1 solo jugador, así que tampoco se importa.

const UA = 'Mozilla/5.0'; // cualquier UA que mencione Chrome recibe 202 con cuerpo vacío

// ESPN solo publica CUATRO posiciones: Goalkeeper, Defender, Midfielder y Forward. No distingue
// laterales de centrales ni volantes de marca de enganches.
//
// Mapear "Defender" -> CB a secas dejaba a toda la liga con 5 laterales y ningún lateral izquierdo,
// o sea equipos que no se pueden parar en la cancha. Por eso, dentro de cada categoría se reparten
// posiciones concretas siguiendo una plantilla realista, en el orden en que ESPN los lista (que
// suele ir por dorsal, así que los primeros defensas tienden a ser los centrales titulares).
const REPARTO = {
  Defender: ['CB', 'CB', 'LB', 'RB', 'CB', 'LB', 'RB', 'CB'],
  Midfielder: ['CDM', 'CM', 'CM', 'CAM', 'CDM', 'LM', 'RM', 'CM'],
  Forward: ['ST', 'LW', 'RW', 'ST', 'CAM', 'LW', 'RW', 'ST'],
};

const CATEGORIA = {
  GK: 'portero',
  CB: 'defensivo', LB: 'defensivo', RB: 'defensivo', CDM: 'defensivo',
  CM: 'ofensivo', CAM: 'ofensivo', LM: 'ofensivo', RM: 'ofensivo',
  LW: 'ofensivo', RW: 'ofensivo', ST: 'ofensivo',
};

/** Posición concreta para el n-ésimo jugador de una línea. */
function posicionConcreta(positionName, indice) {
  if (positionName === 'Goalkeeper') return 'GK';
  const plantilla = REPARTO[positionName];
  if (!plantilla) return 'CM';
  return plantilla[indice % plantilla.length];
}

async function bajarPlantel(espnId) {
  const url = `https://www.espn.com.co/futbol/equipo/plantel/_/id/${espnId}`;
  const { stdout: html } = await execFileAsync('curl', ['-sS', '-A', UA, url], { maxBuffer: 64 * 1024 * 1024 });

  // Se recorta contando llaves: el JSON contiene "</script>" escapado y un regex cortaba mal.
  const marca = html.indexOf("window['__espnfitt__']=");
  if (marca < 0) return [];
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
  if (fin < 0) return [];

  const grupos = JSON.parse(html.slice(inicio, fin))?.page?.content?.squad?.groups ?? [];
  const out = [];
  // Un contador por línea: reparte CB/LB/RB entre los defensas, CDM/CM/CAM entre los mediocampistas.
  const vistos = {};
  for (const g of grupos) {
    for (const a of g.athletes ?? []) {
      const linea = a.positionName || (g.name === 'Arqueros' ? 'Goalkeeper' : 'Midfielder');
      vistos[linea] = (vistos[linea] ?? 0);
      const pos = posicionConcreta(linea, vistos[linea]++);
      out.push({
        nombre: a.name,
        dorsal: a.jersey ? Number(a.jersey) : null,
        pos,
        categoria: CATEGORIA[pos] ?? 'ofensivo',
        edad: a.age ? Number(a.age) : null,
        nac: a.ctz ?? null,
      });
    }
  }
  return out;
}

const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
/** Clave de emparejamiento: apellido. Los nombres de pila varían entre fuentes ("Jhon"/"John"). */
const clave = s => { const p = norm(s).split(' '); return p[p.length - 1]; };

/**
 * Media estimada para un jugador NUEVO, que no existe en la base.
 *
 * Se calibra contra lo que ya hay en los clubes colombianos (medias 55-78, mediana 68) para que los
 * que entran no desbalanceen el juego. La edad es el único dato de forma que da ESPN: los juveniles
 * y los muy veteranos rinden menos que un jugador en plenitud.
 */
function estimarMedia(edad, medianaDelClub) {
  const base = medianaDelClub ?? 67;
  if (edad == null) return base - 3;
  if (edad <= 18) return base - 7;
  if (edad <= 20) return base - 5;
  if (edad <= 22) return base - 3;
  if (edad <= 30) return base - 1;   // plenitud: apenas por debajo de los titulares ya cargados
  if (edad <= 34) return base - 2;
  return base - 4;
}

const valorPorMedia = media => Math.max(2_000_000, Math.round((media - 50) * 1_000_000));

async function main() {
  const db = JSON.parse(await readFile(DB, 'utf8'));
  const antes = db.length;

  // Lo que ya existe, por club, para conservar media/valor de los que siguen.
  const porClub = new Map();
  for (const p of db) {
    if (!porClub.has(p.team_name)) porClub.set(p.team_name, []);
    porClub.get(p.team_name).push(p);
  }

  let maxId = Math.max(...db.map(p => Number(p.player_id) || 0));
  const aEliminar = new Set();
  const nuevos = [];
  const resumen = [];

  for (const [espnId, teamName] of Object.entries(CLUBS)) {
    const espn = await bajarPlantel(espnId);
    if (!espn.length) { console.log(`${teamName.padEnd(20)} SIN DATOS EN ESPN -- se deja como está`); continue; }

    const actuales = porClub.get(teamName) ?? [];
    const teamId = actuales[0]?.team_id ?? 0;
    const medias = actuales.map(p => p.media_valoracion).sort((a, b) => a - b);
    const mediana = medias.length ? medias[Math.floor(medias.length / 2)] : null;

    const porClave = new Map(actuales.map(p => [clave(p.nombre_completo), p]));
    const clavesEspn = new Set(espn.map(e => clave(e.nombre)));

    let entran = 0, quedan = 0;
    for (const e of espn) {
      const existente = porClave.get(clave(e.nombre));
      if (existente) {
        // Ya estaba: se conservan media y valor (no alterar el balance), se actualizan los datos
        // que ESPN sí conoce y la base no tenía bien.
        existente.posicion_especifica = e.pos;
        existente.categoria_tactica = e.categoria;
        quedan++;
      } else {
        const media = estimarMedia(e.edad, mediana);
        nuevos.push({
          player_id: String(++maxId),
          nombre_completo: e.nombre,
          posicion_especifica: e.pos,
          valor_mercado_eur: valorPorMedia(media),
          media_valoracion: media,
          team_name: teamName,
          team_id: teamId,
          categoria_tactica: e.categoria,
        });
        entran++;
      }
    }

    // Los que ESPN ya no lista: salen del club.
    let salen = 0;
    for (const p of actuales) {
      if (!clavesEspn.has(clave(p.nombre_completo))) { aEliminar.add(p); salen++; }
    }

    resumen.push([teamName, actuales.length, espn.length, entran, salen, quedan]);
  }

  console.log('\nclub'.padEnd(21), 'ANTES', 'ESPN', 'ENTRAN', 'SALEN', 'QUEDAN');
  for (const r of resumen) {
    console.log(r[0].padEnd(20), String(r[1]).padStart(5), String(r[2]).padStart(5), String(r[3]).padStart(6), String(r[4]).padStart(6), String(r[5]).padStart(6));
  }
  console.log(`\ntotal: entran ${nuevos.length}, salen ${aEliminar.size}`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }

  const final = db.filter(p => !aEliminar.has(p)).concat(nuevos);
  await writeFile(DB, JSON.stringify(final), 'utf8');
  console.log(`\n${DB}: ${antes} -> ${final.length} jugadores`);
}

main().catch(e => { console.error(e); process.exit(1); });
