// Palmarés del jugador: los trofeos que ganó a lo largo de la carrera.
//
// No guarda estado propio a propósito. Todo lo que hace falta ya vive en el perfil -- las tablas de
// cada liga (leagueSeasons), las copas continentales (continentalCups, uefaCups), el Mundial
// (worldCups) y la trayectoria club a club (seasonHistory) -- así que el palmarés se DERIVA de esos
// datos cada vez que se pide.
//
// La alternativa era agregar un array `trofeos` al PlayerProfile y escribirle en cada coronación.
// Se descartó: las partidas ya guardadas no lo tendrían y arrancarían con la vitrina vacía aunque
// el jugador hubiera salido campeón. Derivándolo, una carrera vieja muestra su palmarés completo
// sin migrar nada.

import { CupState, LeagueSeasonState, PlayerProfile, UefaCupState, WorldCupState } from './types';
import { CAREER_START_YEAR, sortTable } from './leagueEngine';
import { hasDatedLeagueSchedule } from './dateSchedule';

// 'copa' son las copas NACIONALES (Copa BetPlay, Copa del Rey): se separan de las continentales
// para que la vitrina no las muestre con el mismo ícono que una Libertadores.
export type TipoTrofeo = 'liga' | 'copa' | 'continental' | 'mundial';

export interface Trofeo {
  id: string;            // estable: sirve de key en React y para deduplicar
  nombre: string;        // "Liga BetPlay Dimayor", "Copa Libertadores"
  detalle: string;       // "Clausura 2027", "2029"
  clubName: string;      // con qué club lo ganó
  tipo: TipoTrofeo;
  orden: number;         // año aproximado, para ordenar del más nuevo al más viejo
}

interface ClubLookup {
  id: string;
  name: string;
  league: string;
  division?: number;
}

/**
 * Los trofeos que ganó EL JUGADOR (no el mundo): solo cuentan los títulos de un club en el que
 * estaba, o del seleccionado con el que fue al Mundial.
 *
 * @param profile      Perfil completo de la carrera.
 * @param clubs        CLUBS_DATABASE, para resolver nombres e ids.
 * @param leagueName   Nombre mostrable de una liga (getLeagueDisplay). Recibe la división del club
 *                     campeón para que un título de Segunda no se anuncie con el nombre de Primera.
 * @param cupName      Nombre mostrable de una copa continental.
 */
