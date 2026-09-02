/**
 * QUÉ ES UN CLUB Y QUÉ NO, contestado en un solo lugar.
 *
 * La base de jugadores mezcla tres cosas bajo `team_name`: clubes, selecciones y combinados de
 * exhibición ("Real Madrid XI", "Bundesliga XI", "Soccer Aid"). Un jugador figura DOS veces -- en su
 * club y en su selección --, así que confundirlos tiene consecuencias concretas: mover la fila de la
 * selección saca al jugador del Mundial, y contarla como plantel le da a Brasil 26 jugadores que
 * compiten con los clubes en cada cuenta.
 *
 * Está acá y no adentro de cada script porque la pregunta es una sola. Cuando vivía suelta en
 * aplicar_fichajes.mjs, el script manual no conocía los combinados y pedía desempatar a Mbappé entre
 * "Real Madrid" y "Real Madrid XI", que no es un club de nadie.
 */

import { leerSelecciones } from './data_ts.mjs';

/**
 * Los `team_name` de la base que NO son un club jugable.
 *
 * Dos fuentes, y la segunda es la que atrapa lo que ninguna lista escrita a mano recuerda:
 *
 *   1. Las selecciones que declara data.ts, más "Agentes libres" (que no es un club, es el pozo de
 *      los que no tienen ninguno).
 *   2. LA SEÑAL MEDIDA: en una selección todos los jugadores existen también en su club, porque son
 *      las mismas personas. Medido sobre la base entera, las selecciones dan 96-100% de jugadores
 *      repetidos y los combinados de exhibición 88-91%; el club más internacional que hay, el
 *      Arsenal, da 78%. El corte en 85% deja a cada uno de su lado y no se queda viejo.
 */
export function equiposQueNoSonClub(dataTs, jugadores) {
  const noSonClub = leerSelecciones(dataTs);

  const vecesQueAparece = new Map();
  for (const p of jugadores) vecesQueAparece.set(p.player_id, (vecesQueAparece.get(p.player_id) ?? 0) + 1);

  const conteoPorEquipo = new Map();
  for (const p of jugadores) {
    if (!p.team_name) continue;
    let e = conteoPorEquipo.get(p.team_name);
    if (!e) { e = { total: 0, repetidos: 0 }; conteoPorEquipo.set(p.team_name, e); }
    e.total++;
    if (vecesQueAparece.get(p.player_id) > 1) e.repetidos++;
  }
  for (const [nombre, e] of conteoPorEquipo) {
    if (e.total >= 15 && e.repetidos / e.total >= 0.85) noSonClub.add(nombre);
  }
  return noSonClub;
}
