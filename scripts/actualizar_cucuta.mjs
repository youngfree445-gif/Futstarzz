// Plantel real del Cúcuta Deportivo, que acaba de ascender a Primera.
//
// ESPN no sirve acá: todavía lo lista en Segunda División y su página de plantel responde "Sin
// información disponible". La fuente es Transfermarkt (saison_id/2025), que además da las
// posiciones DETALLADAS -- lateral izquierdo, pivote, extremo derecho -- en vez de las cuatro
// genéricas de ESPN, así que no hace falta repartirlas a mano.
//
// Uso: node scripts/actualizar_cucuta.mjs [--dry]

import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const DB = 'src/playersDatabase.json';
const TEAM = 'Cúcuta Deportivo';

// [nombre, posición de Transfermarkt, edad, valor de mercado en euros]
const PLANTEL = [
  ['Federico Abadía', 'Portero', 28, 300_000],
  ['Juan David Ramírez', 'Portero', 29, 150_000],
  ['Johan Velásquez', 'Portero', 22, 50_000],
  ['Diego Calcaterra', 'Defensa central', 25, 400_000],
  ['Jhon Alexander Quiñones', 'Defensa central', 22, 350_000],
  ['Brayan Montaño', 'Defensa central', 24, 250_000],
  ['Hernán Lópes', 'Defensa central', 35, 100_000],
  ['Mauricio Duarte', 'Lateral izquierdo', 34, 100_000],
  ['Alexander Borja', 'Lateral izquierdo', 27, 50_000],
  ['Joao Abonia', 'Lateral derecho', 26, 350_000],
  ['Armando Ballesteros', 'Lateral derecho', 25, 50_000],
  ['Samir Mayo', 'Pivote', 23, 400_000],
  ['Víctor Mejía', 'Pivote', 33, 250_000],
  ['Léider Berdugo', 'Mediocentro', 24, 1_000_000],
  ['Kevin Londoño', 'Mediocentro', 26, 400_000],
  ['Juan Ceballos', 'Mediocentro', 27, 200_000],
  ['Sebastián Támara', 'Mediocentro', 30, 200_000],
  ['Agustín Cano', 'Mediocentro', 25, 50_000],
  ['Lucas Ríos', 'Mediocentro ofensivo', 28, 300_000],
  ['Gustavo Torres', 'Extremo derecho', 30, 175_000],
  ['Marlon Carabalí', 'Extremo derecho', 23, 150_000],
  ['Jader Manyoma', 'Extremo derecho', 22, 100_000],
  ['Jaime Peralta', 'Delantero centro', 21, 350_000],
  ['Jhonatan Agudelo', 'Delantero centro', 33, 100_000],
];

const POS = {
  'Portero': 'GK',
  'Defensa central': 'CB', 'Lateral izquierdo': 'LB', 'Lateral derecho': 'RB',
  'Pivote': 'CDM', 'Mediocentro': 'CM', 'Mediocentro ofensivo': 'CAM',
  'Interior derecho': 'RM', 'Interior izquierdo': 'LM',
  'Extremo derecho': 'RW', 'Extremo izquierdo': 'LW',
  'Delantero centro': 'ST', 'Mediapunta': 'CAM',
};
const CATEGORIA = {
  GK: 'portero', CB: 'defensivo', LB: 'defensivo', RB: 'defensivo', CDM: 'defensivo',
  CM: 'ofensivo', CAM: 'ofensivo', LM: 'ofensivo', RM: 'ofensivo',
  LW: 'ofensivo', RW: 'ofensivo', ST: 'ofensivo',
};

/**
 * Media de un jugador nuevo, a partir de su valor de mercado y su edad.
 *
 * El Cúcuta recién ascendió, así que su plantel vale bastante menos que el de un grande: el jugador
 * más caro son €1M contra los €25M de Muriel en Junior. La escala se calibra sobre ese rango para
 * que el equipo quede competitivo en Primera pero claramente por debajo de los grandes, que es
 * exactamente su situación real.
 */
function media(valorEur, edad) {
  let m = 58;                                  // piso de un recién ascendido
  if (valorEur >= 1_000_000) m = 67;
  else if (valorEur >= 400_000) m = 65;
  else if (valorEur >= 250_000) m = 63;
  else if (valorEur >= 150_000) m = 61;
  else if (valorEur >= 100_000) m = 60;
  if (edad <= 20) m -= 3;
  else if (edad <= 22) m -= 2;
  else if (edad >= 35) m -= 2;
  return Math.max(52, m);
}

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const clave = s => { const p = norm(s).split(' '); return p[p.length - 1]; };

async function main() {
  const db = JSON.parse(await readFile(DB, 'utf8'));
  const actuales = db.filter(p => p.team_name === TEAM);
  const teamId = actuales[0]?.team_id ?? 0;
  let maxId = Math.max(...db.map(p => Number(p.player_id) || 0));

  const porClave = new Map(actuales.map(p => [clave(p.nombre_completo), p]));
  const clavesReales = new Set(PLANTEL.map(t => clave(t[0])));

  const nuevos = [];
  let corregidos = 0, entran = 0;

  for (const [nombre, posTm, edad, valor] of PLANTEL) {
    const pos = POS[posTm] ?? 'CM';
    const existente = porClave.get(clave(nombre));
    if (existente) {
      // Ya estaba: se conserva su media (no alterar carreras en curso) pero se corrige la posición,
      // que en varios casos estaba mal (Abonia figuraba de extremo siendo lateral derecho).
      if (existente.posicion_especifica !== pos) {
        existente.posicion_especifica = pos;
        existente.categoria_tactica = CATEGORIA[pos];
        corregidos++;
      }
    } else {
      const m = media(valor, edad);
      nuevos.push({
        player_id: String(++maxId),
        nombre_completo: nombre,
        posicion_especifica: pos,
        valor_mercado_eur: valor,
        media_valoracion: m,
        team_name: TEAM,
        team_id: teamId,
        categoria_tactica: CATEGORIA[pos],
      });
      entran++;
    }
  }

  const salen = actuales.filter(p => !clavesReales.has(clave(p.nombre_completo)));
  console.log(`${TEAM}: ${actuales.length} -> ${PLANTEL.length}`);
  console.log(`  entran ${entran}, salen ${salen.length}, posiciones corregidas ${corregidos}`);
  for (const p of salen) console.log(`   - ${p.nombre_completo}`);

  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }

  const aSacar = new Set(salen);
  const final = db.filter(p => !aSacar.has(p)).concat(nuevos);
  await writeFile(DB, JSON.stringify(final), 'utf8');
  console.log(`\n${DB}: ${db.length} -> ${final.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
