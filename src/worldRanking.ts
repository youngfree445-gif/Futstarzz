// Ranking mundial de jugadores: compara al jugador contra un pool de "estrellas del mundo"
// generado a partir de starPlayers de clubes de alta reputación -- determinístico por semana
// (hash estable, no Math.random() puro) para que el ranking no cambie en cada render, mismo
// criterio que worldRetirements.ts.
import { Club, PlayerProfile } from './types';

/** Hash estable de un string -> entero positivo. Mismo criterio que worldRetirements.ts. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export interface WorldRankingEntry {
  name: string;
  clubName: string;
  score: number;
  isPlayer: boolean;
}

const WORLD_STAR_MIN_REPUTATION = 4;
const WORLD_STARS_POOL_SIZE = 24;

// Score sintético de una estrella del mundo, estable por semana: se mueve un poco cada semana
// (con el hash de nombre+semana) para que el ranking no quede completamente congelado, pero sin
// depender de Math.random() puro.
function starScore(name: string, week: number): number {
  const base = 70 + (hashName(name) % 28); // 70-97
  const weeklyDrift = (hashName(`${name}_${Math.floor(week / 4)}`) % 7) - 3; // -3 a +3, cambia cada 4 semanas
  return Math.max(0, Math.min(100, base + weeklyDrift));
}

function playerScore(profile: PlayerProfile): number {
  const matchesPlayed = profile.careerStats.partidosHistoricos;
  const contributionPerMatch = matchesPlayed > 0
    ? (profile.careerStats.golesHistoricos + profile.careerStats.asistenciasHistoricos) / matchesPlayed
    : 0;
  return Math.max(0, Math.min(100, profile.prestige * 0.4 + contributionPerMatch * 60 + profile.careerStats.campeonatos * 5));
}

export function generateWorldRanking(profile: PlayerProfile, allClubs: Club[], currentWeek: number): WorldRankingEntry[] {
  const eliteClubs = allClubs.filter(c => c.reputation >= WORLD_STAR_MIN_REPUTATION);
  const pool: WorldRankingEntry[] = [];
  for (const club of eliteClubs) {
    for (const star of club.starPlayers.slice(0, 2)) {
      if (pool.some(p => p.name === star)) continue;
      pool.push({ name: star, clubName: club.name, score: starScore(star, currentWeek), isPlayer: false });
      if (pool.length >= WORLD_STARS_POOL_SIZE) break;
    }
    if (pool.length >= WORLD_STARS_POOL_SIZE) break;
  }

  const myClubName = allClubs.find(c => c.id === profile.currentClubId)?.name ?? '';
  pool.push({ name: profile.name, clubName: myClubName, score: playerScore(profile), isPlayer: true });

  return pool.sort((a, b) => b.score - a.score);
}
