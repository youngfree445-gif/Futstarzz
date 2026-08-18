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

import { Club, PlayerProfile, TwoLegTie } from './types';
import { temporadaDeCarrera, temporadaDelPaso, torneoDelClubEnFecha } from './dateSchedule';
import { cruceActual, sigueEnCopa } from './copaNacional';
import { crucePlayoffDeLiga, leagueKeyFor, prepararPlayoffDeLiga, prepararRondaCopaNacional, rondaDelPlayoff } from './leagueEngine';
import { rondaActual } from './copaNacional';

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
  return sigueEnCopa(guardada, club.id) && !!cruceActual(prepararRondaCopaNacional(guardada), club.id);
}

/**
 * El cruce de copa nacional que le toca al club hoy: rival, pierna, ronda y global.
 *
 * ARMA LA RONDA SIGUIENTE ANTES DE MIRAR, y ese es todo el punto. El cuadro se guarda con la ronda
 * que se acaba de terminar como ultima, asi que preguntarle directamente devuelve LA LLAVE YA
 * JUGADA -- sigueEnCopa da true porque la ganaste. Reportado jugando con Tigres: la tarjeta
 * anunciaba a Leon, al que acababa de eliminar, mientras el partido era contra Cruz Azul.
 *
 * Avanzar aca es seguro y no rompe la regla de "se lee, no se sortea": prepararRondaCopaNacional
 * solo empareja a los ganadores en orden -- no hay azar -- asi que da EXACTAMENTE el mismo cuadro
 * que va a armar App.tsx al resolver el paso. Sortear seria otra cosa; esto es deducir.
 */
export function cruceDeCopaNacionalHoy(
  perfil: PlayerProfile,
  club: Club,
  paso: number,
): CruceDeCuadrangular | null {
  const guardada = perfil.domesticCups?.[claveDeCopaNacional(club, paso)];
  if (!guardada || guardada.championId || !sigueEnCopa(guardada, club.id)) return null;
  const alDia = prepararRondaCopaNacional(guardada);
  const llave = cruceActual(alDia, club.id);
  if (!llave) return null;
  const esIda = llave.firstLegGoalsA === null;
  const soyA = llave.clubAId === club.id;
  const misGoles = (soyA ? llave.firstLegGoalsA : llave.firstLegGoalsB) ?? 0;
  const susGoles = (soyA ? llave.firstLegGoalsB : llave.firstLegGoalsA) ?? 0;
  return {
    llave,
    rivalId: soyA ? llave.clubBId : llave.clubAId,
    soyLocal: esIda ? llave.clubAId === club.id : llave.clubBId === club.id,
    esIda,
    ronda: rondaActual(alDia),
    global: esIda ? null : `${misGoles}-${susGoles}`,
  };
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


// --- EL CUADRANGULAR ---------------------------------------------------------------------------
//
// Mismo problema que el dia de copa: App.tsx y Dashboard.tsx armaban la clave y leian el cruce cada
// uno por su lado. Las dos formulas de la clave daban lo mismo -- se comprobo -- pero eran tres
// construcciones distintas de la cadena que decide QUE CUADRO se lee, y con el cuadro equivocado la
// tarjeta anuncia un rival y el partido es contra otro. Ya paso con el rival del calendario:
// "el calendario muestra otro equipo y partido".

/**
 * La clave del cuadro de cuadrangular de este club, en este paso.
 *
 * Lleva el SEMESTRE porque Apertura y Clausura son dos torneos con su propio campeon: con una sola
 * clave por temporada, el segundo se jugaria sobre el cuadro del primero.
 */
export function clavePlayoffDeLiga(club: Club, paso: number, fecha: string): string {
  const semestre = torneoDelClubEnFecha(club.name, fecha) ?? '';
  return `${leagueKeyFor(club)}|${temporadaDeCarrera(club.name, paso)}|${semestre}`;
}

export interface CruceDeCuadrangular {
  llave: TwoLegTie;
  rivalId: string;
  /** La localia sale de la LLAVE: en la ida es local el clubA y en la vuelta se invierte. */
  soyLocal: boolean;
  esIda: boolean;
  ronda: string;
  /** "2-1" en la vuelta; null en la ida, donde todavia no hay nada que sumar. */
  global: string | null;
}

/**
 * El cruce de cuadrangular que le toca al club hoy, o null si no le toca ninguno.
 *
 * Lee el cuadro GUARDADO y no lo siembra: sembrar aca daria un cuadro distinto del que App guarda
 * despues. Cuando el cuadro todavia no esta sembrado devuelve null, y quien pregunte tiene que
 * decir "rival por definir" en vez de inventar uno -- que es lo que ya hace la tarjeta.
 */
export function cuadrangularDeHoy(
  perfil: PlayerProfile,
  club: Club,
  paso: number,
  fecha: string,
): CruceDeCuadrangular | null {
  const guardado = perfil.playoffsDeLiga?.[clavePlayoffDeLiga(club, paso, fecha)];
  if (!guardado) return null;
  // Misma trampa que en la copa nacional: el cuadro se guarda con la ronda recien terminada como
  // ultima, asi que sin avanzarla la tarjeta anuncia al rival que acabas de eliminar. Con el cuadro
  // ya sembrado, prepararPlayoffDeLiga solo empareja ganadores en orden y no mira la tabla -- por
  // eso se le puede pasar vacia -- ni tira ningun dado.
  const cuadro = prepararPlayoffDeLiga(guardado, [], undefined);
  const llave = crucePlayoffDeLiga(cuadro, club.id);
  if (!llave) return null;
  const esIda = llave.firstLegGoalsA === null;
  const soyA = llave.clubAId === club.id;
  const misGoles = (soyA ? llave.firstLegGoalsA : llave.firstLegGoalsB) ?? 0;
  const susGoles = (soyA ? llave.firstLegGoalsB : llave.firstLegGoalsA) ?? 0;
  return {
    llave,
    rivalId: soyA ? llave.clubBId : llave.clubAId,
    soyLocal: esIda ? llave.clubAId === club.id : llave.clubBId === club.id,
    esIda,
    ronda: rondaDelPlayoff(cuadro),
    global: esIda ? null : `${misGoles}-${susGoles}`,
  };
}
