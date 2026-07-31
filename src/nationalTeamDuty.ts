// Convocatoria a la selección durante una fecha FIFA: qué cuesta irse.
//
// Regla acordada, y que es la real: el club NO puede negarse. La FIFA obliga a liberar al jugador,
// así que irse nunca se bloquea. Lo que sí pasa es que perderse un partido IMPORTANTE del club
// (una eliminatoria, una final, un clásico) enfría la relación con el entrenador.
//
// La relación con el DT no es un campo aparte: es `prestige`, documentado en types.ts como
// "Relación vestuario / DT". Por eso el costo se aplica ahí y no en un contador nuevo.

import type { RealCompetition } from './realCalendar';

/** Qué se perdió el jugador en el club por estar con la selección. */
export type MissedMatchImportance = 'none' | 'routine' | 'important' | 'decisive';

/**
 * Clasifica cuán grave es perderse un partido, a partir de la competición y la ronda.
 *
 * Un partido de liga en mitad de temporada es rutina y no cuesta nada -- el DT lo asume. Una
 * eliminatoria a partido único o una final sí: ahí el jugador "eligió" la selección por encima del
 * club en el peor momento.
 */
export function classifyMissedMatch(
  comp: RealCompetition | undefined,
  round: string | undefined
): MissedMatchImportance {
  if (!comp) return 'none';
  const r = (round ?? '').toLowerCase();

  // Cuartos y octavos van primero: "Quarter-Finals" contiene "final", así que chequear la final
  // antes los clasificaría a todos como definición.
  if (/quarter|last 16|round of|octavos|cuartos|knockout|playoff|leg/.test(r)) return 'important';

  // Final o semifinal: lo más caro.
  if (/final/.test(r)) return 'decisive';

  // Fase de grupos de una copa continental: importante, aunque menos que una eliminatoria.
  if (comp.kind === 'continental_cup') return 'important';

  // Copa nacional en rondas tempranas y liga regular: rutina.
  return 'routine';
}

/** Golpe a la relación con el DT (`prestige`) por perderse un partido de esa importancia. */
export function prestigeCostOfMissing(importance: MissedMatchImportance): number {
  switch (importance) {
    case 'decisive':
      return -8;
    case 'important':
      return -4;
    case 'routine':
      // El club libera sin drama: los partidos de liga se asumen como parte del calendario FIFA.
      return 0;
    default:
      return 0;
  }
}

/** Texto que se le muestra al jugador cuando el club paga el costo de su convocatoria. */
export function missedMatchNotice(
  importance: MissedMatchImportance,
  clubName: string,
  competitionName: string
): string | null {
  switch (importance) {
    case 'decisive':
      return `😠 Te perdiste una definición de ${competitionName} con ${clubName} por estar con tu selección. El técnico no lo dijo en público, pero en el vestuario se notó.`;
    case 'important':
      return `😐 Te perdiste un partido de eliminación de ${competitionName} con ${clubName} por la fecha FIFA. El cuerpo técnico lo entiende, pero te lo hizo saber.`;
    default:
      // Rutina: no se notifica nada, para no llenar la pantalla de avisos irrelevantes.
      return null;
  }
}

/**
 * Umbral a partir del cual la acumulación pesa: irse una vez es normal, hacerlo repetidamente en
 * partidos grandes es lo que termina de romper la relación.
 */
export const MISSED_IMPORTANT_MATCHES_THRESHOLD = 3;

/** Penalización extra al cierre de temporada si la acumulación superó el umbral. */
export function seasonEndPrestigePenalty(missedImportant: number): number {
  if (missedImportant < MISSED_IMPORTANT_MATCHES_THRESHOLD) return 0;
  // Escala suave: cada partido importante por encima del umbral suma otro golpe chico.
  return -3 * (missedImportant - MISSED_IMPORTANT_MATCHES_THRESHOLD + 1);
}
