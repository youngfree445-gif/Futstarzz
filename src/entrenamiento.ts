// El entrenamiento rendia +3 valga cuanto valga el atributo: subir de 95 a 98 costaba lo mismo, y
// rendia lo mismo, que subir de 45 a 48. Con 44 puntos por atributo a +3 eran 15 sesiones, por 6
// atributos 90 sesiones a ~950 cada una: 85.000 en total. Un solo patrocinio pagaba el desarrollo
// completo de una carrera, y la media llegaba a 99 en la TEMPORADA 3 -- con cualquiera de las cuatro
// economias que se midieron (ver economia.ts). Despues quedaban 24 temporadas sin nada que mejorar.
//
// Ahora el rendimiento y el precio dependen de cuan bueno YA sos. Un pibe crudo mejora rapido; pulir
// una estrella cuesta. Los tramos:
//
//     atributo    rinde   cuesta
//     < 60         +3      x1
//     60 - 74      +2      x2
//     75 - 86      +1      x4
//     >= 87        +1      x8
//
// Llevar un atributo de 55 a 99 pasa de 15 sesiones y $14.000 a 33 sesiones y $152.000.

/** Tramos de menor a mayor. `desde` es inclusivo; el ultimo cubre hasta el maximo. */
const TRAMOS: readonly { desde: number; rinde: number; multiplicaElCosto: number }[] = [
  { desde: 0,  rinde: 3, multiplicaElCosto: 1 },
  { desde: 60, rinde: 2, multiplicaElCosto: 2 },
  { desde: 75, rinde: 1, multiplicaElCosto: 4 },
  { desde: 87, rinde: 1, multiplicaElCosto: 8 },
];

function tramoDe(atributo: number) {
  let elegido = TRAMOS[0];
  for (const t of TRAMOS) if (atributo >= t.desde) elegido = t;
  return elegido;
}

// Fase 2.5 -- Zona de confort: pasado el umbral de temporadas seguidas en el mismo club, el
// entrenamiento rinde el minimo. Vive aca para que la pantalla y el motor lo cuenten igual.
export const COMFORT_ZONE_YEARS_THRESHOLD = 5;
export const RINDE_EN_ZONA_DE_CONFORT = 1;

export const TRAINING_ENERGY_COST = 20;
const TRAINING_BASE_COST = 200;
const TRAINING_COST_PER_REPUTATION = 150;

/** Cuanto sube el atributo esta sesion. */
export function rindeEntrenar(atributo: number, temporadasEnElClub: number): number {
  const porNivel = tramoDe(atributo).rinde;
  return temporadasEnElClub >= COMFORT_ZONE_YEARS_THRESHOLD
    ? Math.min(porNivel, RINDE_EN_ZONA_DE_CONFORT)
    : porNivel;
}

/**
 * Cuanto cuesta esta sesion. Depende del club (instalaciones y preparadores de un grande cobran mas,
 * `reputacion` va de 1 a 5) y del nivel del atributo: pulir lo que ya esta alto es lo caro.
 */
export function cuestaEntrenar(atributo: number, reputacionDelClub: number): number {
  const base = TRAINING_BASE_COST + reputacionDelClub * TRAINING_COST_PER_REPUTATION;
  return base * tramoDe(atributo).multiplicaElCosto;
}

/** El texto del boton y del aviso: una sola fuente, para que la pantalla no prometa otra cosa. */
export function rotuloDelTramo(atributo: number, temporadasEnElClub: number): string {
  const rinde = rindeEntrenar(atributo, temporadasEnElClub);
  return `+${rinde}`;
}
