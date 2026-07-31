// Retiros de OTROS jugadores del mundo (Paso 3).
//
// Cada cierre de temporada, los starPlayers que ya pasaron cierta edad tiran para ver si cuelgan
// los botines. El que se retira deja de aparecer en su club y lo reemplaza un canterano generado,
// con nombre acorde al país del club. Sin esto los planteles del juego quedan congelados: Falcao
// tendría 40 años para siempre y nunca subiría nadie de las inferiores.
//
// La edad sale de TM_SQUAD_ENRICHMENT / PLAYER_ENRICHMENT cuando existe (datos reales de
// Transfermarkt y FC26) y, cuando no, de un hash estable del nombre -- el mismo criterio que ya
// usa la mentoría en Dashboard.tsx, para que un jugador no tenga una edad acá y otra allá.

import { PLAYER_ENRICHMENT } from './playerEnrichment';
import { TM_SQUAD_ENRICHMENT } from './tmSquadEnrichment';

/**
 * Edad máxima para que un jugador del plantel pueda ser tu ahijado en la Mentoría de Jóvenes.
 * Vive acá y no en Dashboard porque App.tsx también lo necesita: al cargar una partida hay que
 * revalidar el ahijado guardado, o un mentee elegido con datos viejos sobrevive para siempre.
 */
export const MENTEE_MAX_AGE = 20;

/** Antes de esta edad nadie se retira. */
export const WORLD_RETIREMENT_MIN_AGE = 34;
/** A esta edad se retira sí o sí, como el jugador humano (ver RETIREMENT_MAX_AGE en App.tsx). */
export const WORLD_RETIREMENT_MAX_AGE = 45;

/**
 * Probabilidad de retirarse al cierre de una temporada, según la edad.
 *
 * Curva pensada sobre los datos reales scrapeados: a los 36-38 todavía juega mucha gente (Tesillo,
 * Sambueza), a los 40-41 quedan los casos excepcionales (Falcao, Dayro, Teófilo, Rodallega). Por
 * eso arranca muy baja y recién se dispara pasados los 40.
 */
export function retirementChanceForAge(age: number): number {
  if (age < WORLD_RETIREMENT_MIN_AGE) return 0;
  if (age >= WORLD_RETIREMENT_MAX_AGE) return 1;
  if (age <= 35) return 0.06;
  if (age <= 37) return 0.14;
  if (age <= 39) return 0.28;
  if (age <= 41) return 0.45;
  if (age <= 43) return 0.65;
  return 0.85;
}

