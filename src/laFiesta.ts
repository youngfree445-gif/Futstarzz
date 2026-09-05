// LA FIESTA ANTES DE UN PARTIDO IMPORTANTE, y la foto que puede salir tres fechas después.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Pedido: "fiesta antes de un partido importante. Nadie se entera... salvo que salga una foto."
//
// El juego ya tenía una noche de fiesta entre los eventos genéricos, y aparecía cualquier martes
// contra cualquiera. Eso la vuelve una cuenta de energía: vas o no vas, y el número dice cuál
// conviene. Lo que la hace una decisión es el CONTEXTO -- que sea la noche previa a un clásico, a
// una final o a una noche de Libertadores -- y que haya algo que no podés calcular.
//
// ---------------------------------------------------------------------------------------------
// LA ESPERA ES LA MECÁNICA
// ---------------------------------------------------------------------------------------------
//
// El detalle que la hace memorable, y el único que había que respetar sí o sí: **el resultado de la
// foto se decide al ir, pero se revela DÍAS DESPUÉS.**
//
// Si el escándalo saliera en el momento, sería un dado con dos caras y se acabó: fuiste, tuviste
// suerte o no, seguimos. Reveládolo tres fechas más tarde, el jugador se pasa tres partidos
// esperando -- y esa espera es la mitad de lo que se pidió. Cuando pasa el plazo y no salió nada,
// también es un desenlace.
//
// Por eso el dado se tira AL IR y se guarda la respuesta: si se tirara al revelar, el juego estaría
// contestando dos veces la misma pregunta con dos cuentas distintas, que es de donde salen los bugs
// de esta casa (ver "una pregunta, una respuesta").
//
// ---------------------------------------------------------------------------------------------
// EN QUÉ SE COBRA
// ---------------------------------------------------------------------------------------------
//
// Ir sube el ENTORNO y baja la ENERGÍA. El costo físico es chico a propósito: la medición de
// partida dice que la energía de una carrera normal termina en 5, o sea en el piso
// (docs/MEDICION_DE_PARTIDA.md), así que cobrar fuerte ahí no se sentiría. El peso real está en el
// riesgo de la foto, que pega en hinchada y prestigio -- y el prestigio es lo que dispara la caída
// de patrocinios que el juego ya tiene armada.

/** Los efectos que aplica el evento. Mismo shape que DecisionCenter. */
export interface EfectosDeLaFiesta {
  prestige: number;
  fans: number;
  energy: number;
  capital: number;
  entorno?: number;
  origen?: 'fiesta';
  eleccion?: 'ir' | 'quedarse';
  /**
   * Si la foto de esa noche va a salir. Viaja adentro de la opción de IR porque la tirada es parte
   * de la regla y la regla vive acá: si la tirara quien muestra el evento, habría dos lugares
   * decidiendo lo mismo y tarde o temprano dirían cosas distintas.
   */
  laFotoSale?: boolean;
}

export interface EventoDeLaFiesta {
  title: string;
  description: string;
  choices: { text: string; cost: number; outcome: string; effects: EfectosDeLaFiesta }[];
}

/** Cada cuánto sale la foto. Baja: la mayoría de las veces no pasa nada, que es lo que la hace tentadora. */
export const CHANCE_DE_QUE_SALGA_LA_FOTO = 0.25;
/** Cuántas fechas pasan hasta que se sabe. La espera es la mecánica. */
export const FECHAS_HASTA_QUE_SE_SABE = 3;
/** Lo que cuesta ir, en el cuerpo. */
export const ENERGIA_DE_LA_FIESTA = 16;
/** Lo que suma ir, en los tuyos. */
export const ENTORNO_DE_LA_FIESTA = 10;
/** Lo que cuesta la foto cuando sale. */
export const ESCANDALO_PRESTIGIO = 12;
export const ESCANDALO_HINCHADA = 14;

/** Por qué este partido es grande. Cada motivo cambia el texto, no los números. */
export type MotivoDelPartidoGrande = 'clasico' | 'final' | 'continental';

