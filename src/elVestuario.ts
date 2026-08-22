// EL VESTUARIO: cuánto partido es tuyo de verdad.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES PUERTAS QUE HAY ANTES DE LA PELOTA
// ---------------------------------------------------------------------------------------------
//
// Un jugador no juega noventa minutos porque quiera. Hay tres filtros antes, y el juego tenía los
// tres flojos o apagados:
//
//   1. EL PLANTEL DECIDE SI TE LA DAN. `prestigeCompaneros` existía, se movía con los eventos y la
//      mentoría, se mostraba en el encabezado como "Plantel"... y no hacía absolutamente NADA. Un
//      recién llegado que no le caía bien a nadie recibía exactamente las mismas cuatro pelotas
//      decisivas que el referente del equipo.
//
//   2. EL DT DECIDE SI ARRANCÁS. Esto sí funcionaba (`varaDeTitularidad` contra tu prestigio, que en
//      pantalla se llama "Relación DT"), pero era MUDO: te encontrabas en el banco sin que nadie te
//      dijera cuánto te faltaba. Un número invisible que te saca del equipo se lee como un bug --
//      la misma lección que ya había dejado el refuerzo que te tapa.
//
//   3. EL DT DECIDE SI SEGUÍS. Esto directamente no pasaba nunca. Había código para sacarte al
//      minuto 70 jugando mal, pero pedía que no quedara ninguna decisión pendiente y la cuarta cae
//      entre el 80 y el 86 SIEMPRE. Medido: 0 sustituciones en 200.000 partidos simulados. Estaba
//      escrito y estaba muerto.
//
// Las tres viven acá juntas porque son la misma pregunta contestada en tres momentos: cuánto de este
// partido es tuyo.
//
// ---------------------------------------------------------------------------------------------
// EL BUCLE QUE CIERRAN ENTRE LAS TRES
// ---------------------------------------------------------------------------------------------
//
// Por separado son tres castigos. Juntas son un bucle, que es lo que las hace un juego:
//
//     jugás mal  ->  te sacan  ->  el DT te baja  ->  arrancás en el banco  ->  te llega menos
//         ^                                                                          |
//         +--------------------------------------------------------------------------+
//
// Y se sale por donde se entró: una buena racha sube la relación, volvés al once, te llegan más
// pelotas. Nada de esto es una pared, todo es una pendiente.
//
// ---------------------------------------------------------------------------------------------
// TODO ES PURO Y EL DADO ENTRA POR PARÁMETRO
// ---------------------------------------------------------------------------------------------
//
// Misma decisión que en decisionDelPartido.ts, secuela.ts y elPibe.ts, y por el mismo motivo: el
// banco de pruebas tiene que poder correr esto diez mil veces con dados controlados. Una regla que
// sólo se puede ver jugando es una regla que no se puede medir.

/** Las ocasiones de un titular integrado. Es el número de siempre: acá nada cambia para él. */
export const OCASIONES_BASE = 4;

/** Debajo de esto el plantel no te busca. */
export const COMPANEROS_TE_IGNORAN = 25;
/** Y a partir de acá te buscan a vos. */
export const COMPANEROS_TE_BUSCAN = 75;
/** El punto medio: el vestuario te acepta pero todavía no sos el que la pide. */
export const COMPANEROS_TE_ACEPTAN = 45;

/** Por más mal que te lleves, siempre te llegan dos: el peor caso tiene que seguir siendo jugable. */
export const OCASIONES_MINIMAS = 2;
/** Y por más ídolo que seas, cinco. El partido no puede pasar entero por vos. */
export const OCASIONES_MAXIMAS = 5;

