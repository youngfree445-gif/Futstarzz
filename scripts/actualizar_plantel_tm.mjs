// Carga el plantel real de un club desde los datos de Transfermarkt.
//
// Transfermarkt es mejor fuente que ESPN para planteles porque da la posición DETALLADA -- lateral
// izquierdo, pivote, extremo derecho -- mientras que ESPN solo publica cuatro categorías genéricas
// (Goalkeeper/Defender/Midfielder/Forward). Con las genéricas hubo que repartir posiciones a mano y
// la liga entera quedó sin laterales izquierdos hasta que se corrigió.
//
// Se usa para los clubes que ESPN no cubre: los recién ascendidos, que ESPN todavía lista en
// Segunda División con la página de plantel vacía.
//
// Los planteles viven en data/planteles_tm/<club>.json para no tener que tocar este archivo cada
// vez. Uso:
//   node scripts/actualizar_plantel_tm.mjs <archivo.json> [--dry]

import { readFile, writeFile } from 'node:fs/promises';

const DB = 'src/playersDatabase.json';
const DRY = process.argv.includes('--dry');
// Pisa el valor de mercado de los jugadores que YA estaban, no solo el de los nuevos.
const VALORES = process.argv.includes('--valores');
const ARCHIVO = process.argv[2];

if (!ARCHIVO || ARCHIVO.startsWith('--')) {
  console.error('uso: node scripts/actualizar_plantel_tm.mjs data/planteles_tm/<club>.json [--dry]');
  process.exit(1);
}

const POS = {
  'Portero': 'GK',
  'Defensa central': 'CB', 'Lateral izquierdo': 'LB', 'Lateral derecho': 'RB',
  'Pivote': 'CDM', 'Mediocentro': 'CM', 'Mediocentro ofensivo': 'CAM', 'Mediapunta': 'CAM',
  'Interior derecho': 'RM', 'Interior izquierdo': 'LM',
  'Extremo derecho': 'RW', 'Extremo izquierdo': 'LW',
  'Delantero centro': 'ST', 'Segundo delantero': 'ST',
  // Transfermarkt no siempre tiene la posición detallada: en los clubes chicos hay jugadores con la
  // categoría genérica y nada más. Se les da la posición del centro de su línea, que es la que menos
  // supone. Son pocos -- 68 sobre ~800 -- y la alternativa era dejarlos afuera del plantel.
  //
  // Ojo: esto vale para los que caen sueltos, NO para cargar una liga entera con las cuatro
  // categorías genéricas. Eso ya se hizo una vez con ESPN y dejó a toda la liga con cinco laterales
  // derechos y ningún lateral izquierdo (ver docs/PROMPT_DATOS_Y_SCRAPING.md §5).
  'Defensa': 'CB', 'Centrocampista': 'CM', 'Delantero': 'ST',
};

const CATEGORIA = {
  GK: 'portero', CB: 'defensivo', LB: 'defensivo', RB: 'defensivo', CDM: 'defensivo',
  CM: 'ofensivo', CAM: 'ofensivo', LM: 'ofensivo', RM: 'ofensivo',
  LW: 'ofensivo', RW: 'ofensivo', ST: 'ofensivo',
};

/**
 * Media de un jugador nuevo, a partir de su valor de mercado y su edad.
 *
 * Los clubes chicos y los recién ascendidos valen mucho menos que los grandes -- el jugador más
 * caro de Jaguares son €400k contra los €25M de Muriel en Junior -- así que la escala se calibra
 * sobre ese rango bajo. Quedan competitivos en Primera pero claramente por debajo de los grandes,
 * que es su situación real.
 */
function estimarMedia(valorEur, edad) {
  let m = 58;
  if (valorEur >= 1_000_000) m = 67;
  else if (valorEur >= 400_000) m = 65;
  else if (valorEur >= 250_000) m = 63;
  else if (valorEur >= 150_000) m = 61;
  else if (valorEur >= 100_000) m = 60;
  else if (valorEur >= 50_000) m = 59;
  if (edad != null) {
    if (edad <= 20) m -= 3;
    else if (edad <= 22) m -= 2;
    else if (edad >= 35) m -= 2;
  }
  return Math.max(52, m);
}

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const apellido = s => { const p = norm(s).split(' '); return p[p.length - 1]; };

/**
 * Empareja un nombre de Transfermarkt con el jugador del plantel.
 *
 * Va por nombre completo primero y solo cae al apellido si ese apellido es ÚNICO en el plantel.
 * Emparejar por apellido a secas es peligroso con apellidos frecuentes: Jaguares tiene tres
 * Mosquera (Franklin arquero, Yan y Fabián volantes) y dos Martínez, y el match tomaba al primero
 * de la lista -- llegó a marcar "Edwin Martínez GK -> RB" y "Yan Mosquera GK -> CDM", o sea le
 * cambiaba la posición al arquero.
 */
function buscarExistente(nombreTm, actuales) {
  const objetivo = norm(nombreTm);
  const exacto = actuales.find(p => norm(p.nombre_completo) === objetivo);
  if (exacto) return exacto;

  const ape = apellido(nombreTm);
  const mismos = actuales.filter(p => apellido(p.nombre_completo) === ape);
  if (!mismos.length) return undefined;

  // Con el apellido no alcanza: SIEMPRE tiene que coincidir además algún nombre de pila.
  //
  // Aceptar un apellido único emparejaba a "Edwin Martínez" (lateral, en Transfermarkt) con "Diego
  // Martínez" (arquero, en el juego) y le cambiaba la posición al arquero. Son dos personas
  // distintas: el nombre de pila es lo único que las separa.
  const pilaTm = new Set(objetivo.split(' ').slice(0, -1));
  const porPila = mismos.filter(p => norm(p.nombre_completo).split(' ').slice(0, -1).some(n => pilaTm.has(n)));
  return porPila.length === 1 ? porPila[0] : undefined;
}

