// REDES SOCIALES CON COSTO REAL: el que te putea en la timeline, y las tres formas de contestarle.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Pedido: "responder a un hater puede volverse escándalo; el silencio también se paga."
//
// ChutSocial ya publicaba: la prensa opina, la hinchada opina, y el jugador MIRA. Lo único que
// podía hacer era publicar algo suyo después de un partido, sin nadie enfrente. Un hater es lo
// contrario: alguien que te habla a vos, y al que le podés contestar.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA QUE HACE QUE LA MECÁNICA EXISTA
// ---------------------------------------------------------------------------------------------
//
// **El silencio también se paga, y se paga más cada vez.**
//
// Sin eso, ignorar sería siempre lo óptimo -- riesgo cero contra una apuesta -- y nadie
// respondería nunca. Una opción que siempre gana no es una decisión: es la respuesta correcta con
// tres botones alrededor.
//
// Así que ignorar cuesta hinchada, poquito la primera vez y cada vez más: la cuenta que te pega
// crece porque nadie la frena, y a la quinta ya no es un tipo, es un tema. Contestar (bien o mal) o
// mandar al club a que conteste CIERRAN el asunto y ponen el contador en cero.
//
// ---------------------------------------------------------------------------------------------
// LOS NÚMEROS, Y LA PRIMERA VERSIÓN QUE ESTABA MAL
// ---------------------------------------------------------------------------------------------
//
// Contestar pagaba +12 si salía bien y −20 si salía mal, con un 40% de que saliera bien. Valor
// esperado: −7,2. Medido contra las otras dos salidas, PERDÍA SIEMPRE y en todos los niveles de
// silencio -- o sea que la mecánica seguía siendo tres botones alrededor de una respuesta correcta,
// sólo que ahora la correcta era "que conteste el club".
//
// Ahora el premio es grande de verdad (+22 juntando hinchada y prestigio) contra −20 del escándalo,
// y el valor esperado queda en −3,2: casi lo mismo que la salida segura del club, con una varianza
// enorme al lado. Ahí sí hay una decisión, y depende de si necesitás hinchada o no podés arriesgar.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL DADO SE TIRA AL ARMAR EL EVENTO Y NO AL ELEGIR
// ---------------------------------------------------------------------------------------------
//
// DecisionCenter recibe efectos FIJOS por opción, así que si contestar tuviera dos desenlaces
// posibles habría que resolverlos después, en otro lado, con otra cuenta. Ése es exactamente el
// patrón que este proyecto ya pagó caro (ver "una pregunta, una respuesta").
//
// Acá el desenlace de contestar se decide al ARMAR el evento y viaja adentro de la opción. El
// jugador no lo sabe -- para él sigue siendo una apuesta -- y el validador sí, que es lo que
// permite medir "cada cuánto sale mal" sin depender de la suerte del que corre el test.

/** Los efectos que aplica el evento. Mismo shape que DecisionCenter. */
export interface EfectosDelHater {
  prestige: number;
  fans: number;
  energy: number;
  capital: number;
  /**
   * De qué mecánica salió este evento, y qué se eligió.
   *
   * Va marcado y no se deduce de los números: "prestigio 0, hinchada negativa" describe también a
   * media docena de eventos genéricos, y colgar de eso el contador de silencios sería un bug
   * esperando a que alguien escriba un evento nuevo con la misma forma.
   */
  origen?: 'hater';
  eleccion?: 'contestar' | 'ignorar' | 'que-conteste-el-club';
}

export interface EventoDelHater {
  title: string;
  description: string;
  choices: { text: string; cost: number; outcome: string; effects: EfectosDelHater }[];
}

/** Con qué nota para abajo aparece uno. Es la misma vara que ya usa la viralización negativa. */
export const NOTA_QUE_ATRAE_HATERS = 5.5;
/** Cada cuánto aparece, habiendo jugado mal. No siempre: si fuera seguro dejaría de ser una tormenta. */
export const CHANCE_DE_HATER = 0.4;
/** Con qué frecuencia contestar sale bien. Menos de la mitad: es una apuesta, no un atajo. */
export const CHANCE_DE_QUE_SALGA_BIEN = 0.4;
/** Lo máximo que puede costar callarse. */
export const CASTIGO_MAXIMO_DEL_SILENCIO = 8;

