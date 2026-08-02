// Las voces de ChutSocial: quién comenta tu partido y cómo suena cada uno.
//
// Antes los posts eran fijos y tibios ("buen aporte", "cosas interesantes", "a ver qué muestra")
// y no reaccionaban al partido: te ponían lo mismo tras un 9 que tras un 3. El feed no se sentía
// vivo porque nadie estaba realmente mirando lo que hacías.
//
// Acá cada post nace de tu calificación real. La intensidad sube con lo mal que jugaste: un 5,5 es
// crítica medida, un 4 es bronca, un 3 o menos es hinchada furiosa. Y al revés con las buenas.
//
// Sobre el lenguaje: la hinchada real putea, y el feed lo refleja. El límite es lo que la gente
// ataca -- se putea CÓMO JUGASTE, nunca lo que sos. Nada de ataques por origen, color o
// orientación: eso no es tono de cancha, es otra cosa, y además dejaría el juego impublicable.

export type TonoPartido = 'catastrofe' | 'malo' | 'flojo' | 'normal' | 'bueno' | 'brillante';

/** El tramo en el que cae tu último partido. Es lo que decide qué se dice de vos. */
export function tonoDeCalificacion(rating: number, goles: number): TonoPartido {
  if (rating >= 8.5 || goles >= 3) return 'brillante';
  if (rating >= 7.3 || goles >= 2) return 'bueno';
  if (rating >= 6.3) return 'normal';
  if (rating >= 5.3) return 'flojo';
  if (rating >= 4) return 'malo';
  return 'catastrofe';
}

export interface Voz {
  author: string;
  role: string;
  avatar: string;
  /** Un texto por tono. `n` = nombre del jugador, `r` = calificación, `g` = goles. */
  frases: Partial<Record<TonoPartido, ((n: string, r: string, g: number) => string)[]>>;
}