/**
 * Lo que le cuesta a un recién llegado. Ser nuevo es estar afuera del circuito, no caer mal.
 *
 * OJO CON QUIÉN CUENTA COMO NUEVO: el que llega FICHADO, no el que empieza la carrera. `yearsAtClub`
 * arranca en 0 en las dos situaciones, y con eso el pibe de 17 que sale de las inferiores entraba a
 * su propio club como un extraño -- justo al revés de la verdad, porque a ése lo conocen desde los
 * doce. Lo destapó el banco de pruebas de carrera larga: la temporada 1 se volvía un pozo del que no
 * se salía. Ver `esRecienLlegado`.
 */
export const CASTIGO_DE_RECIEN_LLEGADO = 1;

/** Cuánto del partido juega el que entra desde el banco. */
export const PARTE_DEL_SUPLENTE = 0.35;

/**
 * ¿Sos el nuevo del vestuario?
 *
 * Primera temporada en el club Y habiendo jugado en otro antes. La segunda mitad es la que importa:
 * `dorsalHistory` sólo tiene algo si ya te pusiste otra camiseta, así que separa al fichaje del
 * juvenil que debuta en la casa. Los dos tienen `yearsAtClub === 0` y no son la misma persona.
 */
export function esRecienLlegado(perfil: {
  yearsAtClub?: number;
  dorsalHistory?: { clubId: string }[];
}): boolean {
  return (perfil.yearsAtClub ?? 0) === 0 && (perfil.dorsalHistory?.length ?? 0) > 0;
}

export interface SituacionEnElVestuario {
  /** `prestigeCompaneros`, de 0 a 100. */
  companeros: number;
  esTitular: boolean;
  /** Primera temporada en el club (`yearsAtClub === 0`). */
  recienLlegado: boolean;
}

/**
 * CUÁNTAS VECES TE LLEGA LA PELOTA EN SERIO.
 *
 * No es cuántas veces la tocás: es cuántas veces la jugada pasa por vos y tenés que decidir algo.
 * Ésas son las que mueven el prestigio, y por eso ésta es la regla que más cambia una carrera de
 * todo lo que hay en este archivo.
 *
 * LOS ESCALONES SON CUATRO Y NO UNA CURVA, a propósito. El jugador tiene que poder darse cuenta de
 * que pasó algo: "hoy me llegaron dos" es un dato que se nota, "hoy me llegaron 3,4" no existe. Y
 * 50 -- con lo que arranca una carrera -- cae en el escalón de 4, así que el jugador de siempre
 * juega exactamente el partido de siempre. Esto agrega relieve, no dificultad.
 */
export function ocasionesDelPartido(d: SituacionEnElVestuario): number {
  const porElVestuario =
    d.companeros < COMPANEROS_TE_IGNORAN ? OCASIONES_MINIMAS
    : d.companeros < COMPANEROS_TE_ACEPTAN ? OCASIONES_BASE - 1
    : d.companeros < COMPANEROS_TE_BUSCAN ? OCASIONES_BASE
    : OCASIONES_MAXIMAS;

  // Ser nuevo pesa aparte de caer bien. Podés caerle bien a todos y que igual la jugada no te
  // busque todavía, que es exactamente lo que le pasa a un fichaje en sus primeros meses.
  const conLaMudanza = porElVestuario - (d.recienLlegado ? CASTIGO_DE_RECIEN_LLEGADO : 0);

  const acotado = Math.max(OCASIONES_MINIMAS, Math.min(OCASIONES_MAXIMAS, conLaMudanza));
  if (d.esTitular) return acotado;
  // El suplente entra tarde y juega poco. Nunca menos de una: entrar y no tocarla no es un partido.
  return Math.max(1, Math.round(acotado * PARTE_DEL_SUPLENTE));
}

/**
 * Qué te está pasando en el vestuario, dicho en una línea, o null si no pasa nada.
 *
 * ESTO NO ES DECORACIÓN, es la mitad de la regla -- lo mismo que `queEstaPidiendoElPartido`. Que te
 * lleguen dos pelotas en vez de cuatro sin que nadie lo nombre no se lee como "el plantel no te
 * busca": se lee como que el juego está roto.
 */