export function getPalmares(
  profile: PlayerProfile,
  clubs: readonly ClubLookup[],
  leagueName: (league: string, division?: number) => string,
  esApeturaClausura: (league: string) => boolean,
  seleccionId?: string,
): Trofeo[] {
  const trofeos: Trofeo[] = [];
  const nombreDe = (id: string) => clubs.find(c => c.id === id)?.name ?? '';

  // Todos los clubes por los que pasó, para saber si un título es suyo. Se usa seasonHistory y no
  // solo currentClubId: si ganaste la liga con un club y después te transferiste, el trofeo sigue
  // siendo tuyo.
  const misClubes = new Set<string>(profile.seasonHistory.map(s => s.clubId));
  misClubes.add(profile.currentClubId);

  // --- Ligas ---
  // Campeón = primero de la tabla con el fixture terminado. Es el mismo criterio que usa App.tsx
  // para disparar el festejo de campeón, así que la vitrina no puede contradecir al overlay.
  for (const season of Object.values(profile.leagueSeasons ?? {}) as LeagueSeasonState[]) {
    if (!season?.table?.length) continue;

    // Ojo con la diferencia entre "no quedan partidos" y "no hay partidos".
    //
    // Las ligas con calendario real se crean con `fixtures: []` a propósito (ver
    // getOrCreateSeasonForLeague): los partidos los resuelve resolveLigaPorFecha, no un fixture
    // pregenerado. Con la guarda vieja, `[].some(...)` daba false y el torneo se leía como
    // TERMINADO ya en el minuto cero de la carrera: se coronaba al primero de una tabla con todo
    // en 0 -- que por el orden estable de sortTable es el primer club del array de la liga. El
    // jugador de ese club arrancaba con un título que nunca jugó.
    //
    // Esas ligas no necesitan este bloque: su campeón lo anota App.tsx en cupTitles al ganarlo.
    // Acá sólo queda la deducción de respaldo para las ligas de fixture pregenerado.
    // Quién sería el campeón, para poder preguntar si su liga tiene calendario real.
    const clubCampeonPosible = clubs.find(c => {
      const lider = sortTable([...season.table])[0];
      return lider && (c.id === lider.clubId || c.name === lider.name);
    });

    // LAS LIGAS CON CALENDARIO REAL NO PASAN POR ACÁ. Y la guarda es por el CLUB, no por si el
    // array de fixtures está vacío, que es donde estuvo el bug durante semanas.
    //
    // La guarda vieja asumía que un fixture vacío identificaba a esas ligas. Es cierto el primer
    // día y deja de serlo en cuanto se juega: resolveLigaPorFecha va AGREGANDO a `fixtures` los
    // partidos que resuelve, y sólo agrega los que ya se jugaron -- nunca los pendientes. Osea que
    // a las ocho fechas el array tiene ocho partidos y los ocho están jugados, así que
    // `some(f => !f.played)` da false y el torneo se lee como TERMINADO. En febrero.
    //
    // Resultado: la vitrina coronaba al primero de la tabla a mitad del Apertura. Reportado varias
    // veces, y las dos correcciones anteriores fallaron porque arreglaron dónde se EMITE el título
    // (App.tsx) sin ver que la vitrina lo DERIVA por su cuenta acá.
    //
    // Estas ligas no necesitan derivación: su campeón lo anota App.tsx en cupTitles al ganarlo, y
    // ahora con doble llave -- sólo el último día del torneo y sólo habiendo jugado la mitad de las
    // fechas (ver jugoElTorneo). Acá abajo queda únicamente el respaldo para las ligas de fixture
    // pregenerado, que sí llevan los partidos pendientes en el array.
    if (hasDatedLeagueSchedule(clubCampeonPosible?.name ?? '')) continue;
    if (!season.fixtures?.length) continue;
    if (season.fixtures.some(f => !f.played)) continue;

    // Y aunque haya fixture, una tabla sin un solo partido jugado no corona a nadie.
    if (!season.table.some(t => t.pj > 0)) continue;

    const campeon = sortTable([...season.table])[0];
    if (!campeon) continue;
    const clubCampeon = clubs.find(c => c.id === campeon.clubId || c.name === campeon.name);
    if (!clubCampeon || !misClubes.has(clubCampeon.id)) continue;

    // La temporada en curso: seasonHistory abre un tramo por año de carrera, así que su último
    // seasonNum es el año actual. La tabla de una liga no guarda el año en el que se jugó.
    const seasonNum = profile.seasonHistory[profile.seasonHistory.length - 1]?.seasonNum ?? 1;
    const anio = CAREER_START_YEAR + seasonNum - 1;
    const formato = esApeturaClausura(clubCampeon.league);
    const detalle = formato
      ? `${season.semester === 2 ? 'Clausura' : 'Apertura'} ${anio}`
      : `Temporada ${anio}`;

    // Si el título ya quedó anotado en cupTitles al ganarlo (lo normal desde que App.tsx lo
    // registra), no se agrega de nuevo: se compara por liga y torneo, que es lo que lo identifica.
    const yaAnotado = (profile.cupTitles ?? []).some(t =>
      t.tipo === 'liga'
      && t.year === anio
      && t.competition === leagueName(clubCampeon.league)
      && (t.torneo ?? '') === (formato ? (season.semester === 2 ? 'Clausura' : 'Apertura') : ''));
    if (yaAnotado) continue;

    trofeos.push({
      id: `liga-${season.leagueKey}-${anio}-${season.semester ?? 0}`,
      nombre: leagueName(clubCampeon.league, clubCampeon.division),
      detalle,
      clubName: clubCampeon.name,
      tipo: 'liga',
      orden: anio,
    });
  }

  // --- Copas continentales (Libertadores / Sudamericana) ---
  for (const cup of Object.values(profile.continentalCups ?? {}) as CupState[]) {
    if (cup?.stage !== 'done' || !cup.championId) continue;
    if (!misClubes.has(cup.championId)) continue;
    trofeos.push({
      id: `conmebol-${cup.cupId}-${cup.year}`,
      nombre: cup.cupId === 'libertadores' ? 'Copa Libertadores' : 'Copa Sudamericana',
      detalle: String(cup.year),
      clubName: nombreDe(cup.championId),
      tipo: 'continental',
      orden: cup.year,
    });
  }

  // --- Champions / Europa League ---
  for (const cup of Object.values(profile.uefaCups ?? {}) as UefaCupState[]) {
    if (cup?.stage !== 'done' || !cup.championId) continue;
    if (!misClubes.has(cup.championId)) continue;
    trofeos.push({
      id: `uefa-${cup.cupId}-${cup.year}`,
      nombre: cup.cupId === 'champions' ? 'UEFA Champions League' : 'UEFA Europa League',
      detalle: `Edición ${cup.year}`,
      clubName: nombreDe(cup.championId),
      tipo: 'continental',
      orden: CAREER_START_YEAR + cup.year,
    });
  }

  // --- Títulos anotados al ganarlos (cupTitles) ---
  // Copas del calendario real (Superliga, Copa Colombia...) y TAMBIÉN los campeonatos de liga.
  // Las ligas se anotan acá porque el bloque de arriba las deduce del estado en curso, y ese estado
  // se reinicia: al empezar el Clausura, el Apertura ganado desaparecía de la vitrina.
  for (const t of profile.cupTitles ?? []) {
    trofeos.push({
      id: `titulo-${t.competition}-${t.year}-${t.torneo ?? ''}`,
      nombre: t.competition,
      detalle: t.torneo ? `${t.torneo} ${t.year}` : String(t.year),
      clubName: nombreDe(t.clubId),
      // Las copas nacionales (Copa BetPlay, Superliga) van como 'copa', no como 'continental':
      // compartir tipo con la Libertadores les daba el mismo ícono en la vitrina.
      tipo: t.tipo === 'liga' ? 'liga' : 'copa',
      orden: t.year,
    });
  }

  // --- Mundial ---
  // Acá el "club" es el seleccionado, así que no se filtra por misClubes: se compara contra el
  // equipo nacional con el que el jugador fue convocado.
  for (const wc of Object.values(profile.worldCups ?? {}) as WorldCupState[]) {
    if (wc?.stage !== 'done' || !wc.championId) continue;
    if (!seleccionId || wc.championId !== seleccionId) continue;
    trofeos.push({
      id: `mundial-${wc.year}`,
      nombre: 'Copa del Mundo',
      detalle: String(wc.year),
      clubName: 'Selección',
      tipo: 'mundial',
      orden: wc.year,
    });
  }

  // Más nuevo primero, y a igualdad de año el trofeo más importante arriba.
  // La copa nacional pesa menos que la liga: ganar el campeonato vale más que la copa.
  const peso: Record<TipoTrofeo, number> = { mundial: 0, continental: 1, liga: 2, copa: 3 };
  return trofeos.sort((a, b) => (b.orden - a.orden) || (peso[a.tipo] - peso[b.tipo]));
}
