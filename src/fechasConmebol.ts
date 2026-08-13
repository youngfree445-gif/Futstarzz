// GENERADO por scripts/generar_fechas_conmebol.mjs. No editar a mano.
//
// Las fechas REALES del knockout de la Copa Libertadores y la Copa Sudamericana, sacadas de los
// calendarios completos de 2025 que estan en data/calendarios/copas (Transfermarkt).
//
// Solo las fechas: los cruces son los de 2025 y en el juego el cuadro lo arma el motor con quien
// haya clasificado en TU carrera. Lo que no cambia de un año al otro es CUANDO se juega cada ronda.
//
// Se guardan como 'MM-DD' porque el año lo pone la temporada de carrera.

export interface FechasDeKnockout {
  /** Un dia por paso del cuadro, en orden: octavos ida, octavos vuelta, cuartos ida... */
  readonly dias: readonly string[];
  /** Para que se vea de donde sale cada uno. */
  readonly rondas: readonly string[];
}

/** Copa Libertadores: 7 pasos de cuadro, de octavos a la final. */
export const FECHAS_KNOCKOUT_LIBERTADORES: FechasDeKnockout = {
  dias: ['08-13', '08-20', '09-17', '09-24', '10-23', '10-30', '11-29'],
  rondas: ['Last 16 1st Leg', 'Last 16 2nd Leg', 'Quarter-Finals 1st Leg', 'Quarter-Finals 2nd Leg', 'Semi-Finals 1st Leg', 'Semi-Finals 2nd Leg', 'Final'],
};

/** Copa Sudamericana: 7 pasos de cuadro, de octavos a la final. */
export const FECHAS_KNOCKOUT_SUDAMERICANA: FechasDeKnockout = {
  dias: ['08-13', '08-20', '09-17', '09-24', '10-22', '10-29', '11-22'],
  rondas: ['Last 16 1st Leg', 'Last 16 2nd Leg', 'Quarter-Finals 1st Leg', 'Quarter-Finals 2nd Leg', 'Semi-Finals 1st Leg', 'Semi-Finals 2nd Leg', 'Final'],
};

/** Por id de competicion, para que dateSchedule las encuentre sin un if. */
export const FECHAS_KNOCKOUT_POR_COPA: Readonly<Record<string, FechasDeKnockout>> = {
  conmebol_libertadores: FECHAS_KNOCKOUT_LIBERTADORES,
  conmebol_sudamericana: FECHAS_KNOCKOUT_SUDAMERICANA,
};
