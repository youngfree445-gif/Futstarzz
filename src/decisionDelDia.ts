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

import { Club, PlayerProfile, TableTeam, TwoLegTie } from './types';
import type { CampeonesConmebol, PosicionesFinales } from './copasConmebol';
import { fechaDelPaso, fechasDeCopaNacionalRestantes, fechasDePlayoffDelTorneo, fixturesAtStep, pickPrimary, quedanFechasDePlayoff, rivalesDeGrupoEnElCalendario, temporadaDeCarrera, temporadaDelPaso, torneoDelClubEnFecha } from './dateSchedule';
import { resolverClubDeCalendario } from './clubAliases';
import { crearCopaNacional, cruceActual, sigueEnCopa, tamanoDelCuadro } from './copaNacional';
import { getConcacafParticipants, getLibertadoresParticipants, getSudamericanaParticipants, tercerosDeGrupo, crucePlayoffDeLiga, leagueKeyFor, prepararPlayoffDeLiga, prepararRondaCopaNacional, resolverPasoPlayoffDeLiga, rondaDelPlayoff, terminarTorneoSinElJugador } from './leagueEngine';
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
  clubes: readonly Club[],
  paso: number,
): CruceDeCuadrangular | null {
  const guardada = perfil.domesticCups?.[claveDeCopaNacional(club, paso)]
    ?? copaNacionalDelPaso(perfil, club, clubes, paso);
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
  /**
   * La tabla de la fase regular, para poder SEMBRAR el cuadro si todavia no existe.
   *
   * Sembrarlo aca es seguro por lo mismo que el sorteo de la copa: no hay azar. El cuadrangular se
   * siembra con los ocho primeros de la tabla, en orden, asi que con la misma tabla los dos lados
   * arman las mismas llaves. Sin esto, la tarjeta del primer dia decia "Rival por definir".
   */
  tabla: readonly TableTeam[] = [],
): CruceDeCuadrangular | null {
  const guardado = perfil.playoffsDeLiga?.[clavePlayoffDeLiga(club, paso, fecha)]
    ?? (tabla.length
      ? prepararPlayoffDeLiga(undefined, [...tabla], fechasDePlayoffDelTorneo(club.name, fecha))
      : undefined);
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


/**
 * La edicion de copa nacional que le corresponde al club en este paso, sorteada.
 *
 * EL SORTEO NO ES ALEATORIO, y por eso esto se puede llamar desde donde sea. `sortear` usa un
 * generador congruencial sembrado con el AÑO: mismo año, mismo cuadro. El propio comentario de
 * copaNacional.ts lo dice -- "recargar la pagina no puede cambiar el rival que te toco".
 *
 * Eso importa porque la tarjeta del proximo partido se abstenia de sortear "para no prometer un
 * rival distinto del que armaria App.tsx", y terminaba anunciando "Rival por definir" justo donde
 * hay que decidir si jugas. La precaucion era razonable pero la premisa era falsa: los dos lados
 * calculan lo mismo. Reportado: "mostrar eso en la ventana de disputar partido no es bueno".
 *
 * Las tres entradas del sorteo son deterministas: el año sale de claveDeCopaNacional, la division
 * de los overrides guardados, y los clubes que continuan del calendario (que es funcion pura del
 * nombre del club).
 */
export function copaNacionalDelPaso(
  perfil: PlayerProfile,
  club: Club,
  clubes: readonly Club[],
  paso: number,
) {
  const clave = claveDeCopaNacional(club, paso);
  const temporada = Number(clave.slice(clave.lastIndexOf('-') + 1));
  const fecha = fechaDelPaso(club.name, paso);
  if (!fecha) return null;

  // El cuadro se dimensiona a las FECHAS QUE QUEDAN: cada ronda son dos partidos, asi que con N
  // fechas entran floor(N/2) rondas y 2^rondas clubes. Y TU CLUB entra siempre -- el recorte a la
  // potencia de dos se llevaba puestos a los de menor reputacion, que se quedaban sin jugar la copa
  // ninguna temporada.
  const quedan = fechasDeCopaNacionalRestantes(club.name, temporada, fecha);
  const delPais = clubes.filter(c => c.league === club.league);
  const cupo = Math.min(
    2 ** Math.max(1, Math.min(6, Math.floor(quedan / 2))),
    tamanoDelCuadro(delPais.length),
  );
  const continuan = [
    club.id,
    ...delPais
      .filter(c => c.id !== club.id)
      .sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))
      .slice(0, cupo - 1)
      .map(c => c.id),
  ];
  const division = (c: Club) => (perfil.divisionOverrides?.[c.id] ?? (c.division === 2 ? 2 : 1)) as 1 | 2;
  return crearCopaNacional(club.league, temporada, clubes, division, continuan);
}


