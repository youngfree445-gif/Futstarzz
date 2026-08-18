// DE QUIÉN ES EL DÍA: una sola pregunta, una sola respuesta.
//
// ---------------------------------------------------------------------------------------------
// QUÉ RESUELVE
// ---------------------------------------------------------------------------------------------
//
// El calendario aparta días de copa en UNA SOLA BOLSA (ver RESERVAS DE COPA en dateSchedule.ts) y
// quién los usa se decide recién al llegar. Esa decisión estaba escrita en dos lugares -- App.tsx
// al armar el partido y Dashboard.tsx al anunciarlo -- y sincronizada A MANO.
//
// Ya se cobró un bug: el cartel decía "Copa Libertadores" y el partido era de Copa Colombia. Se
// arregló haciendo que las dos copias contestaran igual, y eso es exactamente lo frágil: dos copias
// que hoy coinciden porque alguien las miró juntas. La clave de la edición, encima, se construía en
// CINCO lugares con TRES fórmulas distintas -- y esa clave decide a qué edición de la copa se
// escribe tu resultado. El propio código ya advertía: "si las dos no coinciden, el resultado se
// guarda en una edición distinta de la que se jugó y el cuadro no avanza nunca".
//
// Acá vive la respuesta, una vez.
//
// ---------------------------------------------------------------------------------------------
// SE LEE, NO SE SORTEA
// ---------------------------------------------------------------------------------------------
//
// Estas funciones son PURAS: miran el calendario (que es una función del nombre del club) y el
// estado GUARDADO de las copas. No crean cuadros, no adelantan torneos y no tocan el perfil.
//
// Es una condición, no un detalle de estilo. Si acá se sorteara un cuadro para poder contestar, ese
// sorteo daría uno distinto del que App guarda después -- la pantalla prometería un rival y el
// partido sería contra otro. Cuando la edición todavía no está sorteada, la respuesta se deduce sin
// sortearla (tu club SIEMPRE entra al cuadro de su país, así que hay cruce).

import { Club, PlayerProfile } from './types';
import { temporadaDeCarrera, temporadaDelPaso } from './dateSchedule';
import { cruceActual, sigueEnCopa } from './copaNacional';

/**
 * La clave con la que se guarda la edición de copa nacional que le toca al club en este paso.
 *
 * La temporada la manda el CALENDARIO y no el contador de semanas: un paso es una fecha con
 * partido, y el Junior tiene 63 en 2026. Pasada la número 52 el contador decía "temporada 2" y la
 * clave cambiaba EN MEDIO de la edición -- el cuadro se reiniciaba solo y el jugador volvía a
 * dieciseisavos con la copa a mitad de camino.
 *
 * `temporadaDelPaso` devuelve null cuando el calendario real se agotó; ahí manda el contador, que
 * es lo único que queda.
 */
export function claveDeCopaNacional(club: Club, paso: number): string {
  const temporada = temporadaDelPaso(club.name, paso)?.temporada
    ?? temporadaDeCarrera(club.name, paso);
  return `${club.league}-${temporada}`;
}

/**
 * ¿La copa nacional tiene un cruce para este club hoy?
 *
 * Se contesta con el cuadro GUARDADO. Si la edición todavía no está sorteada la respuesta es sí, y
 * no hace falta sortear para saberlo: el cuadro se arma con los clubes del país y tu club entra
 * siempre (ver clubesParaContinuar en App.tsx, que lo pone primero en la lista).
 */
export function laNacionalTieneCruce(perfil: PlayerProfile, club: Club, paso: number): boolean {
  const guardada = perfil.domesticCups?.[claveDeCopaNacional(club, paso)];
  if (!guardada) return true;
  if (guardada.championId) return false;
  return sigueEnCopa(guardada, club.id) && !!cruceActual(guardada, club.id);
}

/** Quién se queda con un día que el calendario apartó para copa. */
export type DuenoDelDia = 'nacional' | 'continental';

/**
 * De quién es este día reservado.
 *
 * **Lo estrena la copa que lo PIDIÓ.** El calendario le reserva días a cada torneo por separado --
 * al Millonarios, 10 para la Copa BetPlay y 7 para la Sudamericana -- y respetarlo es lo que hace
 * que las dos lleguen a su final.
 *
 * Antes se preguntaba siempre primero por la continental, que entre fecha y fecha tiene un cruce
 * pendiente esperando, así que se quedaba con todos: el cuadro nacional no arrancaba hasta que
 * sobraran días al final del año y la Copa BetPlay quedaba reducida a una final suelta de dos
 * partidos.
 *
 * La otra copa hereda el día igual cuando la dueña no tiene nada que jugar, así que ninguna se
 * queda a medio camino.
 *
 * @param esReservaDeLaNacional true si el día lo apartó la copa nacional (kind 'domestic_cup').
 */
export function duenoDelDiaDeCopa(
  perfil: PlayerProfile,
  club: Club,
  paso: number,
  esReservaDeLaNacional: boolean,
): DuenoDelDia {
  if (esReservaDeLaNacional && laNacionalTieneCruce(perfil, club, paso)) return 'nacional';
  return 'continental';
}
