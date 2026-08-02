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

// El tono sale de leer las cuentas reales que sigue el usuario (@Elburrointel, @ToqueSports,
// @HablaDeportes, @cuidsports, @juniorlpr1924, @AtaqueFutbolero, @giraltpablo, @gastonedul).
// Cosas que se copiaron del habla real y no se habrían inventado de cero:
//   · el costeño: "ombe", "a vaina", "no hay es una monda", "mojones", "vayan a pelar verga"
//   · el sarcasmo con emoji derretido: "¡AY, BICAMPEÓN…🫠!"
//   · "debacle", "volvió a dejar dudas", "¿qué le está faltando?"
//   · el periodista serio cita en comillas desde zona mixta, con 🗣️ adelante
//   · el agregador va TODO EN MAYÚSCULAS con banderitas y "Vía @fulano"
//   · el hincha viejo defiende al club y le pega a la propia hinchada por no acompañar
//
// Los nombres son homenajes reconocibles, no las cuentas reales.
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
        (n) => `${n}: “Sabemos que hay que mejorar, el grupo está tranquilo”. La palabra del volante tras el partido.`,
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
    // El hincha costeño sin filtro. El habla es la real: "a vaina", "no hay es una monda",
    // "mojones", "vayan a pelar verga". Putea el rendimiento, nunca a la persona por lo que es.
    author: 'ElBurroIntel',
    role: 'Juniorismo',
    avatar: '🫏',
    frases: {
      brillante: [
        (n) => `A VAINA ${n.toUpperCase()} ombe 😮‍💨 eso es lo que queremos ver mi Juniorismo 🦈`,
        (n) => `Erda y tal, ${n} se puso el equipo al hombro. ASÍ SÍ`,
      ],
      bueno: [
        (n) => `Bueno bueno, apareció ${n}. Ahora sostenelo que aquí se olvida rápido`,
      ],
      normal: [
        (n) => `${n} ni fu ni fa. Tampoco le voy a pegar hoy`,
      ],
      flojo: [
        (n) => `Qué le pasa a ${n} ombe, anda pesado. Despierta hermano 😤`,
      ],
      malo: [
        (n) => `A vaina el mojón este de ${n}. Si no es contra un grande entonces no quiere jugar y tal`,
        (n, r) => `${r} sacó ${n}. ${r}. Y después se preguntan por qué el Romelio está vacío 🤡`,
      ],
      catastrofe: [
        (n) => `Este semestre no hay es una monda mi Juniorismo. Que ${n} vaya a pelar verga 🤬`,
        (n) => `NO CORRIÓ UNA. NI UNA. Devuelve la camiseta ${n} que hay pelaos en la cantera muriéndose por jugar`,
      ],
    },
  },
  {
    // El hincha veterano que defiende al club y le pega a la propia hinchada (@juniorlpr1924).
    author: 'JuniorLPR1924',
    role: 'Hincha Histórico',
    avatar: '🦈',
    frases: {
      brillante: [
        (n) => `Y eso que a ${n} lo querían quemar hace dos fechas. Esta hinchada exige como si fuera socia del equipo, pero cuando aparece uno así todos aplauden.`,
      ],
      bueno: [
        (n) => `Buen partido de ${n}. Ojo, aquí no debe haber conformismo con nada, pero hay que reconocer cuando se hacen las cosas bien.`,
      ],
      normal: [
        (n) => `${n} cumplió. Ni más ni menos. Aquí critican a todos y la solución siempre es el que se fue o el que no juega.`,
      ],
      flojo: [
        (n) => `A ${n} le está faltando. Hay que apretar señores, hinchada y cuerpo técnico. No entraré en locuras pero hay que decirlo.`,
      ],
      malo: [
        (n) => `Mucha rabia y estrés estamos cogiendo a diario. Lo de ${n} no ayuda, pero el problema es más profundo que un solo jugador.`,
      ],
      catastrofe: [
        (n) => `Quiero defender al club y seguir motivando a la gente, pero así no se puede. ${n} debe cambiar la cara YA. Somos los dueños de Colombia hace un año, no lo olviden.`,
      ],
    },
  },
  {
    // La cuenta de datos: números fríos, gráficos, "los datos son los datos" (@sudanalytics_).
    // Datos con emoji y bandera al frente, en mayúsculas, y goles evaluados con nota decimal.
    author: 'SudAnalytics',
    role: 'Datos y Estadística',
    avatar: '📊',
    frases: {
      brillante: [
        (n, r, g) => `🔥🇨🇴 ${n.toUpperCase()}: ${r} DE CALIFICACIÓN${g > 0 ? ` Y ${g} GOL${g > 1 ? 'ES' : ''}` : ''}. Los números no mienten. 📈`,
        (n, r, g) => g > 0 ? `🤯 ¿EL GOL DE ${n.toUpperCase()}? ${(6 + Math.min(3.5, g * 1.6)).toFixed(2)}. De lo mejor de la fecha. 🇨🇴` : `🤯 ${n.toUpperCase()} FUE LA FIGURA. ${r} de calificación, el más alto de la cancha. 🇨🇴`,
      ],
      bueno: [
        (n) => `📊 Sin hacer ruido, ${n} viene siendo de lo más regular del equipo. El dato que nadie está mirando.`,
      ],
      normal: [
        (n, r) => `🇨🇴 ${n}: ${r} de calificación. Partido correcto, sin sobresaltos.`,
      ],
      flojo: [
        (n) => `⚠️ Alerta con ${n}: viene en caída. Los números del último mes preocupan 📉`,
      ],
      malo: [
        (n, r) => `📉 ${n} promedió ${r} hoy. De los más bajos de la cancha. Los datos son crudos pero son los datos.`,
      ],
      catastrofe: [
        (n, r) => `📉🔻 ${r}. El partido de ${n} es de los peores que registramos esta temporada. Sin vueltas.`,
      ],
    },
  },
  {
    // Titular en mayúsculas y pregunta irónica al jugador: "JUEGUE, 10:", "¿NO HAY ESPACIO, LEA?"
    author: 'SportsCenter',
    role: 'Programa Deportivo',
    avatar: '🅴',
    frases: {
      brillante: [
        (n) => `JUEGUE, ${n.split(' ')[0].toUpperCase()}: exhibición del volante en una noche para enmarcar.`,
      ],
      bueno: [
        (n) => `APARECIÓ CUANDO MÁS SE LO NECESITABA: buen partido de ${n} en el medio.`,
      ],
      normal: [
        (n) => `${n.toUpperCase()} CUMPLIÓ: sin brillar, el volante completó los 90 minutos.`,
      ],
      flojo: [
        (n) => `¿DÓNDE ESTUVO, ${n.split(' ')[0].toUpperCase()}? El volante no pesó en el juego y su equipo lo sintió.`,
      ],
      malo: [
        (n, r) => `NOCHE PARA EL OLVIDO: ${r} de calificación para ${n}, uno de los puntos bajos del equipo.`,
      ],
      catastrofe: [
        (n) => `¿QUÉ PASÓ, ${n.split(' ')[0].toUpperCase()}? El volante fue el peor de la cancha y el técnico ya lo tiene en la mira.`,
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
    // El agregador: TODO EN MAYÚSCULAS, banderita adelante, "Vía @fulano" al final.
    author: 'AtaqueFutbolero',
    role: 'Medio Digital',
    avatar: '⚔️',
    frases: {
      brillante: [
        (n) => `🔥🇨🇴 NOCHE DE GALA DE ${n.toUpperCase()}. LA FIGURA ABSOLUTA DE LA CANCHA. ‼️`,
        (n) => `🤯🇨🇴 PREGUNTAN POR ${n.toUpperCase()} DESDE EL EXTERIOR TRAS SU ACTUACIÓN DE HOY. 💰 Vía @mercadoenvivo.`,
      ],
      bueno: [
        (n) => `⚡🇨🇴 OTRA BUENA ACTUACIÓN DE ${n.toUpperCase()}. ¿Está listo para dar el salto a un grande?`,
      ],
      normal: [
        (n) => `🇨🇴 ${n.toUpperCase()} COMPLETÓ LOS 90'. Sin sobresaltos en su rendimiento.`,
      ],
      flojo: [
        (n) => `⚠️🇨🇴 LAS REDES LE PEGAN A ${n.toUpperCase()} TRAS OTRA ACTUACIÓN DESLUCIDA. ¿Merece seguir de titular?`,
      ],
      malo: [
        (n) => `⛔️🇨🇴 EXPLOTÓ LA HINCHADA CONTRA ${n.toUpperCase()}. "Que se vaya" fue tendencia todo el segundo tiempo. ‼️`,
      ],
      catastrofe: [
        (n) => `🚨🇨🇴 LAPIDARIO: LA HINCHADA DESTROZÓ A ${n.toUpperCase()} EN REDES. Lo más suave que le dijeron fue "vendé la camiseta". ‼️`,
      ],
    },
  },
  {
    // Sarcasmo con emoji derretido y el "¡AY, BICAMPEÓN…🫠!" de @ToqueSports.
    author: 'ToqueSports',
    role: 'Medio Digital',
    avatar: '📣',
    frases: {
      brillante: [
        (n) => `🔥 Uff, LO DE ${n.toUpperCase()} HOY… 🤯 Qué partidazo del pelao.`,
      ],
      bueno: [
        (n) => `👏 Buen partido de ${n}. De a poco se va ganando el puesto.`,
      ],
      normal: [
        (n) => `🗣️ "Tenemos que seguir trabajando" ⚽️ La palabra de ${n} tras el partido.`,
      ],
      flojo: [
        (n) => `¡AY, ${n.toUpperCase()}…🫠! Otra fecha en la que se lo esperaba y no apareció.`,
      ],
      malo: [
        (n) => `¡DESCONTENTO😡❌! La molestia de los aficionados con ${n} tras el partido.`,
      ],
      catastrofe: [
        (n) => `“NO ESTAMOS PASANDO UN MOMENTO FÁCIL” ‼️ 🗣️ ${n} tras la debacle. Y la hinchada no perdona.`,
      ],
    },
  },
  {
    // El periodista de zona mixta: comillas, 🗣️ adelante, tono informativo (@HablaDeportes).
    author: 'HablaDeportes',
    role: 'Periodismo Deportivo',
    avatar: '🎧',
    frases: {
      brillante: [
        (n) => `🗣️ "Trabajamos para esto, el equipo lo merecía". 🎙️ ${n} en zona mixta tras su actuación consagratoria.`,
      ],
      bueno: [
        (n) => `🗣️ "Confiamos en este equipo, sabemos lo que tenemos". 👉 ${n} en zona mixta.`,
      ],
      normal: [
        (n) => `🎙️ ${n} sobre el momento del equipo: "Hay que seguir trabajando puertas adentro".`,
      ],
      flojo: [
        (n) => `❌ ${n} volvió a dejar dudas. ¿Qué le está faltando? Análisis, reacciones y debate. 🔴⚪`,
      ],
      malo: [
        (n) => `🗣️ "Tenemos que solucionar lo que no estamos haciendo bien puertas adentro". 🎙️ ${n} tras la derrota.`,
      ],
      catastrofe: [
        (n) => `❌ Otra vez ${n} desaparecido. El bicampeón hace agua y la hinchada ya perdió la paciencia. ¿Hasta cuándo? 🔴⚪`,
      ],
    },
  },
  {
    // Canal que analiza en vivo: "debacle", "¿mejorará?" (@cuidsports).
    author: 'CuidSports',
    role: 'Canal Deportivo',
    avatar: '📹',
    frases: {
      brillante: [
        (n) => `😍 ¡Lo que provoca ${n} en la hinchada! ⚽️ Analizamos EN VIVO el partidazo del pelao ✅ Video completo en el canal`,
      ],
      bueno: [
        (n) => `🎙️ "El equipo está creciendo" ⚽️ El análisis de ${n} tras el partido ✅ Video completo en el canal`,
      ],
      normal: [
        (n) => `🎙️ "El otro equipo también se prepara" ⚽️ La palabra de ${n} ✅ Video completo en el canal`,
      ],
      flojo: [
        (n) => `😳 ¿Qué pasa con ${n}? ⚽️ Analizamos EN VIVO el flojo momento del volante`,
      ],
      malo: [
        (n) => `❌ ¡Nueva derrota! ⚽️ Analizamos EN VIVO la debacle y el bajo nivel de ${n}… ¿Mejorará el Bicampeón?`,
      ],
      catastrofe: [
        (n) => `😳 Lo que provoca ${n} en la hinchada ❌ La discusión de dos aficionados al término del partido ✅ Video completo en el canal`,
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
        (n) => `el proyecto: no vas a ganar un duelo pero vas a cobrar la prima igual ok? — ${n}`,
      ],
      flojo: [
        (n) => `${n} tocando la pelota hoy 🫠 hermano se te va la vida`,
        (n) => `lo que el técnico le pidió a ${n}: llegar al área\nlo que ${n} entendió: llegar al kiosco`,
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