// --- EL TORNEO SIGUE AUNQUE VOS NO JUEGUES ------------------------------------------------------
//
// Un cuadrangular avanza SOLO los dias que el jugador disputa una llave. Los dias que se pierde --
// lesionado, sancionado, sin convocatoria, descansando por energia baja -- el calendario los gasta
// igual y el cuadro se queda quieto.
//
// Eso no es un detalle de contabilidad: las fechas de cuadrangular son contadas. El Clausura
// mexicano tiene seis y un cuadro de ocho necesita exactamente seis. Perder tres deja el torneo
// congelado en semifinal para siempre, que es lo que reporto el jugador: "la liga mx no dio
// campeon, no se jugo el de vuelta". Su cuadro quedo en Semifinal con la vuelta pendiente mientras
// el calendario ya estaba en el Apertura.
//
// La regla de la casa es no recortar torneos: se acomoda el calendario, no se achica el trofeo. Un
// torneo que no corona a nadie es la version silenciosa de recortarlo.

/**
 * La pierna de cuadrangular de HOY, jugada sin el jugador.
 *
 * Devuelve el mapa de cuadros actualizado, o null si hoy no hay nada de cuadrangular que avanzar.
 * Es la misma llamada que ya hacia la rama de "los cuadrangulares se juegan sin tu club" cuando el
 * club no entraba al cuadro; lo que faltaba era hacerla tambien cuando el club SI esta y el que
 * falta sos vos.
 */
export function playoffDelDiaSinElJugador(
  perfil: PlayerProfile,
  club: Club,
  clubesDeLaLiga: Club[],
  tabla: readonly TableTeam[] = [],
): PlayerProfile['playoffsDeLiga'] | null {
  const paso = fixturesAtStep(club.name, perfil.currentWeek);
  const hoy = paso ? pickPrimary(paso.fixtures) : null;
  if (!paso || !hoy?.esPlayoff) return null;
  const clave = clavePlayoffDeLiga(club, perfil.currentWeek, paso.date);
  // Si el cuadro todavia no existe se siembra con la tabla, igual que lo haria el partido: perder
  // la PRIMERA fecha del cuadrangular no puede dejar el torneo sin arrancar.
  const guardado = perfil.playoffsDeLiga?.[clave]
    ?? (tabla.length
      ? prepararPlayoffDeLiga(undefined, [...tabla], fechasDePlayoffDelTorneo(club.name, paso.date))
      : undefined);
  if (!guardado || guardado.championId) return null;
  const alDia = prepararPlayoffDeLiga(guardado, [], undefined);
  return { ...(perfil.playoffsDeLiga ?? {}), [clave]: resolverPasoPlayoffDeLiga(alDia, clubesDeLaLiga) };
}

/**
 * Los cuadrangulares que se quedaron SIN FECHAS se terminan, para que tengan campeon.
 *
 * Es la red de seguridad de la funcion de arriba, y ademas arregla las partidas que ya venian con
 * un cuadro congelado: no hay forma de devolverles las fechas perdidas, pero si de que el torneo se
 * defina en vez de quedar abierto para siempre. Se resuelve simulando, que es lo que ya se hace
 * cuando al jugador lo eliminan (ver terminarTorneoSinElJugador).
 *
 * Solo toca los cuadros de la liga en la que el jugador esta hoy: de las otras no se conoce el
 * calendario, asi que no se puede saber si les quedan fechas.
 */
export function cerrarPlayoffsSinFechas(
  perfil: PlayerProfile,
  club: Club,
  clubesDeLaLiga: Club[],
  paso: number,
): PlayerProfile['playoffsDeLiga'] | null {
  const cuadros = perfil.playoffsDeLiga;
  if (!cuadros) return null;
  const miLiga = leagueKeyFor(club);
  let cambio = false;
  const copia = { ...cuadros };
  for (const [clave, cuadro] of Object.entries(cuadros)) {
    if (!cuadro || cuadro.championId) continue;
    const [liga, temporada, torneo] = clave.split('|');
    if (liga !== miLiga) continue;
    if (quedanFechasDePlayoff(club.name, Number(temporada), torneo, paso)) continue;
    // El paso lleva las DOS mitades: prepararPlayoffDeLiga arma la ronda siguiente y
    // resolverPasoPlayoffDeLiga juega una pierna. Con solo la segunda, el cuadro se termina en la
    // ronda donde estaba -- resolveTwoLegRound corta a proposito sin armar la que viene -- y el
    // torneo se queda sin campeon igual, que es lo que se estaba tratando de arreglar.
    copia[clave] = terminarTorneoSinElJugador(
      cuadro, b => resolverPasoPlayoffDeLiga(prepararPlayoffDeLiga(b, [], undefined), clubesDeLaLiga));
    cambio = true;
  }
  return cambio ? copia : null;
}


