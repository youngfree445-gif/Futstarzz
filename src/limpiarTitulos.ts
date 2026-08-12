// Limpieza de títulos que se anotaron por bugs ya corregidos.
//
// El palmarés se DERIVA del estado (ver palmares.ts), así que los títulos de liga fantasma se
// arreglaron solos al arreglar la derivación. Pero `cupTitles` es un array GUARDADO: lo que entró
// ahí mientras el bug estaba vivo se queda para siempre, y sigue apareciendo en la vitrina.
//
// El caso reportado: "me dio 2 títulos con Junior, solo debía darme la Superliga y salió el otro".
// Venía de `cerroElTorneo`, que coronaba campeón cuando la lista de partidos estaba VACÍA -- no
// distinguía "no quedan partidos por jugar" de "no hay partidos". Corregido, pero el título ya
// escrito no se borra solo.
//
// LA REGLA, y es una sola: no se puede ganar un torneo en el que no se jugó ni un partido.
//
// Deliberadamente conservadora. Sólo se descarta un título cuando hay CERTEZA de que no se jugó, y
// para eso se exige que el perfil tenga resultados guardados de esa temporada: si no hay ninguno no
// se toca nada, porque la ausencia de datos no es prueba de nada. Una carrera vieja, guardada antes
// de que existiera datedResults, sale de acá intacta.

import type { CupTitle, PlayerProfile } from './types';
import { CAREER_START_YEAR } from './leagueEngine';

export interface LimpiezaDeTitulos {
  perfil: PlayerProfile;
  quitados: CupTitle[];
}

/**
 * ¿De qué competición es este resultado? Los nombres no siempre coinciden exactos: el título dice
 * "Copa BetPlay" y el resultado puede decir "Copa BetPlay · Cuartos de Final (Ida)". Se compara por
 * prefijo, que es como se arma la etiqueta.
 */
function mismoTorneo(nombreDelTitulo: string, nombreDelResultado: string): boolean {
  const a = nombreDelTitulo.toLowerCase().trim();
  const b = nombreDelResultado.toLowerCase().trim();
  return a === b || b.startsWith(a) || a.startsWith(b);
}

/**
 * Saca del palmarés los títulos de torneos que el jugador nunca jugó.
 *
 * Devuelve el perfil intacto (la misma referencia) cuando no hay nada que sacar, para que quien
 * llame pueda saltarse el guardado sin comparar nada.
 */
export function limpiarTitulosFantasma(profile: PlayerProfile): LimpiezaDeTitulos {
  const titulos = profile.cupTitles ?? [];
  const resultados = profile.datedResults ?? [];
  if (!titulos.length || !resultados.length) return { perfil: profile, quitados: [] };

  // Años en los que hay CONSTANCIA de haber jugado algo. Fuera de esos años no se juzga nada.
  const aniosConDatos = new Set(resultados.map(r => Number(r.date.slice(0, 4))));

  const quitados: CupTitle[] = [];
  const quedan = titulos.filter(t => {
    // El título guarda el año de carrera (1, 2, 3...) en unos casos y el año calendario en otros,
    // según cuándo se escribió. Se aceptan las dos lecturas antes que borrar por una ambigüedad.
    const anioCalendario = t.year >= CAREER_START_YEAR ? t.year : CAREER_START_YEAR + t.year - 1;
    if (!aniosConDatos.has(anioCalendario)) return true;   // sin datos de ese año: no se juzga

    const jugoAlguno = resultados.some(r =>
      Number(r.date.slice(0, 4)) === anioCalendario && mismoTorneo(t.competition, r.competition));
    if (jugoAlguno) return true;

    quitados.push(t);
    return false;
  });

  if (!quitados.length) return { perfil: profile, quitados: [] };
  return { perfil: { ...profile, cupTitles: quedan }, quitados };
}
