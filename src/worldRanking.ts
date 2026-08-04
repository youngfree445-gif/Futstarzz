// Ranking mundial de jugadores: compara al jugador contra un pool de estrellas REALES del fútbol
// mundial (Balón de Oro 2025, FIFA The Best 2025, IFFHS World's Best Player 2025 -- las tres
// coinciden en el mismo núcleo de nombres), no contra starPlayers de clubes del juego.
//
// Antes esto tomaba los starPlayers de cualquier club con reputation >= 4 y les inventaba un score
// 70-97 por hash de nombre -- resultado: jugadores de nivel doméstico (ej. un suplente de un club
// colombiano) terminaban con puntajes de nivel Balón de Oro, y ninguno de los nombres reales del
// pool era realmente "el mejor del mundo". Reportado: "estos datos no son ciertos, ni en el juego
// ni en la realidad".
import { PlayerProfile } from './types';

export interface WorldRankingEntry {
  name: string;
  clubName: string;
  score: number;
  isPlayer: boolean;
}

/** Hash estable de un string -> entero positivo. Mismo criterio que worldRetirements.ts. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Los ~30 mejores jugadores del mundo reales, según el consenso entre Balón de Oro 2025, FIFA The
 * Best 2025 e IFFHS World's Best Player 2025 (las tres listas comparten el mismo núcleo de
 * nombres). El score base refleja ese consenso: Tier S 96-99, Tier A 91-95, Tier B 86-90,
 * Tier C 80-85, veteranos fuera de las top 5 ligas 75-79.
 */
const ELITE_WORLD_POOL: { name: string; clubName: string; baseScore: number }[] = [
  // Tier S
  { name: 'Ousmane Dembélé', clubName: 'PSG', baseScore: 99 },
  { name: 'Lamine Yamal', clubName: 'Barcelona', baseScore: 98 },
  { name: 'Vitinha', clubName: 'PSG', baseScore: 96 },
  { name: 'Kylian Mbappé', clubName: 'Real Madrid', baseScore: 97 },
  { name: 'Mohamed Salah', clubName: 'Liverpool', baseScore: 96 },
  // Tier A
  { name: 'Raphinha', clubName: 'Barcelona', baseScore: 94 },
  { name: 'Achraf Hakimi', clubName: 'PSG', baseScore: 93 },
  { name: 'Cole Palmer', clubName: 'Chelsea', baseScore: 92 },
  { name: 'Gianluigi Donnarumma', clubName: 'Manchester City', baseScore: 92 },
  { name: 'Harry Kane', clubName: 'Bayern Munich', baseScore: 94 },
  { name: 'Pedri', clubName: 'Barcelona', baseScore: 93 },
  { name: 'Erling Haaland', clubName: 'Manchester City', baseScore: 95 },
  { name: 'Vinícius Jr.', clubName: 'Real Madrid', baseScore: 93 },
  // Tier B
  { name: 'Nuno Mendes', clubName: 'PSG', baseScore: 89 },
  { name: 'Khvicha Kvaratskhelia', clubName: 'PSG', baseScore: 90 },
  { name: 'Désiré Doué', clubName: 'PSG', baseScore: 89 },
  { name: 'Viktor Gyökeres', clubName: 'Sporting CP', baseScore: 88 },
  { name: 'Scott McTominay', clubName: 'Napoli', baseScore: 87 },
  { name: 'João Neves', clubName: 'PSG', baseScore: 88 },
  { name: 'Lautaro Martínez', clubName: 'Inter de Milán', baseScore: 89 },
  { name: 'Jude Bellingham', clubName: 'Real Madrid', baseScore: 90 },
  { name: 'Florian Wirtz', clubName: 'Bayer Leverkusen', baseScore: 88 },
  { name: 'Bruno Guimarães', clubName: 'Newcastle', baseScore: 87 },
  { name: 'Trent Alexander-Arnold', clubName: 'Real Madrid', baseScore: 88 },
  { name: 'Virgil van Dijk', clubName: 'Liverpool', baseScore: 89 },
  { name: 'Declan Rice', clubName: 'Arsenal', baseScore: 88 },
  // Tier C
  { name: 'Serhou Guirassy', clubName: 'Borussia Dortmund', baseScore: 84 },
  { name: 'Alexis Mac Allister', clubName: 'Liverpool', baseScore: 85 },
  { name: 'Fabián Ruiz', clubName: 'PSG', baseScore: 84 },
  { name: 'Denzel Dumfries', clubName: 'Inter de Milán', baseScore: 83 },
  { name: 'Michael Olise', clubName: 'Bayern Munich', baseScore: 85 },
  { name: 'Aurélien Tchouaméni', clubName: 'Real Madrid', baseScore: 84 },
  { name: 'Jan Oblak', clubName: 'Atlético Madrid', baseScore: 83 },
  { name: 'Christian Pulisic', clubName: 'AC Milan', baseScore: 82 },
  // Veteranos icónicos, fuera de las top 5 ligas europeas
  { name: 'Lionel Messi', clubName: 'Inter Miami', baseScore: 79 },
  { name: 'Robert Lewandowski', clubName: 'Chicago Fire', baseScore: 77 },
];

