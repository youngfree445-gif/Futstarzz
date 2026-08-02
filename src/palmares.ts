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

export type TipoTrofeo = 'liga' | 'continental' | 'mundial';

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
}

/**
 * Los trofeos que ganó EL JUGADOR (no el mundo): solo cuentan los títulos de un club en el que
 * estaba, o del seleccionado con el que fue al Mundial.
 *
 * @param profile      Perfil completo de la carrera.
 * @param clubs        CLUBS_DATABASE, para resolver nombres e ids.
 * @param leagueName   Nombre mostrable de una liga (getLeagueDisplay).
 * @param cupName      Nombre mostrable de una copa continental.
 */
export function getPalmares(
  profile: PlayerProfile,
  clubs: readonly ClubLookup[],
  leagueName: (league: string) => string,
  esApeturaClausura: (league: string) => 'colombia' | 'argentina' | null,
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
    const quedanPartidos = season.fixtures?.some(f => !f.played);
    if (quedanPartidos) continue;

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

    trofeos.push({
      id: `liga-${season.leagueKey}-${anio}-${season.semester ?? 0}`,
      nombre: leagueName(clubCampeon.league),
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

  // --- Copas del calendario real (Superliga, Copa Colombia, Libertadores...) ---
  // Estas no tienen bracket en el motor, así que no hay championId: el título se anota en el perfil
  // al ganar la final (ver cupTitles en App.tsx).
  for (const t of profile.cupTitles ?? []) {
    trofeos.push({
      id: `copa-${t.competition}-${t.year}`,
      nombre: t.competition,
      detalle: String(t.year),
      clubName: nombreDe(t.clubId),
      tipo: 'continental',
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
  const peso: Record<TipoTrofeo, number> = { mundial: 0, continental: 1, liga: 2 };
  return trofeos.sort((a, b) => (b.orden - a.orden) || (peso[a.tipo] - peso[b.tipo]));
}