/**
 * ¿Hay fiesta esta noche?
 *
 * Sólo antes de un partido grande, y ni siquiera siempre: si apareciera en todos, dejaría de ser
 * la excepción y volvería a ser una cuenta de energía.
 */
export const CHANCE_DE_QUE_TE_INVITEN = 0.5;

export function hayFiestaEstaNoche(dado: number, motivo: MotivoDelPartidoGrande | null): boolean {
  if (!motivo) return false;
  return dado < CHANCE_DE_QUE_TE_INVITEN;
}

/** ¿Sale la foto? Se decide AL IR, no al revelar. */
export function saleLaFoto(dado: number): boolean {
  return dado < CHANCE_DE_QUE_SALGA_LA_FOTO;
}

const COMO_LO_DICEN: Record<MotivoDelPartidoGrande, { title: string; description: string }> = {
  clasico: {
    title: 'La noche antes del clásico',
    description: 'Un amigo cumple años y alquiló un lugar. Te juran que no hay nadie con teléfono. Mañana es el clásico.',
  },
  final: {
    title: 'La noche antes de la final',
    description: 'Los de siempre armaron algo chico para "descargar la ansiedad". Mañana se juega una final.',
  },
  continental: {
    title: 'La noche antes de la copa',
    description: 'Cae gente al departamento y se hace la una. Mañana hay partido de copa internacional.',
  },
};

/**
 * El evento, con la suerte de la foto YA TIRADA y guardada adentro de la opción de ir.
 *
 * `dado` decide si la foto va a salir. El jugador no lo sabe cuando elige, y no lo va a saber hasta
 * dentro de tres fechas -- ni el desenlace que lee al elegir se lo dice, porque los dos textos
 * terminan igual de tranquilos.
 */
export function eventoDeLaFiesta(dado: number, motivo: MotivoDelPartidoGrande): EventoDeLaFiesta {
  const texto = COMO_LO_DICEN[motivo];
  return {
    title: texto.title,
    description: texto.description,
    choices: [
      {
        text: 'Ir un rato',
        cost: 0,
        // El MISMO texto salga o no salga la foto: si el desenlace inmediato adelantara algo, la
        // espera no existiría y con ella se iría la mecánica entera.
        outcome: 'Te quedaste dos horas y te volviste temprano. Nadie del club se enteró. Por ahora.',
        effects: {
          prestige: 0,
          fans: 0,
          energy: -ENERGIA_DE_LA_FIESTA,
          capital: 0,
          entorno: ENTORNO_DE_LA_FIESTA,
          origen: 'fiesta',
          eleccion: 'ir',
          laFotoSale: saleLaFoto(dado),
        },
      },
      {
        text: 'Quedarte durmiendo',
        cost: 0,
        outcome: 'Te quedaste. En el grupo lo comentaron un rato y después hablaron de otra cosa.',
        effects: {
          prestige: 0,
          fans: 0,
          energy: 0,
          capital: 0,
          entorno: -4,
          origen: 'fiesta',
          eleccion: 'quedarse',
        },
      },
    ],
  };
}

/** ¿Esta elección fue ir? Es la que deja la foto pendiente. */
export function fueALaFiesta(efectos: { origen?: string; eleccion?: string }): boolean {
  return efectos.origen === 'fiesta' && efectos.eleccion === 'ir';
}

/** Lo que pega la foto cuando sale, tres fechas después. */
export function golpeDeLaFoto(): { prestige: number; fans: number } {
  return { prestige: -ESCANDALO_PRESTIGIO, fans: -ESCANDALO_HINCHADA };
}

/** Lo que se le dice al jugador cuando se cumple el plazo. */
export function loQuePasoConLaFoto(salio: boolean): string {
  return salio
    ? '📸 Salió la foto. Una cuenta de chismes la publicó con fecha y hora: la noche antes del partido. El club emitió un comunicado y no te nombró bien.'
    : '🤐 Pasaron los días y la foto de esa noche no apareció nunca. Esta vez zafaste.';
}
