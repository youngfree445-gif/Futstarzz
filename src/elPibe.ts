// EL PIBE QUE SALE DE ABAJO: tu ahijado tiene carrera propia, y se sabe cómo le fue.
//
// ---------------------------------------------------------------------------------------------
// LO QUE HABÍA
// ---------------------------------------------------------------------------------------------
//
// La mentoría existía y era medio nombre: elegías un juvenil del plantel, cada cierre de temporada
// se tiraba un dado, y el dado te daba +2, 0 o -1 de prestigio. El pibe no era nadie -- era una
// variable con nombre propio. A los 23 se "graduaba" y desaparecía sin que nunca pasara nada.
//
// ---------------------------------------------------------------------------------------------
// LO QUE FALTABA, Y POR QUÉ ES LA MÁS CARA DE TODAS
// ---------------------------------------------------------------------------------------------
//
// Faltaba que el pibe TERMINARA EN ALGÚN LADO. Que lo vendan a Europa, que se convierta en mejor
// jugador que vos, o que se pierda -- y que vos te enteres, años después, cuando ya no es tu
// ahijado ni juega en tu club.
//
// Es cara porque obliga a llevarle una carrera a alguien que no sos vos: nivel, temporadas, destino.
// Todo lo demás que se hizo esta semana leía datos que el juego ya tenía. Éste los crea.
//
// ---------------------------------------------------------------------------------------------
// LA DECISIÓN QUE HACE QUE VALGA LA PENA
// ---------------------------------------------------------------------------------------------
//
// El pibe podría crecer solo, con un dado, y sería exactamente igual de barato que antes. No crece
// solo: CRECE SEGÚN VOS. Cuántas temporadas lo bancaste, en qué nivel estabas, cuánto pesaba tu
// palabra en ese vestuario.
//
// Eso convierte la mentoría de un +2 de prestigio en una apuesta a largo plazo: el pibe que
// apadrinaste a los 24 puede estar jugando en Europa cuando vos tengas 33, y el juego te lo va a
// decir. O puede no llegar nunca, que también pasa, y con la misma frecuencia con la que pasa en la
// vida real.
//
// MEDIDO, 2000 carreras por fila:
//
//     nadie lo banca                         llega  7%
//     lo bancás 1 temporada, sos normal      llega 13%
//     lo bancás 3 temporadas, sos normal     llega 22%
//     lo bancás 3, sos muy bueno             llega 52%
//     lo bancás 6, sos un fenómeno           llega 99%
//     lo bancás 6, pero sos flojo            llega  7%
//
// La última fila es la que más me gusta: bancar a alguien no alcanza si no tenés nada para
// enseñarle. Y la primera es la que hace que la mecánica signifique algo -- casi ningún juvenil
// llega solo, que es exactamente lo que pasa en el fútbol.

/** Nivel con el que un juvenil entra al radar. */
export const NIVEL_INICIAL = 55;
/** De acá para arriba, el pibe llegó: lo venden afuera o se consagra. */
export const NIVEL_PARA_LLEGAR = 82;
/** Temporadas en las que se define. Pasado eso, la historia del pibe tiene final si o si. */
export const TEMPORADAS_PARA_DEFINIRSE = 5;
/**
 * Nivel desde el cual el pibe empieza a tener chances, y cuánto nivel hace falta para llegar al
 * techo de probabilidad. Ver `chanceDeLlegar`.
 */
export const NIVEL_SIN_CHANCE = 66;
export const NIVEL_PARA_CHANCE_MAXIMA = 96;
/** Ni el mejor juvenil del mundo la tiene asegurada. */
export const CHANCE_MAXIMA = 0.85;

export interface Pibe {
  nombre: string;
  /** Dónde lo conociste. Puede terminar en otro lado, y ésa es la gracia. */
  clubName: string;
  desdeSemana: number;
  nivel: number;
  /** Temporadas en las que efectivamente lo apadrinaste. Si lo soltás, deja de sumar. */
  temporadasConVos: number;
  /** Temporadas que lleva en el radar, lo apadrines o no. */
  temporadas: number;
  destino?: DestinoDelPibe;
}

export interface DestinoDelPibe {
  que: 'europa' | 'crack' | 'perdido';
  semana: number;
  /** El texto que se cuenta. Ya viene armado para no re-narrar lo mismo en tres lados. */
  relato: string;
}

export interface DatosDelPibe {
  /** ¿Seguís siendo su mentor esta temporada? */
  loApadrinaste: boolean;
  /** Tu nivel medio (promedio de tus seis atributos). Aprender de un crack no es lo mismo. */
  tuNivel: number;
  /** Tu prestigio. Cuánto pesa tu palabra en ese vestuario. */
  tuPrestigio: number;
  /** Cómo le fue en la temporada: el MISMO dado que ya mueve el prestigio de mentor. */
  leSalioBien: boolean;
}

/**
 * Cuánto crece el pibe en una temporada.
 *
 * Se le pasa `leSalioBien` en vez de tirar un dado acá: ese dado ya existe en App (la mentoría
 * mueve tu prestigio con él) y tirar uno nuevo sería tener dos fuentes contestando lo mismo -- el
 * pibe podría "evolucionar bien" para tu prestigio y mal para su carrera en la misma temporada.
 */