/** ¿Aparece hoy? Necesita un partido flojo y el dado. */
export function apareceUnHater(dado: number, notaDelPartido: number): boolean {
  if (notaDelPartido > NOTA_QUE_ATRAE_HATERS) return false;
  return dado < CHANCE_DE_HATER;
}

/**
 * Lo que cuesta ignorarlo, en hinchada.
 *
 * `ignoradosSeguidos` son las veces que ya te callaste sin cerrar el tema. La primera vez casi no
 * duele -- que es lo que hace que ignorar parezca gratis -- y de ahí sube.
 */
export function castigoDelSilencio(ignoradosSeguidos: number): number {
  return Math.min(CASTIGO_MAXIMO_DEL_SILENCIO, 1 + ignoradosSeguidos);
}

const HATERS = [
  {
    autor: '@elpibedelsur_',
    texto: 'Otro partido de paseo. Cobra millones para caminar la cancha. Que se vaya ya.',
  },
  {
    autor: '@fulbo_sin_filtro',
    texto: 'Lo veo y no entiendo qué le ven. Cero gol, cero entrega, cero todo. Sobrevalorado nivel dios.',
  },
  {
    autor: '@hincha_desde_el_82',
    texto: 'Yo vi jugar a los grandes de este club. Esto es una vergüenza y encima se ríe en las redes.',
  },
  {
    autor: '@estadisticas_frias',
    texto: 'Los números no mienten y los suyos son un desastre. Que alguien le muestre la tabla.',
  },
];

/**
 * El hater de hoy, con las tres salidas ya resueltas.
 *
 * `dado` elige cuál aparece y si contestarle sale bien. `ignoradosSeguidos` decide cuánto cuesta
 * callarse esta vez.
 */
export function eventoDelHater(dado: number, ignoradosSeguidos: number): EventoDelHater {
  const acotado = Math.max(0, Math.min(0.999999, dado));
  const hater = HATERS[Math.floor(acotado * HATERS.length)];
  // Segundo dado sacado del mismo número, para no pedir dos parámetros: la parte decimal de abajo
  // no correlaciona con la de arriba, que es lo único que hace falta.
  const dadoDelDesenlace = (acotado * HATERS.length) % 1;
  const salioBien = dadoDelDesenlace < CHANCE_DE_QUE_SALGA_BIEN;
  const silencio = castigoDelSilencio(ignoradosSeguidos);

  return {
    title: 'Te contestaron en la cara',
    description: `${hater.autor} te citó y ya tiene miles de likes: "${hater.texto}"`,
    choices: [
      {
        text: 'Contestarle vos mismo',
        cost: 0,
        outcome: salioBien
          ? 'Le contestaste con una sola línea y sin insultar. Se hizo tendencia a tu favor: hasta los que te criticaban salieron a bancarte.'
          : 'Contestaste caliente y a las dos horas era portada. El club te pidió que bajes el tuit, y bajarlo fue peor.',
        effects: salioBien
          ? { prestige: 6, fans: 16, energy: 0, capital: 0, origen: 'hater', eleccion: 'contestar' }
          : { prestige: -7, fans: -13, energy: 0, capital: 0, origen: 'hater', eleccion: 'contestar' },
      },
      {
        text: 'Ignorarlo',
        cost: 0,
        outcome: ignoradosSeguidos === 0
          ? 'No dijiste nada. No pasó nada, tampoco.'
          : `No dijiste nada otra vez. La cuenta creció, ahora la citan otros, y en la tribuna se escuchó algo.`,
        effects: { prestige: 0, fans: -silencio, energy: 0, capital: 0, origen: 'hater', eleccion: 'ignorar' },
      },
      {
        text: 'Que conteste el club',
        cost: 0,
        outcome: 'El community manager publicó un comunicado correcto y vacío. El tema se cerró. Un par de periodistas hicieron el chiste de que no te dejan hablar solo.',
        effects: { prestige: -3, fans: 0, energy: 0, capital: 0, origen: 'hater', eleccion: 'que-conteste-el-club' },
      },
    ],
  };
}

/** ¿Esta elección fue callarse? Decide si el contador de silencios sube o vuelve a cero. */
export function fueIgnorarlo(efectos: { origen?: string; eleccion?: string }): boolean {
  return efectos.origen === 'hater' && efectos.eleccion === 'ignorar';
}