// Periodistas, cuentas de hinchas y agregadores. Los nombres son homenajes reconocibles al
// periodismo deportivo colombiano y argentino, no las cuentas reales.
export const VOCES: Voz[] = [
  {
    author: 'Eduardo Luis',
    role: 'Narrador',
    avatar: '🎙️',
    frases: {
      brillante: [
        (n) => `¡PIDAN DOMICILIO! ¡${n.toUpperCase()} LOS DEJÓ A TODOS SENTADOS! Esto no es normal, hermano, ESTO NO ES NORMAL 🔥`,
        (n) => `¡SE VISTIÓ DE GALA ${n.toUpperCase()}! El que no lo vio jugar hoy, que pida el resumen. ¡QUÉ JUGADOR, SEÑORES!`,
      ],
      bueno: [
        (n) => `¡Ese muchacho tiene algo distinto! ${n} volvió a aparecer cuando el equipo lo necesitaba. Ojo con él 👀`,
      ],
      normal: [
        (n) => `${n} cumplió. Ni brilló ni desentonó. En el fútbol también hay días así, señores.`,
      ],
      flojo: [
        (n) => `Se lo vio incómodo a ${n}. Le faltó chispa, le faltó atrevimiento. Nos debe una.`,
      ],
      malo: [
        (n, r) => `Partido para el olvido de ${n}. ${r} de calificación. Hay que levantar, muchacho, porque así no.`,
      ],
      catastrofe: [
        (n) => `No lo vi. Sinceramente no lo vi a ${n} en la cancha. Y cuando un jugador no aparece, el equipo juega con uno menos.`,
      ],
    },
  },
  {
    author: 'Carlos Antonio Vélez',
    role: 'Periodista',
    avatar: '📻',
    frases: {
      brillante: [
        (n) => `Lo de ${n} hoy fue de otra categoría. Y lo digo yo, que no regalo elogios. Que no se le suba.`,
      ],
      bueno: [
        (n) => `Correcto ${n}. Correcto. Ahora falta la parte difícil: sostenerlo. Ahí se ven los jugadores.`,
      ],
      normal: [
        (n) => `${n} pasó desapercibido. En este fútbol de hoy eso casi que es un elogio, pero no alcanza.`,
      ],
      flojo: [
        (n) => `Flojísimo ${n}. Muy por debajo de lo que se le exige a un titular. Así no se llega a ningún lado.`,
      ],
      malo: [
        (n, r) => `${r} de calificación. Un jugador que desaparece cuando el equipo más lo necesita. Lamentable, sencillamente lamentable.`,
      ],
      catastrofe: [
        (n) => `Vergonzoso. Lo de ${n} hoy fue una falta de respeto con la gente que paga la boleta. Que alguien le explique lo que significa esa camiseta.`,
      ],
    },
  },
  {
    author: 'Gastón Edul',
    role: 'Periodista',
    avatar: '📲',
    frases: {
      brillante: [
        (n) => `🚨 Preguntan por ${n} desde el exterior. Hay clubes siguiéndolo hace rato y lo de hoy no pasó desapercibido. Seguimos.`,
      ],
      bueno: [
        (n) => `Buen partido de ${n}. El cuerpo técnico está conforme con su evolución. Info.`,
      ],
      normal: [
        (n) => `${n} completó los 90'. Sin novedades por ahora en cuanto a su situación contractual.`,
      ],
      flojo: [
        (n) => `Partido flojo de ${n}. En el club no están preocupados, pero lo están siguiendo de cerca. Info.`,
      ],
      malo: [
        (n) => `Momento delicado de ${n}. En el cuerpo técnico hay dudas sobre su titularidad para el próximo partido.`,
      ],
      catastrofe: [
        (n) => `🚨 Fuerte malestar interno con el rendimiento de ${n}. No descartan sacarlo del once. Seguimos informando.`,
      ],
    },
  },
  {
    author: 'ombe_tiburon',
    role: 'Hincha del Junior',
    avatar: '🦈',
    frases: {
      brillante: [
        (n) => `OMBE ESE PELAO ${n.toUpperCase()} ES DEL TIBURÓN DE VERDAD 🦈🔥 no lo suelten por nada`,
      ],
      bueno: [
        (n) => `me gustó ${n} hoy, se le vio con ganas. eso es lo que uno quiere ver ombe 🦈`,
      ],
      normal: [
        (n) => `ni fu ni fa ${n}. tampoco le voy a pegar, cumplió y ya`,
      ],
      flojo: [
        (n) => `qué le pasa a ${n} ombe, se le nota que anda pesado. despierta hermano 😤`,
      ],
      malo: [
        (n, r) => `${r} de calificación. ${r}. y después se preguntan por qué la gente no va al estadio 🤡`,
      ],
      catastrofe: [
        (n) => `NO CORRIÓ UNA. NI UNA. devolvé la camiseta hermano que hay pelaos en la cantera muriéndose por jugar 🤬`,
      ],
    },
  },
  {
    author: 'ElBurroIntel',
    role: 'Cuenta de Fútbol',
    avatar: '🐴',
    frases: {
      brillante: [
        (n, r, g) => `${n} hoy: ${r} de calificación${g > 0 ? ` y ${g} gol${g > 1 ? 'es' : ''}` : ''}. Los números no mienten, señores. LOCURA TOTAL 🔥📈`,
      ],
      bueno: [
        (n) => `Sin hacer ruido, ${n} viene siendo de lo más regular del equipo. El dato que nadie está mirando 📊`,
      ],
      normal: [
        (n) => `${n}: partido correcto, sin sobresaltos. El equipo necesita más de él para dar el salto.`,
      ],
      flojo: [
        (n) => `Alerta con ${n}: viene en caída. Los números del último mes preocupan 📉`,
      ],
      malo: [
        (n, r) => `${n} promedió ${r} hoy. Uno de los peores de la cancha. Los datos son crudos pero son los datos.`,
      ],
      catastrofe: [
        (n) => `El partido de ${n} hoy es de los peores que registramos esta temporada. Sin vueltas: un desastre 📉🔻`,
      ],
    },
  },
  {
    author: 'hinchafurioso_22',
    role: 'Hincha',
    avatar: '🔥',
    frases: {
      brillante: [
        (n) => `${n.toUpperCase()} TE AMO. ESO ES TODO. ESO ES TODO LO QUE TENGO PARA DECIR ❤️🔥`,
      ],
      bueno: [
        (n) => `bueno bueno, apareció ${n}. seguí así y nos olvidamos de todo lo anterior 👏`,
      ],
      normal: [
        (n) => `${n} jugó. estuvo. respiró. no mucho más que eso la verdad`,
      ],
      flojo: [
        (n) => `otra vez ${n} caminando la cancha. me tiene podrido ya 😒`,
      ],
      malo: [
        (n) => `QUÉ HACE ${n.toUpperCase()} EN PRIMERA DIVISIÓN. alguien que me explique porque yo no entiendo nada`,
      ],
      catastrofe: [
        (n) => `andate a la mierda ${n}, en serio. jugás como si nos estuvieras haciendo un favor 🤬 UNA VERGÜENZA`,
      ],
    },
  },
  {
    author: 'AtaqueFutbolero',
    role: 'Medio Digital',
    avatar: '⚔️',
    frases: {
      brillante: [
        (n) => `🔥 NOCHE DE GALA: ${n} fue la figura absoluta. Las redes explotaron con su actuación.`,
      ],
      bueno: [
        (n) => `${n} sumó otra buena actuación. ¿Está listo para dar el salto a un grande?`,
      ],
      normal: [
        (n) => `${n} pasó sin pena ni gloria. El debate sigue abierto en las redes.`,
      ],
      flojo: [
        (n) => `Las redes le pegan a ${n} tras otra actuación deslucida. ¿Merece seguir de titular?`,
      ],
      malo: [
        (n) => `🔴 EXPLOTÓ LA HINCHADA contra ${n}. "Que se vaya" fue tendencia durante todo el segundo tiempo.`,
      ],
      catastrofe: [
        (n) => `🚨 LAPIDARIO: la hinchada destrozó a ${n} en redes. Lo más suave que le dijeron fue "vendé la camiseta".`,
      ],
    },
  },
  {
    author: 'GxlDePaulinho',
    role: 'Cuenta de Memes',
    avatar: '😂',
    frases: {
      brillante: [
        (n) => `los rivales viendo a ${n} agarrar la pelota 💀 pidan la hora, pidan la hora`,
      ],
      bueno: [
        (n) => `${n} apareciendo justo cuando lo estábamos por putear: 😇`,
      ],
      normal: [
        (n) => `${n} hoy fue el equivalente futbolístico de un vaso de agua tibia`,
      ],
      flojo: [
        (n) => `${n} tocando la pelota hoy 🫠 hermano se te va la vida`,
      ],
      malo: [
        (n) => `${n} en el calentamiento: 😎\n${n} en el partido: 🤡`,
      ],
      catastrofe: [
        (n) => `alguien vaya a buscar a ${n} que se perdió en la cancha y no aparece desde el minuto 1 🔍💀`,
      ],
    },
  },
];

/**
 * Elige N voces distintas para comentar tu partido, de forma estable dentro de la misma semana.
 *
 * Determinístico a propósito: si fuera Math.random, el feed cambiaría en cada render y daría la
 * sensación de que nadie dijo nada en serio. Con la semana como semilla, los comentarios se quedan
 * hasta que pasa algo nuevo.
 */
export function postsDelPartido(
  nombre: string,
  rating: number,
  goles: number,
  semana: number,
  cuantos = 4,
): { author: string; role: string; avatar: string; content: string }[] {
  const tono = tonoDeCalificacion(rating, goles);
  const r = rating.toFixed(1);

  // Barajado estable: mismo orden toda la semana, distinto la siguiente.
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 1) * 97.13 + i * 31.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const elegidas = VOCES
    .map((v, i) => ({ v, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, cuantos)
    .map(x => x.v);

  return elegidas.map((voz, i) => {
    const opciones = voz.frases[tono] ?? voz.frases.normal ?? [];
    const frase = opciones[Math.floor(mezcla(i + 50) * opciones.length)] ?? opciones[0];
    return {
      author: voz.author,
      role: voz.role,
      avatar: voz.avatar,
      content: frase ? frase(nombre, r, goles) : '',
    };
  }).filter(p => p.content);
}