export function crecimientoDelPibe(d: DatosDelPibe): number {
  // La base: los juveniles mejoran, es lo que hacen.
  let crece = d.leSalioBien ? 4 : 1;

  if (d.loApadrinaste) {
    // Aprender de alguien bueno vale, y aprender de alguien a quien el vestuario escucha vale más.
    //
    // LOS DOS PISOS SON BAJOS A PROPOSITO. La primera version arrancaba a contar desde 70 de nivel
    // y 50 de prestigio, y medido daba esto: un jugador promedio apadrinando tres temporadas movia
    // la aguja del 35% al 36%. O sea nada. Un mentor normal tiene que servir de algo, o la mecanica
    // es decorativa para la mayoria de las carreras.
    crece += Math.max(0, (d.tuNivel - 55) / 12);      // ~+1.2 siendo normal, ~+3 siendo un fenómeno
    crece += Math.max(0, (d.tuPrestigio - 30) / 30);  // ~+0.7 siendo normal, ~+2 si tu palabra pesa
  }

  // Y un techo: nadie sube diez puntos en un año ni siquiera con el mejor maestro del mundo.
  return Math.min(8, Number(crece.toFixed(2)));
}

/**
 * Qué chance tiene de llegar, con el nivel que alcanzó.
 *
 * ES UNA PROBABILIDAD Y NO UN UMBRAL, y esa fue la segunda corrección que salió de medir. Con un
 * umbral duro, el destino quedaba casi decidido por el bonus del mentor -- y peor: el pibe que
 * quedaba en el medio, ni bueno ni malo, no se definía nunca. Medido: el 38% de los pibes terminaba
 * "sin definir", o sea que más de un tercio de las veces la mecánica prometía una historia y no
 * entregaba ninguna, que es el peor resultado posible.
 *
 * Con probabilidad, el nivel inclina la cancha en vez de decidirla, y TODOS terminan en algún lado.
 */
export function chanceDeLlegar(nivel: number): number {
  const t = (nivel - NIVEL_SIN_CHANCE) / (NIVEL_PARA_CHANCE_MAXIMA - NIVEL_SIN_CHANCE);
  return Math.max(0, Math.min(CHANCE_MAXIMA, t * CHANCE_MAXIMA));
}

/**
 * ¿Terminó de definirse la carrera del pibe? Devuelve el destino, o null si todavía se está
 * haciendo.
 *
 * `dado` lo tira quien llama, igual que en la secuela: así esto se puede correr mil veces en el
 * banco de pruebas y contar cuántos pibes llegan de verdad.
 */
export function destinoDelPibe(pibe: Pibe, semana: number, dado: number): DestinoDelPibe | null {
  if (pibe.destino) return pibe.destino;

  // El estallido temprano: el que a los dos años ya es mejor que medio plantel no espera a nadie.
  if (pibe.nivel >= NIVEL_PARA_LLEGAR) {
    // Llegó. Las dos formas de llegar, y la diferencia es dónde: irse a Europa es lo más común;
    // quedarse y volverse el mejor del continente es más raro y se cuenta distinto.
    const aEuropa = dado < 0.7;
    return aEuropa
      ? {
        que: 'europa', semana,
        relato: `${pibe.nombre}, aquel juvenil de ${pibe.clubName}, se fue a Europa. Lo vendieron por una cifra que en ${pibe.clubName} nunca habían visto.`,
      }
      : {
        que: 'crack', semana,
        relato: `${pibe.nombre} se convirtió en el mejor jugador de la liga. El pibe que entrenaba con vos ahora es la figura.`,
      };
  }

  // Y a las cinco temporadas se define si o si. El nivel decide las chances, no el resultado.
  if (pibe.temporadas >= TEMPORADAS_PARA_DEFINIRSE) {
    if (dado < chanceDeLlegar(pibe.nivel)) {
      return {
        que: 'europa', semana,
        relato: `${pibe.nombre}, aquel juvenil de ${pibe.clubName}, se fue a Europa. Tardó más de lo que todos esperaban, pero llegó.`,
      };
    }
    return {
      que: 'perdido', semana,
      relato: `${pibe.nombre} no llegó. Anda por el ascenso, jugando de a ratos. Le pasa a casi todos los que prometen, y duele igual.`,
    };
  }

  return null;
}

/**
 * Lo que el pibe dice de vos cuando le fue bien.
 *
 * Ésta es la razón entera por la que la mecánica existe: no el prestigio, sino que alguien, años
 * después y desde otro país, diga tu nombre.
 */
export function loQueDiceDeVos(pibe: Pibe, tuNombre: string): string | null {
  if (!pibe.destino || pibe.destino.que === 'perdido') return null;
  if (pibe.temporadasConVos < 1) return null;
  return pibe.temporadasConVos >= 3
    ? `"Todo lo que sé lo aprendí mirando a ${tuNombre} entrenar. Me bancó ${pibe.temporadasConVos} años cuando yo no era nadie."`
    : `"${tuNombre} fue el primero que me trató como a un jugador y no como a un pibe."`;
}