export function loQueDiceElVestuario(d: SituacionEnElVestuario): string | null {
  if (d.companeros < COMPANEROS_TE_IGNORAN) {
    return 'El vestuario no te busca: hoy la pelota va a pasar poco por vos.';
  }
  if (d.recienLlegado && d.companeros < COMPANEROS_TE_BUSCAN) {
    return 'Todavía sos el nuevo: tus compañeros están mirando antes de darte la pelota.';
  }
  if (d.companeros < COMPANEROS_TE_ACEPTAN) {
    return 'El plantel todavía desconfía: te va a llegar menos de lo que te gustaría.';
  }
  if (d.companeros >= COMPANEROS_TE_BUSCAN) {
    return 'El equipo te busca a vos: cuando hay una jugada para resolver, la pelota es tuya.';
  }
  return null;
}

// ==================================================================================================
// LOS MINUTOS EN QUE TE LLEGA
// ==================================================================================================

/** Cuánto se puede correr cada momento respecto de su ancla, para que no sea un reloj. */
export const SACUDON = 3;

/**
 * Los minutos de las N ocasiones, repartidos por el partido.
 *
 * La fórmula reproduce EXACTAMENTE los cuatro minutos de siempre -- 16, 38, 61 y 83 -- cuando N es
 * 4. Eso no es casualidad ni suerte: es el requisito. El reparto de un titular integrado no puede
 * moverse un minuto por haber generalizado la cuenta, o esto dejaría de ser "más relieve" y pasaría
 * a ser "cambié el partido de todos".
 *
 * `dado` entra por parámetro para poder medir el reparto sin jugar.
 */
export function minutosDeLasOcasiones(cuantas: number, dado: () => number = Math.random): number[] {
  const ancho = 90 / cuantas;
  const minutos: number[] = [];
  for (let i = 0; i < cuantas; i++) {
    const ancla = Math.round(ancho * (i + 0.7));
    const sacudon = Math.floor(dado() * (SACUDON * 2 + 1)) - SACUDON;
    // Nunca antes del 8 (el partido tiene que empezar) ni después del 87 (el 90 es el final, y una
    // decisión agendada ahí no llega a dispararse).
    minutos.push(Math.max(8, Math.min(87, ancla + sacudon)));
  }
  return [...new Set(minutos)].sort((a, b) => a - b);
}

// ==================================================================================================
// EL DT: POR QUÉ ARRANCÁS EN EL BANCO
// ==================================================================================================

/**
 * La frase que explica el banco.
 *
 * La REGLA no cambia y no se copia acá: sigue siendo `prestigio >= varaDeTitularidad(club)`, que
 * vive en fuerzaDelClub.ts y sale del ranking mundial. Lo que faltaba era decirlo. Antes te
 * encontrabas de suplente sin que nadie te dijera cuánto te faltaba ni por qué, y un número
 * invisible que te saca del equipo se lee como un bug -- exactamente lo mismo que ya había pasado
 * con el refuerzo que te tapa.
 */
export function porQueVasAlBanco(d: {
  prestigio: number;
  vara: number;
  clubName: string;
  /** Lo que suman el refuerzo, la forma y lo que valés. Si pesa, se nombra. */
  estorbo: number;
}): string {
  const falta = Math.max(1, Math.round(d.vara + d.estorbo - d.prestigio));
  const base = `⛔ ARRANCÁS EN EL BANCO. El DT de ${d.clubName} te pide ${Math.round(d.vara + d.estorbo)} de relación para ponerte de titular y estás en ${Math.round(d.prestigio)}: te faltan ${falta}.`;
  // El estorbo ya se narra aparte (el refuerzo en el feed, la forma en su propio aviso), así que acá
  // sólo se dice que está pesando. Repetir el motivo completo sería el mismo aviso dos veces.
  return d.estorbo >= 3
    ? `${base} Y hoy no estás peleando solo por el puesto.`
    : base;
}

// ==================================================================================================
// EL DT: POR QUÉ TE SACA
// ==================================================================================================