/** Hash estable de un string -> entero positivo. Mismo criterio que getMenteeAge en Dashboard. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Normaliza para comparar nombres: sin acentos, sin sufijo de posición, en minúsculas. */
function normalizeName(s: string): string[] {
  return s
    .replace(/\s*\([^)]*\)\s*$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Índice de respaldo por "clubId|apellido" construido una sola vez.
 *
 * Hace falta porque el mismo jugador aparece con nombres distintos según la fuente: los
 * starPlayers de data.ts dicen "Luis Fernando Muriel" mientras playersDatabase.json (la base de
 * 30.499 jugadores que alimenta la pestaña Mi Club) dice "Luis Muriel". Buscar por clave exacta
 * fallaba y caía al hash, que para "Luis Muriel" da exactamente 20 -- es decir, el sistema
 * ofrecía a un delantero de 35 años como juvenil de la cantera.
 */
const AGE_BY_CLUB_SURNAME: Record<string, number> = (() => {
  const idx: Record<string, number> = {};
  for (const source of [PLAYER_ENRICHMENT, TM_SQUAD_ENRICHMENT] as Record<string, { age?: number }>[]) {
    for (const [key, data] of Object.entries(source)) {
      if (data?.age == null) continue;
      const [clubId, rawName] = key.split('|');
      const parts = normalizeName(rawName ?? '');
      if (parts.length === 0) continue;
      const surname = parts[parts.length - 1];
      const k = `${clubId}|${surname}`;
      // Ante colisión gana la edad MAYOR: para decidir "¿es un juvenil?" equivocarse por arriba
      // deja a alguien fuera de la mentoría, y equivocarse por abajo mete a un veterano.
      idx[k] = Math.max(idx[k] ?? 0, data.age);
    }
  }
  return idx;
})();

/**
 * Edad de un jugador del plantel. Busca en orden:
 *   1. Clave exacta "clubId|nombre" en los dos enriquecimientos.
 *   2. Respaldo por "clubId|apellido", que resuelve las variantes de nombre entre fuentes.
 *   3. Hash estable del nombre (17-36), para los ~600 clubes sin datos scrapeados.
 */
export function getSquadPlayerAge(clubId: string, name: string): number {
  const key = `${clubId}|${name}`;
  const real = PLAYER_ENRICHMENT[key]?.age ?? TM_SQUAD_ENRICHMENT[key]?.age;
  if (real != null) return real;

  const parts = normalizeName(name);
  if (parts.length > 0) {
    const bySurname = AGE_BY_CLUB_SURNAME[`${clubId}|${parts[parts.length - 1]}`];
    if (bySurname != null) return bySurname;
  }

  return 17 + (hashName(name) % 20);
}

// --- Generación de reemplazos -------------------------------------------------------------

// Nombres por región, para que el canterano que sube suene del país del club: un juvenil que
// debuta en Millonarios no puede llamarse Hans Müller. Las listas son cortas a propósito -- se
// combinan nombre + apellido, así que dan cientos de combinaciones por región.
const NAMES_BY_REGION: Record<string, { first: string[]; last: string[] }> = {
  hispano: {
    first: ['Santiago', 'Mateo', 'Nicolás', 'Emiliano', 'Thiago', 'Benjamín', 'Joaquín', 'Bruno',
      'Facundo', 'Lautaro', 'Julián', 'Kevin', 'Brayan', 'Yeison', 'Dylan', 'Maicol', 'Duván',
      'Jhon', 'Cristian', 'Andrés', 'Sebastián', 'Alexis', 'Franco', 'Valentín', 'Tomás'],
    last: ['Gómez', 'Rodríguez', 'Martínez', 'López', 'Pérez', 'Ramírez', 'Torres', 'Moreno',
      'Quintero', 'Mosquera', 'Cárdenas', 'Ospina', 'Zapata', 'Herrera', 'Villalba', 'Sosa',
      'Acosta', 'Benítez', 'Ferreyra', 'Bustos', 'Ledesma', 'Paredes', 'Vega', 'Cabrera'],
  },
  brasil: {
    first: ['Gabriel', 'Lucas', 'Matheus', 'Rafael', 'Pedro', 'Vinícius', 'Kaio', 'Wesley',
      'Éverton', 'Richarlison', 'Diego', 'Bruno', 'Danilo', 'Guilherme', 'Léo', 'Caio'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Almeida', 'Ribeiro',
      'Barbosa', 'Nascimento', 'Carvalho', 'Ferreira', 'Rocha', 'Moraes', 'Teixeira'],
  },
  italia: {
    first: ['Lorenzo', 'Matteo', 'Alessandro', 'Francesco', 'Riccardo', 'Davide', 'Gianluca',
      'Nicolò', 'Federico', 'Andrea', 'Simone', 'Tommaso'],
    last: ['Rossi', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino',
      'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini'],
  },
  inglaterra: {
    first: ['Jack', 'Harry', 'Callum', 'Mason', 'Jude', 'Reece', 'Tyler', 'Kai', 'Ollie',
      'Louie', 'Finley', 'Alfie', 'Rhys', 'Declan'],
    last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans',
      'Thomas', 'Roberts', 'Walker', 'Wright', 'Hughes', 'Green'],
  },
  alemania: {
    first: ['Leon', 'Jonas', 'Luca', 'Finn', 'Noah', 'Elias', 'Paul', 'Tim', 'Maximilian',
      'Felix', 'Julian', 'Niklas'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Hoffmann',
      'Schulz', 'Koch', 'Richter', 'Klein'],
  },
};

/** Liga (Club.league) -> región de nombres. Lo no listado cae a hispano, que cubre casi todo el juego. */
const LEAGUE_REGION: Record<string, keyof typeof NAMES_BY_REGION> = {
  'Brasileña': 'brasil',
  'Italiana': 'italia',
  'Inglesa': 'inglaterra',
  'Alemana': 'alemania',
  'Escocesa': 'inglaterra',
  'Austríaca': 'alemania',
  'Suiza': 'alemania',
};

