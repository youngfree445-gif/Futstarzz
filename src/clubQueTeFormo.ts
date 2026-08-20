// EL CLUB QUE TE FORMÓ.
//
// ---------------------------------------------------------------------------------------------
// LA IDEA
// ---------------------------------------------------------------------------------------------
//
// Tarde en la carrera, el primer club de tu vida te llama para que vuelvas a terminar donde
// empezaste. No es una oferta más del mercado: es LA oferta que no se mide en plata.
//
// El juego ya guardaba de dónde saliste -- `seasonHistory[0]` está ahí desde siempre -- y no lo
// usaba para nada salvo una línea del documental de retiro. Ésta es la mecánica más barata de todas
// las que quedaban, porque el dato ya existe: lo único que faltaba era que alguien lo mirara.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ES UNA OFERTA Y NO UN EVENTO
// ---------------------------------------------------------------------------------------------
//
// Lo obvio sería un cartel: "tu primer club te llama, ¿volvés?". Sería un evento, se leería una vez
// y se olvidaría.
//
// Acá es una OFERTA que aparece en tu mercado y se queda ahí. Eso cambia la naturaleza de la cosa:
// deja de ser algo que te pasa y pasa a ser algo que estás decidiendo no hacer, temporada tras
// temporada, mientras seguís en un club grande cobrando cuatro veces más. Es la misma diferencia
// que hay entre que te ofrezcan algo y que te estén esperando.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES REGLAS
// ---------------------------------------------------------------------------------------------
//
//   1. TE LLAMAN CUANDO YA SOS VIEJO, no antes. A los 24 nadie te pide que vuelvas a casa: te
//      quieren en Europa. El llamado es de los 32 para arriba.
//   2. TE QUIEREN A VOS, no a tus números. La oferta NO mira prestigio ni partidos -- es la única
//      del mercado que está siempre abierta. Ése es el punto entero: aunque no le sirvas a nadie
//      más, ahí te esperan.
//   3. PAGAN LO QUE PUEDEN, que es poco. Volver cuesta plata de verdad. Si el club que te formó
//      pagara como un grande, la decisión no existiría.

import type { PlayerProfile, Club } from './types';

/** De qué edad para arriba el club que te formó se anima a llamarte. */
export const EDAD_DEL_LLAMADO = 32;

/**
 * El id del club donde empezaste todo, o null si todavía no cerraste ni una temporada.
 *
 * Sale de `seasonHistory[0]`, que se escribe al cerrar la primera temporada. Antes de eso el club
 * que te formó ES tu club actual, así que no hay nada que llamar.
 */
export function clubQueTeFormo(perfil: Pick<PlayerProfile, 'seasonHistory'>): string | null {
  // El `?.` no sobra aunque el tipo diga que seasonHistory siempre está: el simulador de carreras
  // arma perfiles a mano y las partidas viejas se guardaron antes de que el campo existiera. Lo
  // encontró el simulador la primera vez que se le pidió el mercado con esta regla puesta.
  return perfil.seasonHistory?.[0]?.clubId ?? null;
}

/** Cuántas temporadas jugaste ahí. Vuelve más fuerte el llamado si fueron varias. */
export function temporadasEnLaCasa(perfil: Pick<PlayerProfile, 'seasonHistory'>): number {
  const casa = clubQueTeFormo(perfil);
  if (!casa) return 0;
  return (perfil.seasonHistory ?? []).filter(s => s.clubId === casa).length;
}

/**
 * ¿El club que te formó te está llamando?
 *
 * Deliberadamente NO mira prestigio, forma, ni si el club es mejor o peor que el tuyo. Un club te
 * ficha por lo que le servís; el club que te formó te llama por lo que fuiste. Son dos preguntas
 * distintas y ésta es la segunda.
 */
export function teLlamaLaCasa(
  perfil: Pick<PlayerProfile, 'seasonHistory' | 'currentClubId' | 'age'>,
  clubId: string,
): boolean {
  if (perfil.age < EDAD_DEL_LLAMADO) return false;
  if (clubId === perfil.currentClubId) return false;   // ya estás en casa
  return clubQueTeFormo(perfil) === clubId;
}

/** El texto que acompaña la oferta en el mercado. Corto: es lo único que necesita decir. */
export function motivoDelLlamado(nombreDelClub: string, temporadas: number, edad: number): string {
  if (temporadas >= 4) {
    return `Donde jugaste tus primeras ${temporadas} temporadas. A los ${edad}, ${nombreDelClub} te quiere de vuelta para que termines en casa.`;
  }
  return `El club donde empezaste todo. A los ${edad}, ${nombreDelClub} te abre la puerta: acá vas a jugar.`;
}

/** Lo que se te dice cuando aceptás. */
export function volvisteACasa(nombreDelClub: string, edad: number): string {
  return `Volviste a ${nombreDelClub} a los ${edad}, donde empezó todo. Menos plata, menos luces, y la única hinchada que te vio crecer.`;
}

/**
 * ¿Este club es el que te formó Y te está esperando? Lo usa el retiro escalonado para preferirlo
 * antes que a cualquier otro club chico: bajar de categoría a un club cualquiera es una decisión
 * de calendario; bajar al club que te formó es un final.
 */
export function esLaCasaQueEspera(
  perfil: Pick<PlayerProfile, 'seasonHistory' | 'currentClubId' | 'age'>,
  club: Club,
): boolean {
  return teLlamaLaCasa(perfil, club.id);
}