/** Con esta nota el técnico ya mandó a calentar a otro. */
export const NOTA_DE_AVISO = 5.6;
/** Y con ésta te saca. */
export const NOTA_DE_SALIDA = 5.2;

/** El minuto en que el técnico manda a calentar a alguien. */
export const MINUTO_DEL_AVISO = 62;
/** El minuto de TU última pelota, si estás en riesgo. Ver abajo por qué existe. */
export const MINUTO_DE_TU_ULTIMA = 68;
/** Y el minuto del cambio. */
export const MINUTO_DEL_CAMBIO = 72;

/** La chance mínima de que te saquen apenas cruzás la nota. */
export const CHANCE_BASE_DE_SALIDA = 0.35;
/** Cuánto sube esa chance por cada punto de nota por debajo del corte. */
export const CHANCE_POR_PUNTO_DE_NOTA = 1.2;
/** Y el techo: nunca es seguro, porque un técnico puede bancarte. */
export const CHANCE_MAXIMA_DE_SALIDA = 0.85;

/** ¿El técnico manda a calentar a alguien por vos? */
export function teMandanACalentar(nota: number): boolean {
  return nota < NOTA_DE_AVISO;
}

/**
 * Qué chance hay de que te saquen, según cómo venís jugando.
 *
 * Sube rápido y no llega nunca a 1. Que quede un 15% de que te banquen importa: si fuera seguro, el
 * minuto 68 dejaría de ser una oportunidad y pasaría a ser un trámite antes de la sentencia.
 */
export function chanceDeQueTeSaquen(nota: number): number {
  if (nota >= NOTA_DE_SALIDA) return 0;
  return Math.min(CHANCE_MAXIMA_DE_SALIDA, CHANCE_BASE_DE_SALIDA + (NOTA_DE_SALIDA - nota) * CHANCE_POR_PUNTO_DE_NOTA);
}

/** ¿Te sacan? El dado entra por parámetro. */
export function elDtTeSaca(nota: number, dado: number): boolean {
  return dado < chanceDeQueTeSaquen(nota);
}

/**
 * SI ESTÁS EN RIESGO, EL PARTIDO TE DA UNA ÚLTIMA PELOTA ANTES DEL CAMBIO.
 *
 * Acá está la parte que hace que la sustitución sea justa y no un impuesto.
 *
 * La primera versión de esta regla no se animaba a sacarte si te quedaba alguna decisión por jugar,
 * y como la última cae siempre después del 80, no te sacaba nunca. La salida NO es quitarte las
 * decisiones que faltaban: es adelantarte una. Es la misma regla de siempre en este juego -- se
 * acomoda, no se recorta.
 *
 * Y cambia lo que significa el minuto 62. Sin esto, el aviso es una notificación de algo ya
 * decidido. Con esto, es un aviso de verdad: te queda una pelota para cambiarle la cara al partido,
 * y si la resolvés bien la nota sube y el cambio no llega. Es el momento más tenso que puede tener
 * un partido flojo.
 *
 * Devuelve el minuto de esa última pelota, o null si ya tenías una agendada por ahí (no hace falta
 * regalar nada: la que tenías ya es tu oportunidad).
 */
export function minutoDeTuUltimaPelota(minutosAgendados: number[]): number | null {
  const yaTenesUna = minutosAgendados.some(m => m >= MINUTO_DEL_AVISO && m <= MINUTO_DEL_CAMBIO);
  if (yaTenesUna) return null;
  return MINUTO_DE_TU_ULTIMA;
}

/**
 * LO QUE CUESTA QUE TE SAQUEN, en prestigio y en hinchada.
 *
 * Va en unidades FINALES, no del catálogo: no es una jugada, es el juicio del técnico sobre el
 * partido entero. Por eso no pasa por CUANTO_VALE_UN_PUNTO.
 *
 * Y es lo que cierra el bucle: te saca hoy, te pide más para el once el sábado que viene.
 */