/**
 * El grupo REAL del club en una copa continental, sacado del calendario.
 *
 * El motor sorteaba los ocho grupos por su cuenta, sin mirar el calendario, asi que el grupo que
 * dibujaba la pantalla de Copas no tenia nada que ver con los seis partidos que el jugador iba a
 * disputar. Reportado con captura: "en copas y tablas muestra un grupo distinto al que juego".
 *
 * Los grupos de los OTROS siete no se pueden sacar de ningun lado -- medido: de los 32
 * participantes solo 11 tienen partidos de grupos en el calendario, y solo 2 tienen los tres
 * rivales completos, porque el calendario de cada club trae unicamente SUS partidos. Asi que el
 * sorteo del motor sigue armando el resto; lo unico que cambia es que el grupo del jugador, que es
 * el unico que el jugador puede contrastar, ya no se inventa.
 *
 * Devuelve los CUATRO ids (el club y sus tres rivales) o undefined si el calendario no los tiene
 * completos, si alguno no se puede resolver a un club de la base, o si alguno no esta entre los
 * participantes de esta edicion -- en cualquiera de esos casos sembrar seria peor que sortear.
 */
export function grupoRealDelCalendario(
  club: Club,
  clubes: readonly Club[],
  competitionName: string,
  temporada: number,
  participantes: readonly string[],
): string[] | undefined {
  const nombres = rivalesDeGrupoEnElCalendario(club.name, competitionName, temporada);
  if (nombres.length !== 3) return undefined;
  const ids = nombres
    .map(n => resolverClubDeCalendario(clubes, n, undefined, 'continental_cup', competitionName)?.id)
    .filter((id): id is string => !!id);
  if (ids.length !== 3) return undefined;
  const grupo = [club.id, ...ids];
  return grupo.every(id => participantes.includes(id)) ? grupo : undefined;
}


// --- CUÁL ES TU COPA CONTINENTAL, Y CUÁNDO DEJA DE SERLO ---------------------------------------
//
// Hasta ahora era una función pura de las listas de participantes, calculada por separado en
// App.tsx y en Dashboard.tsx. Alcanzaba porque la respuesta no cambiaba en todo el año.
//
// Con el repechaje sí cambia: el tercero de un grupo de Libertadores NO queda eliminado, baja a la
// Sudamericana y sigue jugando ahí. O sea que a mitad de temporada tu copa pasa a ser otra, y esa
// es exactamente la clase de pregunta que este archivo existe para contestar UNA vez -- entre los
// dos archivos, `conmebolCupId` se usa 39 veces, y dos derivaciones que se desincronicen serían un
// cartel anunciando una copa y un partido de la otra. Ya pasó.
//
// No hace falta campo nuevo ni migración: se deduce del cuadro guardado de la Libertadores, que ya
// dice quién quedó tercero.

/** ¿Este club quedó TERCERO en su grupo de Libertadores, o sea que baja a la Sudamericana? */
export function bajoALaSudamericana(perfil: PlayerProfile, club: Club, temporada: number): boolean {
  const lib = perfil.continentalCups?.[`libertadores-${temporada}`];
  return !!lib && tercerosDeGrupo(lib).includes(club.id);
}

/**
 * La copa continental que el club juega HOY.
 *
 * Es la de los clasificados, salvo que la Libertadores ya lo haya dejado tercero de grupo: desde
 * ese momento su copa es la Sudamericana, y lo sigue siendo el resto del año.
 */
export function copaContinentalDelJugador(
  perfil: PlayerProfile,
  club: Club,
  clubes: Club[],
  temporada: number,
  posiciones?: PosicionesFinales,
  campeones?: CampeonesConmebol,
): 'libertadores' | 'sudamericana' | 'concacaf' | null {
  if (getLibertadoresParticipants(clubes, temporada, posiciones, campeones).includes(club.id)) {
    return bajoALaSudamericana(perfil, club, temporada) ? 'sudamericana' : 'libertadores';
  }
  if (getSudamericanaParticipants(clubes, temporada, posiciones, campeones).includes(club.id)) return 'sudamericana';
  if (getConcacafParticipants(clubes, temporada, posiciones).includes(club.id)) return 'concacaf';
  return null;
}

/**
 * Los terceros de la Libertadores que bajan al repechaje de la Sudamericana.
 *
 * Salen del cuadro guardado. Si esa edición no está guardada -- un club que nunca jugó la
 * Libertadores -- no hay terceros y la Sudamericana siembra su cuadro como siempre. Es el mismo
 * respaldo que ya tiene el motor.
 */
export function repescadosDeLaLibertadores(perfil: PlayerProfile, temporada: number): string[] | undefined {
  const lib = perfil.continentalCups?.[`libertadores-${temporada}`];
  const terceros = lib ? tercerosDeGrupo(lib) : [];
  return terceros.length ? terceros : undefined;
}
