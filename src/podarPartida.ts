// PODAR LA PARTIDA: las ediciones terminadas se guardan por su RESULTADO, no por su cuadro entero.
//
// ---------------------------------------------------------------------------------------------
// QUÉ PESA Y POR QUÉ
// ---------------------------------------------------------------------------------------------
//
// Una carrera dura hasta 32 temporadas y vive en el localStorage del navegador. Cada temporada deja
// guardado el estado COMPLETO de sus torneos: los ocho grupos de la Libertadores con sus tablas y
// sus 48 partidos, el cuadro de la copa nacional, los dos cuadrangulares. Medido:
//
//     copa nacional     3 KB        libertadores    19 KB
//     cuadrangular      1 KB        champions       28 KB
//
// Son ~24 KB por temporada para un club sudamericano y ~33 KB para uno europeo: 768 KB y 1 MB al
// cabo de 32 años, sólo en torneos ya jugados.
//
// No es un riesgo de pérdida -- guardarRanura avisa cuando el almacenamiento se llena y el juego lo
// dice en pantalla --, pero es peso muerto: de una edición terminada, lo único que se vuelve a
// mirar es QUIÉN LA GANÓ.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ SE REDUCE Y NO SE BORRA
// ---------------------------------------------------------------------------------------------
//
// Borrar la edición vaciaría la vitrina. Los trofeos continentales NO se anotan en `cupTitles` al
// ganarlos: palmares.ts los deduce recorriendo las ediciones guardadas y quedándose con las que
// tienen `stage: 'done'` y un campeón que es de tus clubes. El reparto de cupos del año siguiente
// hace lo mismo con `campeonesContinentales`.
//
// Así que la edición se conserva -- con su id, su año, su etapa y su campeón -- y lo que se tira es
// el cuerpo: los grupos con sus tablas y sus partidos, el cuadro con todas sus llaves. Eso es el
// 95% del peso y nadie lo vuelve a leer: `lideresDeCopa` mira la copa EN CURSO, la pantalla de
// copas también, y el reporte de bug muestra las terminadas como terminadas.
//
// La temporada EN CURSO no se toca nunca, tenga campeón o no: su cuadro se sigue mostrando.

import type { CupState, PlayerProfile, UefaCupState } from './types';

/** El esqueleto de una edición terminada: lo que se vuelve a mirar y nada más. */
function soloElResultado(cup: CupState): CupState {
  return { ...cup, groups: [], knockout: null };
}

function soloElResultadoUefa(cup: UefaCupState): UefaCupState {
  return { ...cup, fixtures: [], table: [], playoff: null, knockout: null };
}

/**
 * Deja las ediciones ya terminadas guardadas por su resultado.
 *
 * @param temporadaActual La temporada de carrera en curso, que queda intacta.
 * @returns El perfil podado, o el mismo objeto si no había nada que podar.
 */
export function podarEdicionesTerminadas(perfil: PlayerProfile, temporadaActual: number): PlayerProfile {
  let cambio = false;

  const continentales = { ...(perfil.continentalCups ?? {}) };
  for (const [clave, cup] of Object.entries(continentales)) {
    // La clave es `${cupId}-${temporada}`: la edición de este año se deja como está.
    const suTemporada = Number(clave.split('-').pop());
    if (!cup || !cup.championId || suTemporada >= temporadaActual) continue;
    if (!cup.groups.length && !cup.knockout) continue;   // ya podada
    continentales[clave] = soloElResultado(cup);
    cambio = true;
  }

  // Las de la UEFA se indexan por cupId y su edición cruza dos años, así que no hay año en la clave:
  // se poda la que ya coronó, porque la siguiente arranca con un estado nuevo.
  const uefa = { ...(perfil.uefaCups ?? {}) };
  for (const [clave, cup] of Object.entries(uefa)) {
    if (!cup || !cup.championId || cup.year >= temporadaActual) continue;
    if (!cup.fixtures.length && !cup.knockout && !cup.playoff) continue;
    uefa[clave] = soloElResultadoUefa(cup);
    cambio = true;
  }

  const nacionales = { ...(perfil.domesticCups ?? {}) };
  for (const [clave, cup] of Object.entries(nacionales)) {
    const suTemporada = Number(clave.split('-').pop());
    if (!cup || !cup.championId || suTemporada >= temporadaActual) continue;
    if (!cup.bracket.tiesByRound.length) continue;
    nacionales[clave] = { ...cup, bracket: { ...cup.bracket, tiesByRound: [] } };
    cambio = true;
  }

  const cuadrangulares = { ...(perfil.playoffsDeLiga ?? {}) };
  for (const [clave, cuadro] of Object.entries(cuadrangulares)) {
    // La clave es `${liga}|${temporada}|${semestre}`.
    const suTemporada = Number(clave.split('|')[1]);
    if (!cuadro || !cuadro.championId || suTemporada >= temporadaActual) continue;
    if (!cuadro.tiesByRound.length) continue;
    cuadrangulares[clave] = { ...cuadro, tiesByRound: [] };
    cambio = true;
  }

  if (!cambio) return perfil;
  return {
    ...perfil,
    continentalCups: continentales,
    uefaCups: uefa,
    domesticCups: nacionales,
    playoffsDeLiga: cuadrangulares,
  };
}