export interface GeneratedYouth {
  name: string;
  age: number;
}

/**
 * Genera el canterano que ocupa el lugar de un retirado.
 *
 * `seed` hace la generación determinística: la misma temporada y el mismo club producen siempre el
 * mismo juvenil, así que el plantel no cambia de nombres en cada render ni al recargar la partida.
 */
export function generateYouthPlayer(league: string, seed: number, taken: Set<string> = new Set()): GeneratedYouth {
  const region = NAMES_BY_REGION[LEAGUE_REGION[league] ?? 'hispano'];
  // Se prueban varias combinaciones por si la primera ya existe en el plantel (dos juveniles con
  // el mismo nombre romperían los índices "clubId|nombre" del enriquecimiento).
  for (let i = 0; i < 40; i++) {
    const s = seed + i * 7919;
    const name = `${region.first[s % region.first.length]} ${region.last[(s * 31) % region.last.length]}`;
    if (!taken.has(name)) return { name, age: 17 + (s % 4) }; // 17-20: sube de las inferiores
  }
  // Fallback: si todo colisiona, se desambigua con un número. Feo pero nunca deja el club corto.
  return { name: `${region.first[seed % region.first.length]} ${region.last[seed % region.last.length]} II`, age: 18 };
}

/**
 * Devuelve el plantel de un club con los retiros ya aplicados: cada retirado reemplazado por su
 * canterano. Es la función que hay que usar en TODOS lados donde se lea `club.starPlayers`, para
 * que nadie siga viendo a un jugador que ya colgó los botines.
 *
 * Si el club no tuvo retiros devuelve el array original sin copiarlo (la comparación por
 * referencia se mantiene, así React no re-renderiza de más).
 */
export function applySquadRetirements(
  clubId: string,
  starPlayers: string[],
  retired: Record<string, Record<string, string>> | undefined
): string[] {
  const mapa = retired?.[clubId];
  if (!mapa) return starPlayers;
  return starPlayers.map(p => mapa[p] ?? p);
}

export interface RetirementEvent {
  clubId: string;
  clubName: string;
  playerName: string;
  age: number;
  replacementName: string;
}

/**
 * Resuelve los retiros de una temporada para una lista de clubes.
 *
 * Devuelve los eventos ocurridos y el mapa de reemplazos (clubId -> { retirado: canterano }). No
 * muta nada: quien llama decide qué hacer con el resultado.
 */
export function resolveWorldRetirements(
  clubs: { id: string; name: string; league: string; starPlayers: string[] }[],
  seasonYear: number,
  rng: () => number = Math.random
): { events: RetirementEvent[]; replacements: Record<string, Record<string, string>> } {
  const events: RetirementEvent[] = [];
  const replacements: Record<string, Record<string, string>> = {};

  for (const club of clubs) {
    if (!club.starPlayers?.length) continue;
    const taken = new Set(club.starPlayers.map(p => p.replace(/\s*\([^)]*\)\s*$/, '').trim()));

    club.starPlayers.forEach((raw, idx) => {
      const name = raw.replace(/\s*\([^)]*\)\s*$/, '').trim();
      if (!name) return;
      const age = getSquadPlayerAge(club.id, raw);
      if (rng() >= retirementChanceForAge(age)) return;

      const youth = generateYouthPlayer(club.league, seasonYear * 104729 + hashName(club.id) + idx, taken);
      taken.add(youth.name);
      // El reemplazo hereda el sufijo de posición del retirado, si lo tenía: leagueEngine lo
      // parsea para repartir goles, así que perderlo cambiaría el comportamiento del club.
      const suffix = raw.match(/\s*(\([^)]*\))\s*$/)?.[1] ?? '';
      replacements[club.id] = replacements[club.id] ?? {};
      replacements[club.id][raw] = suffix ? `${youth.name} ${suffix}` : youth.name;
      events.push({
        clubId: club.id,
        clubName: club.name,
        playerName: name,
        age,
        replacementName: youth.name,
      });
    });
  }

  return { events, replacements };
}