export const PRESTIGIO_AL_SALIR = -3;
export const HINCHADA_AL_SALIR = -2;

// ==================================================================================================
// LO QUE EL VESTUARIO VIO DE VOS ESTE PARTIDO
// ==================================================================================================
//
// Hasta acá la relación con el plantel sólo la movían cuatro eventos al azar de los cuarenta y siete
// del juego, y la mentoría una vez por temporada. O sea que el número que decide cuántas pelotas te
// llegan dependía de que te tocara la carta correcta. No había forma de GANARSE al vestuario
// jugando, que es la única forma en que se gana un vestuario de verdad.
//
// LA REGLA, en una línea: el vestuario quiere al que la comparte y desconfía del que la esconde.
//
//   . SE MIDE EL REPARTO, NO EL GOL. El gol te lo aplaude la tribuna y te lo paga el DT (sube el
//     prestigio en la jugada). El que te devuelve el pase la próxima vez es el que recibió uno
//     tuyo. Y se mira la PROPORCIÓN entre lo que serviste y lo que definiste, no cuántas
//     asistencias juntaste: así un central que dio 0,44 y ningún gol cobra lo mismo que un nueve
//     que dio 1,4 y metió 0,2, porque los dos repartieron todo lo que tuvieron.
//   . EL RESULTADO PONE EL CLIMA. Ganar levanta el vestuario entero y perder lo enfría, hagas lo que
//     hagas. Es chico a propósito: es el ánimo del grupo, no tu mérito.
//   . ACAPARAR SE PAGA. Si metés dos o más y no diste ninguna, dejaste de pasarla. Y esto es lo que
//     le da filo a la regla: un hat-trick sin asistencias te sube el prestigio con el técnico, te
//     sube la hinchada... y te BAJA el vestuario. Las tres barras dejan de moverse juntas, que es
//     exactamente cuando un número empieza a ser una decisión.
//
// Un gol solo NUNCA es acaparar: el nueve que define una vez la jugada que le armaron no le sacó la
// pelota a nadie.

/** Lo que mueve ganar, empatar y perder. Chico: es el clima del grupo, no tu mérito. */
export const VESTUARIO_POR_GANAR = 1;
export const VESTUARIO_POR_PERDER = -1;

/**
 * LO QUE VALE REPARTIR, y por qué se mide el REPARTO y no la cantidad de asistencias.
 *
 * La primera versión pagaba +2 por asistencia. Medido sobre 30.000 partidos por caso, eso daba de
 * 22 a 421 partidos para ganarse el vestuario según el puesto y según qué opción tocabas: un
 * delantero eligiendo siempre la del medio lo ganaba en 26 partidos y el mismo delantero eligiendo
 * siempre la arriesgada no lo ganaba nunca. O sea que la moneda no medía si compartías: medía en
 * qué bolsa te tocó jugar.
 *
 * Ahora mira la PROPORCIÓN entre lo que serviste y lo que definiste, que además es lo que de verdad
 * ve un vestuario. Un central que da 0,44 asistencias y ningún gol repartió todo lo que tuvo; un
 * nueve que da 1,4 y mete 0,2 también. Los dos reparten, y los dos cobran igual.
 */
export const VESTUARIO_POR_REPARTIR = 2;
export const VESTUARIO_POR_DAR_ALGUNA = 1;

/** A partir de cuántos goles sin dar ninguna asistencia el vestuario empieza a mirarte raro. */
export const GOLES_PARA_SER_ACAPARADOR = 2;
/** Y cuánto baja por cada gol de más, con tope. */
export const VESTUARIO_POR_ACAPARAR = -1;
export const TOPE_DE_ACAPARAR = -3;

/**
 * EL TECHO POR PARTIDO, en las dos direcciones.
 *
 * Sin esto, un partido de cuatro asistencias movía la relación 8 puntos de un saque y en media
 * temporada el vestuario quedaba clavado en 100. El techo lo convierte en una pendiente que se sube
 * y se baja durante toda la carrera, que es de lo que se trata.
 */