// Variación semanal leve (±2) para que el ranking respire sin depender de Math.random() puro ni
// desviarse del consenso real -- mismo criterio de estabilidad que worldRetirements.ts.
function weeklyDrift(name: string, week: number): number {
  return (hashName(`${name}_${Math.floor(week / 4)}`) % 5) - 2;
}

/**
 * Score del jugador del usuario, en la MISMA escala 0-100 que el pool real de arriba. La franja
 * alta (90+) tiene que ser un techo casi inalcanzable en una carrera normal, igual que en la
 * realidad: un promedio de calificación sostenido cerca del máximo del juego, muchos títulos y
 * prestigio alto a la vez, no una sola de esas cosas.
 *
 * Antes esto era `prestige*0.4 + contribución*60 + títulos*5` sin techo real: un jugador con buen
 * prestigio y pocos partidos ya arañaba los 90 sin haber demostrado nada a nivel de carrera.
 */
function playerScore(profile: PlayerProfile): number {
  const partidos = profile.careerStats.partidosHistoricos;
  if (partidos < 20) return 0; // sin muestra suficiente, no compite con el pool real todavía

  // Promedio de calificación de partido, normalizado: 6.0 es un partido gris, 8.5+ es un nivel de
  // elite mundial sostenido. Fuera de ese rango realista se recorta.
  const promedioCalificacion = profile.careerStats.sumaCalificacionesHistoricas / partidos;
  const nivelRendimiento = Math.max(0, Math.min(1, (promedioCalificacion - 6.0) / 2.5)); // 0-1

  const contribucionPorPartido = (profile.careerStats.golesHistoricos + profile.careerStats.asistenciasHistoricos) / partidos;
  const nivelContribucion = Math.max(0, Math.min(1, contribucionPorPartido / 1.0)); // 1 gol+asist/partido = techo

  const nivelTitulos = Math.max(0, Math.min(1, profile.careerStats.campeonatos / 8)); // 8 títulos = techo

  // Rendimiento sostenido pesa más que contribución bruta o títulos sueltos: un defensor o
  // arquero de elite real no mete goles pero sí sostiene una calificación altísima.
  const compuesto = nivelRendimiento * 0.55 + nivelContribucion * 0.25 + nivelTitulos * 0.20;

  // 65 es un jugador consolidado de primer nivel doméstico; 99 es inalcanzable salvo con una
  // carrera de elite sostenida en las tres dimensiones a la vez.
  return Math.round(65 + compuesto * 34);
}

export function generateWorldRanking(profile: PlayerProfile, myClubName: string, currentWeek: number): WorldRankingEntry[] {
  const pool: WorldRankingEntry[] = ELITE_WORLD_POOL.map(p => ({
    name: p.name,
    clubName: p.clubName,
    score: Math.max(0, Math.min(100, p.baseScore + weeklyDrift(p.name, currentWeek))),
    isPlayer: false,
  }));

  pool.push({ name: profile.name, clubName: myClubName, score: playerScore(profile), isPlayer: true });

  return pool.sort((a, b) => b.score - a.score);
}
