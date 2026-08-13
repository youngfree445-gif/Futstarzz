// GENERADO por scripts/generar_fechas_fifa.mjs. No editar a mano.
//
// Las fechas FIFA reales, sacadas de las eliminatorias pasadas que hay en
// data/calendarios/eliminatorias (Transfermarkt). Se guardan SÓLO LAS FECHAS: el rival y la ronda
// los pone el motor, porque de un ciclo al siguiente cambian los clasificados y hasta el formato.
// Lo que no cambia es cuándo se juega.
//
// Cada entrada es [años antes del Mundial, 'MM-DD']. Guardarlas así -- y no como fechas absolutas --
// es lo que las hace servir para cualquier ciclo: las sudamericanas de 2023/24/25 rumbo al Mundial
// 2026 se vuelven 2027/28/29 rumbo al de 2030, y 2031/32/33 rumbo al de 2034.

export type FechaFifa = readonly [aniosAntesDelMundial: number, mesDia: string];

/** Las de la eliminatoria sudamericana: se reparte en los tres años previos al Mundial. */
export const FECHAS_FIFA_CONMEBOL: readonly FechaFifa[] = [
  [3, '09-08'], [3, '09-09'], [3, '09-12'], [3, '09-13'], [3, '10-12'], [3, '10-13'],
  [3, '10-17'], [3, '10-18'], [3, '11-16'], [3, '11-17'], [3, '11-22'], [2, '09-05'],
  [2, '09-06'], [2, '09-07'], [2, '09-10'], [2, '09-11'], [2, '10-10'], [2, '10-11'],
  [2, '10-12'], [2, '10-15'], [2, '10-16'], [2, '11-14'], [2, '11-15'], [2, '11-16'],
  [2, '11-19'], [2, '11-20'], [1, '03-21'], [1, '03-22'], [1, '03-25'], [1, '03-26'],
  [1, '06-06'], [1, '06-07'], [1, '06-10'], [1, '06-11'], [1, '09-05'], [1, '09-10'],
];

/** Las de la europea: entran casi enteras en el año anterior al Mundial. */
export const FECHAS_FIFA_UEFA: readonly FechaFifa[] = [
  [1, '03-21'], [1, '03-22'], [1, '03-24'], [1, '03-25'], [1, '06-06'], [1, '06-07'],
  [1, '06-09'], [1, '06-10'], [1, '09-04'], [1, '09-05'], [1, '09-06'], [1, '09-07'],
  [1, '09-08'], [1, '09-09'], [1, '10-09'], [1, '10-10'], [1, '10-11'], [1, '10-12'],
  [1, '10-13'], [1, '10-14'], [1, '11-13'], [1, '11-14'], [1, '11-15'], [1, '11-16'],
  [1, '11-17'], [1, '11-18'],
];

/**
 * La unión de todas: es la que el calendario le reserva a CADA club.
 *
 * Tiene que ser la unión y no la de su confederación, porque el calendario es del CLUB y el jugador
 * puede ser de cualquier lado: un colombiano en el Barcelona necesita libre la fecha sudamericana, y
 * un español en Millonarios la europea.
 */
export const FECHAS_FIFA: readonly FechaFifa[] = [
  [3, '09-08'], [3, '09-09'], [3, '09-12'], [3, '09-13'], [3, '10-12'], [3, '10-13'],
  [3, '10-17'], [3, '10-18'], [3, '11-16'], [3, '11-17'], [3, '11-22'], [2, '09-05'],
  [2, '09-06'], [2, '09-07'], [2, '09-10'], [2, '09-11'], [2, '10-10'], [2, '10-11'],
  [2, '10-12'], [2, '10-15'], [2, '10-16'], [2, '11-14'], [2, '11-15'], [2, '11-16'],
  [2, '11-19'], [2, '11-20'], [1, '03-21'], [1, '03-22'], [1, '03-24'], [1, '03-25'],
  [1, '03-26'], [1, '06-06'], [1, '06-07'], [1, '06-09'], [1, '06-10'], [1, '06-11'],
  [1, '09-04'], [1, '09-05'], [1, '09-06'], [1, '09-07'], [1, '09-08'], [1, '09-09'],
  [1, '09-10'], [1, '10-09'], [1, '10-10'], [1, '10-11'], [1, '10-12'], [1, '10-13'],
  [1, '10-14'], [1, '11-13'], [1, '11-14'], [1, '11-15'], [1, '11-16'], [1, '11-17'],
  [1, '11-18'],
];