export const TOPE_POR_PARTIDO = 4;

/**
 * CON CUÁNTO VESTUARIO LLEGÁS A UN CLUB NUEVO.
 *
 * El traspaso ya multiplicaba la relación por 0,9, que para un referente de 100 la dejaba en 90 --
 * o sea, en el escalón más alto igual. Con eso, ganarse el vestuario se hacía UNA vez en la carrera
 * y después el número no volvía a significar nada.
 *
 * Ahora hay un techo al llegar: por más ídolo que fueras allá, acá todavía no le pasaste la pelota a
 * nadie. 55 cae apenas encima del escalón medio, así que un fichaje arranca con las cuatro de
 * siempre menos la de ser nuevo -- tres -- y se gana las otras jugando. Es lo que hace que cambiar
 * de club cueste algo más que un número de camiseta.
 *
 * Lo que NO se toca es el piso: si llegás con menos de esto, llegás con lo que tenías. El techo
 * baja al que venía arriba, no sube al que venía abajo.
 */
export const VESTUARIO_AL_LLEGAR = 55;

/** La relación con el plantel nuevo, el día que firmás. */
export function vestuarioAlCambiarDeClub(actual: number): number {
  return Math.min(VESTUARIO_AL_LLEGAR, Math.round(actual * 0.9));
}

export interface LoQueHicisteEnElPartido {
  goles: number;
  asistencias: number;
  resultado: 'W' | 'D' | 'L';
}

/** Cuánto se movió tu relación con el plantel después de este partido. */
export function loQueElVestuarioVio(d: LoQueHicisteEnElPartido): number {
  const clima = d.resultado === 'W' ? VESTUARIO_POR_GANAR
    : d.resultado === 'L' ? VESTUARIO_POR_PERDER : 0;

  // ACAPARAR. Metiste dos o más y no diste ninguna: dejaste de pasarla. Un gol solo nunca cuenta --
  // el nueve que define una vez la jugada que le armaron no le sacó la pelota a nadie.
  if (d.asistencias === 0 && d.goles >= GOLES_PARA_SER_ACAPARADOR) {
    const castigo = Math.max(TOPE_DE_ACAPARAR, (d.goles - 1) * VESTUARIO_POR_ACAPARAR);
    return acotar(clima + castigo);
  }

  // REPARTIR. Serviste más de lo que definiste, o al menos diste una.
  const reparto = d.asistencias === 0 ? 0
    : d.asistencias > d.goles ? VESTUARIO_POR_REPARTIR
    : VESTUARIO_POR_DAR_ALGUNA;
  return acotar(clima + reparto);
}

const acotar = (n: number) => Math.max(-TOPE_POR_PARTIDO, Math.min(TOPE_POR_PARTIDO, n));

/**
 * Y lo que el vestuario DICE, que es la mitad que hace que la regla exista para el jugador.
 *
 * Sólo habla cuando pasó algo que se nota. Un +1 por ganar no merece un cartel: si el juego avisara
 * en cada partido, el aviso dejaría de significar nada y taparía los que sí importan.
 */
export function loQueDijoElVestuario(d: LoQueHicisteEnElPartido): string | null {
  if (d.asistencias === 0 && d.goles >= GOLES_PARA_SER_ACAPARADOR) {
    return d.goles >= 3
      ? `Metiste ${d.goles} y no diste ninguna. En el vestuario están contentos con el resultado y algo incómodos con vos.`
      : 'Dos goles y ni un pase decisivo. Alguno del plantel se quedó con la mano levantada.';
  }
  if (d.asistencias >= 2) {
    return `${d.asistencias} asistencias. En este vestuario ya saben que si te la dan, vuelve.`;
  }
  if (d.asistencias === 1) return 'Tu asistencia no la va a olvidar el que la empujó.';
  return null;
}
