// LAS AMARILLAS SE CUENTAN POR COMPETICIÓN, Y LA SANCIÓN SE CUMPLE EN ESA COMPETICIÓN.
//
// ---------------------------------------------------------------------------------------------
// LO QUE HABÍA, Y POR QUÉ ESTABA MAL
// ---------------------------------------------------------------------------------------------
//
// Un solo contador para toda la carrera: cinco amarillas donde fuera -- liga, copa nacional,
// Libertadores, selección -- y quedabas suspendido para el partido siguiente, fuera cual fuera.
//
// En el fútbol no funciona así, y no es un detalle de reglamento: es la diferencia entre que las
// tarjetas sean un impuesto y que sean algo que tenés que administrar. Las amarillas de la
// Libertadores no te suspenden para la liga, y por eso un jugador con una amarilla encima juega
// distinto la copa que el campeonato.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA
// ---------------------------------------------------------------------------------------------
//
// DOS AMARILLAS EN DOS PARTIDOS SEGUIDOS DE LA MISMA COMPETICIÓN, y te perdés el próximo partido DE
// ESA COMPETICIÓN.
//
// "Seguidos" es literal: si entre las dos amarillas jugaste un partido limpio de esa competición, la
// cuenta se reinicia. Eso hace que la segunda amarilla duela distinto según cuándo llegue, que es lo
// que la vuelve una situación y no un contador.
//
// NOTA HONESTA SOBRE EL REGLAMENTO REAL, porque el pedido venía con un "si no estoy mal": en Conmebol
// son dos amarillas EN LA COMPETICIÓN, no necesariamente seguidas; en UEFA son tres; y en la mayoría
// de las ligas domésticas es acumulación de cinco. O sea que "dos seguidas" no es la regla de
// ninguna competición real tal cual. Se implementó así porque es lo que se pidió y porque juega
// mejor -- avisa, se puede administrar, y perdona al que se porta bien una fecha. Cambiar a
// "dos en la competición" es borrar la comprobación de `seguidas`, nada más.
//
// ---------------------------------------------------------------------------------------------
// Y LA ROJA NO CAMBIA
// ---------------------------------------------------------------------------------------------
//
// La expulsión te suspende un partido igual, pero ahora también de ESA competición. Es lo mismo que
// pasa de verdad: te vas expulsado en la copa y el fin de semana jugás la liga.

/** Cuántas amarillas seguidas hacen falta para la sanción. */
export const AMARILLAS_PARA_SANCION = 2;

export interface CuentaDeTarjetas {
  /** Amarillas seguidas en esta competición. Se reinicia con un partido limpio o al cumplir. */
  amarillasSeguidas: number;
  /** Partidos de esta competición que te quedan por cumplir. */
  partidosDeSancion: number;
}

export type TarjetasPorCompeticion = Record<string, CuentaDeTarjetas>;

/** La cuenta de una competición, vacía si nunca jugaste ahí. */
export function cuentaDe(
  tarjetas: TarjetasPorCompeticion | undefined,
  competicion: string,
): CuentaDeTarjetas {
  return tarjetas?.[competicion] ?? { amarillasSeguidas: 0, partidosDeSancion: 0 };
}

/** ¿Estás suspendido para el próximo partido de esta competición? */
export function estasSancionado(
  tarjetas: TarjetasPorCompeticion | undefined,
  competicion: string,
): boolean {
  return cuentaDe(tarjetas, competicion).partidosDeSancion > 0;
}

export interface ResultadoDeLaFecha {
  tarjetas: TarjetasPorCompeticion;
  /** Si esta fecha te dejó suspendido, el aviso. null si no pasó nada que contar. */
  aviso: string | null;
}

/**
 * Anota lo que pasó en un partido que JUGASTE.
 *
 * Devuelve la cuenta nueva. Función pura: el perfil lo actualiza quien llama.
 */
export function anotarTarjetaDelPartido(
  tarjetas: TarjetasPorCompeticion | undefined,
  competicion: string,
  tarjeta: 'none' | 'yellow' | 'red',
): ResultadoDeLaFecha {
  const antes = cuentaDe(tarjetas, competicion);
  const guardar = (c: CuentaDeTarjetas, aviso: string | null): ResultadoDeLaFecha => ({
    tarjetas: { ...(tarjetas ?? {}), [competicion]: c },
    aviso,
  });

  if (tarjeta === 'red') {
    return guardar(
      { amarillasSeguidas: 0, partidosDeSancion: antes.partidosDeSancion + 1 },
      `🟥 Expulsado: te perdés el próximo partido de ${competicion}.`,
    );
  }

  if (tarjeta === 'yellow') {
    const seguidas = antes.amarillasSeguidas + 1;
    if (seguidas >= AMARILLAS_PARA_SANCION) {
      // Al cumplir, la cuenta arranca de cero. Es por esto que en el fútbol nadie termina una
      // temporada con veinticinco amarillas.
      return guardar(
        { amarillasSeguidas: 0, partidosDeSancion: antes.partidosDeSancion + 1 },
        `🟨🟨 Segunda amarilla en dos partidos seguidos de ${competicion}: te perdés el próximo.`,
      );
    }
    return guardar(
      { ...antes, amarillasSeguidas: seguidas },
      `🟨 Amarilla en ${competicion}. Con otra en el próximo partido de este torneo, te lo perdés.`,
    );
  }

  // PARTIDO LIMPIO: la racha se corta. Es la mitad de la regla -- sin esto, "dos seguidas" sería
  // "dos alguna vez" y la amarilla vieja te perseguiría toda la temporada.
  if (antes.amarillasSeguidas > 0) {
    return guardar(
      { ...antes, amarillasSeguidas: 0 },
      `✅ Partido limpio en ${competicion}: se te borró la amarilla que tenías encima.`,
    );
  }
  return guardar(antes, null);
}

/**
 * Cumplís una fecha de sanción en esta competición.
 *
 * Se llama cuando el partido se resuelve SIN vos por estar suspendido.
 */
export function cumplirFechaDeSancion(
  tarjetas: TarjetasPorCompeticion | undefined,
  competicion: string,
): TarjetasPorCompeticion {
  const antes = cuentaDe(tarjetas, competicion);
  return {
    ...(tarjetas ?? {}),
    [competicion]: { ...antes, partidosDeSancion: Math.max(0, antes.partidosDeSancion - 1) },
  };
}

/** Lo que se le muestra al jugador antes del partido, para que sepa qué se juega. */
export function avisoDeRiesgo(
  tarjetas: TarjetasPorCompeticion | undefined,
  competicion: string,
): string | null {
  const c = cuentaDe(tarjetas, competicion);
  if (c.partidosDeSancion > 0) return `Sancionado en ${competicion}`;
  if (c.amarillasSeguidas >= AMARILLAS_PARA_SANCION - 1) {
    return `Venís con amarilla en ${competicion}: otra y te perdés el próximo`;
  }
  return null;
}