async function main() {
  const { teamName, players } = JSON.parse(await readFile(ARCHIVO, 'utf8'));
  const db = JSON.parse(await readFile(DB, 'utf8'));

  const actuales = db.filter(p => p.team_name === teamName);

  // Un club puede no tener NINGÚN jugador todavía -- es el caso del Internacional de Bogotá, que no
  // figuraba en playersDatabase.json y por eso mostraba "este club no tiene jugadores reales
  // cargados". En ese caso se crea el plantel de cero con un team_id nuevo.
  const teamId = actuales.length
    ? actuales[0].team_id
    : Math.max(...db.map(p => Number(p.team_id) || 0)) + 1;
  if (!actuales.length) console.log(`(club nuevo: se crea desde cero con team_id ${teamId})`);
  let maxId = Math.max(...db.map(p => Number(p.player_id) || 0));

  // Los agentes libres, por nombre. Es de donde salen la mayoría de los jugadores de un club que se
  // carga de cero: ya están en la base, sin club, y hay que moverlos en vez de duplicarlos.
  const libres = new Map();
  for (const p of db) {
    if (p.team_name !== 'Agentes libres') continue;
    const k = norm(p.nombre_completo);
    if (!libres.has(k)) libres.set(k, []);
    libres.get(k).push(p);
  }

  const nuevos = [];
  // Los que siguen en el plantel: se marcan al emparejarlos, y los que queden sin marcar son los
  // que se fueron del club.
  const siguen = new Set();
  let entran = 0, corregidos = 0, valoresCorregidos = 0, recuperados = 0;

  for (const j of players) {
    const pos = POS[j.pos];
    if (!pos) { console.error(`  posición desconocida: "${j.pos}" (${j.nombre})`); continue; }

    const existente = buscarExistente(j.nombre, actuales);
    if (existente) siguen.add(existente);
    if (existente) {
      // Se conserva la media (no romper una carrera en curso) y solo se corrige la posición.
      if (existente.posicion_especifica !== pos) {
        console.log(`   ~ ${j.nombre.padEnd(26)} ${existente.posicion_especifica} -> ${pos} (${j.pos})`);
        existente.posicion_especifica = pos;
        existente.categoria_tactica = CATEGORIA[pos];
        corregidos++;
      }
      // Con --valores se pisa además el valor de mercado con el de Transfermarkt. Va detrás de un
      // flag porque lo normal es no tocarlo, pero algunos clubes arrastraban valores inflados x1000
      // de una carga vieja -- 13 millones para un lateral de la Segunda B colombiana -- y esos sí
      // hay que corregirlos.
      if (VALORES && j.valor != null && existente.valor_mercado_eur !== j.valor) {
        console.log(`   € ${j.nombre.padEnd(26)} ${existente.valor_mercado_eur} -> ${j.valor}`);
        existente.valor_mercado_eur = j.valor;
        existente.media_valoracion = estimarMedia(j.valor, j.edad ?? null);
        valoresCorregidos++;
      }
    } else if (libres.get(norm(j.nombre))?.length === 1) {
      // YA ESTÁ EN LA BASE, DE AGENTE LIBRE: se lo mueve, no se lo crea de nuevo.
      //
      // Cuando un club se carga de cero, media plantilla suele estar ya cargada como agente libre
      // -- de los 30 del Rangers de Talca, 23 estaban así. Crearlos otra vez deja al mismo jugador
      // dos veces en la base, que es la falla que cuenta el propio pipeline de fichajes ("el mismo
      // nombre en 2 clubes") y la que hace que un fichaje después mueva la fila equivocada.
      //
      // Sólo desde agentes libres, y sólo si el nombre es único entre ellos. Si el jugador está en
      // OTRO club, no se toca: eso es un fichaje, y los fichajes los aplica npm run fichajes con su
      // propia verificación.
      const suelto = libres.get(norm(j.nombre))[0];
      suelto.team_name = teamName;
      suelto.team_id = teamId;
      suelto.posicion_especifica = pos;
      suelto.categoria_tactica = CATEGORIA[pos];
      libres.delete(norm(j.nombre));
      console.log(`   ← ${j.nombre.padEnd(26)} ${pos.padEnd(3)} (estaba de agente libre)`);
      recuperados++;
    } else {
      const media = estimarMedia(j.valor ?? 0, j.edad ?? null);
      nuevos.push({
        player_id: String(++maxId),
        nombre_completo: j.nombre,
        posicion_especifica: pos,
        valor_mercado_eur: j.valor ?? 50_000,
        media_valoracion: media,
        team_name: teamName,
        team_id: teamId,
        categoria_tactica: CATEGORIA[pos],
      });
      console.log(`   + ${j.nombre.padEnd(26)} ${pos.padEnd(3)} media ${media}`);
      entran++;
    }
  }

  const salen = actuales.filter(p => !siguen.has(p));
  for (const p of salen) console.log(`   - ${p.nombre_completo}`);

  console.log(`\n${teamName}: ${actuales.length} -> ${players.length}`);
  console.log(`  entran ${entran}, vuelven de agentes libres ${recuperados}, salen ${salen.length}, posiciones corregidas ${corregidos}`
    + (VALORES ? `, valores corregidos ${valoresCorregidos}` : ''));

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }

  const aSacar = new Set(salen);
  const final = db.filter(p => !aSacar.has(p)).concat(nuevos);
  await writeFile(DB, JSON.stringify(final), 'utf8');
  console.log(`\n${DB}: ${db.length} -> ${final.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
