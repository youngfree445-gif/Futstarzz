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

  // --- Tanda ampliada de voces -----------------------------------------------------------------
  //
  // El feed se sentia chico: con pocas voces, a las tres o cuatro fechas ya habias leido a todos y
  // el efecto de "esto esta vivo" se apagaba. Estas suman periodismo de Espana, Mexico, Argentina y
  // Colombia, mas cuentas de hinchada, que son las que le dan temperatura.
  //
  // Cada voz tiene un REGISTRO propio y sostenido: el analista habla de datos, el polemista busca la
  // pelea, el relator exagera, el hincha insulta o idolatra. Si todas hablaran igual, sumar nombres
  // no serviria de nada -- se notaria que es la misma frase con distinta foto.
  {
    author: 'Josep Pedrerol', role: 'Presentador', avatar: '🎤',
    frases: {
      brillante: [(n: string, r: string) => `¡${n}! Sencillamente ${n}. ${r} de nota y una actuación para verla otra vez. Hoy no se discute.`],
      bueno: [(n: string, r: string) => `${n} cumplió. ${r}. Ni excelente ni malo: el partido serio que se le pide.`],
      normal: [(n: string) => `Vamos a hablar de ${n}, porque hay opiniones para todos los gustos y aquí se dicen todas.`],
      malo: [(n: string, r: string) => `${r} de ${n}. Y lo digo claro: así no. Al jugador se le exige por lo que puede dar, no por lo que dio hoy.`],
    },
  },
  {
    author: 'Manolo Lama', role: 'Narrador', avatar: '📻',
    frases: {
      brillante: [(n: string, _r: string, g: number) => `¡QUÉ BARBARIDAD LO DE ${n.toUpperCase()}! ${g > 0 ? `${g} goles` : 'Un partidazo'} y el estadio de pie. ¡Qué manera de jugar al fútbol!`],
      bueno: [(n: string) => `Buen partido de ${n}. Discreto en el arranque, creciendo con los minutos. Me gustó.`],
      normal: [(n: string) => `${n} entró en zona de decisiones. Ahí se ven los jugadores.`],
      malo: [(n: string) => `Flojo ${n} hoy. Le faltó chispa y se le notó desde el primer balón.`],
    },
  },
  {
    author: 'Axel Torres', role: 'Analista táctico', avatar: '🧩',
    frases: {
      brillante: [(n: string) => `Más allá de los números: ${n} entendió el partido antes que nadie. Se movió donde el rival no llegaba y ahí se rompió el equilibrio.`],
      bueno: [(n: string) => `${n} sostuvo la estructura del equipo. No sale en el resumen, pero sin eso el partido es otro.`],
      normal: [(n: string) => `Interesante el rol que le están dando a ${n}. Más cerca del balón que hace unos meses.`],
      malo: [(n: string) => `${n} quedó desconectado de las líneas. Cuando el balón le llegó, ya era tarde.`],
    },
  },
  {
    author: 'David Faitelson', role: 'Comentarista', avatar: '🎯',
    frases: {
      brillante: [(n: string, r: string) => `Hay que decirlo: ${n} fue el mejor del campo con ${r}. Y no lo digo por simpatía, lo digo porque los números están ahí.`],
      bueno: [(n: string) => `${n} hizo lo suyo. Correcto. Pero de un jugador de su nivel se espera que decida partidos, no que los acompañe.`],
      normal: [(n: string) => `La pregunta con ${n} no es si tiene talento. Es si tiene la cabeza para sostenerlo una temporada entera.`],
      malo: [(n: string, r: string) => `${r}. Insisto en lo que vengo diciendo: a ${n} le está quedando grande el escenario. Ojalá me equivoque.`],
    },
  },
  {
    author: 'Christian Martinoli', role: 'Narrador', avatar: '🗣️',
    frases: {
      brillante: [(n: string, _r: string, g: number) => `¡${n.toUpperCase()}, HERMANO! ${g > 0 ? `¡${g}!` : '¡Qué partido!'} Los que dudaban que se acomoden, que hoy no hay discusión.`],
      bueno: [(n: string) => `Bien ${n}. Sin fuegos artificiales, pero bien. Y a veces eso es exactamente lo que hace falta.`],
      normal: [(n: string) => `A ${n} lo miran todos. El que juega bien tiene ese problema: ya no lo dejan esconderse.`],
      malo: [(n: string) => `Mal día de ${n}. Le pasó por encima el partido. Se levanta y ya, tampoco es el fin del mundo.`],
    },
  },
  {
    author: 'Martín Arévalo', role: 'Periodista', avatar: '📰',
    frases: {
      brillante: [(n: string, r: string) => `${r} de ${n}. Con ese partido, en el vestuario se acomodan solos los liderazgos.`],
      bueno: [(n: string) => `${n} suma. Y en una temporada larga, sumar todas las semanas vale más que un partidazo suelto.`],
      normal: [(n: string) => `Ojo con ${n}, que viene con ritmo. En el mercado ya preguntaron.`],
      malo: [(n: string) => `A ${n} le tocó una noche fea. Lo que importa es qué hace el sábado que viene.`],
    },
  },
  {
    author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
    frases: {
      brillante: [(n: string) => `Lo de ${n} no fue solo la nota alta: fue cómo se hizo cargo del partido cuando el equipo no encontraba salida.`],
      bueno: [(n: string) => `Buen rendimiento de ${n}. Sostenido, que es lo difícil.`],
      normal: [(n: string) => `${n} viene mejorando en un detalle que casi nadie mira: el primer control de cara al arco.`],
      malo: [(n: string) => `No fue el partido de ${n}. Le costó entrar en juego y el equipo lo sintió.`],
    },
  },
  {
    author: 'Juan Pablo Varsky', role: 'Periodista', avatar: '🖋️',
    frases: {
      brillante: [(n: string, r: string) => `${n}, ${r}. Uno de esos partidos que se recuerdan sin necesidad de mirar la estadística.`],
      bueno: [(n: string) => `Correcto ${n}. La regularidad también es una virtud, aunque no genere titulares.`],
      normal: [(n: string) => `${n} está en ese momento donde cada partido puede cambiarle la carrera. Interesante de seguir.`],
      malo: [(n: string) => `Partido para el olvido de ${n}. Pasa. Lo que no puede pasar es que se repita.`],
    },
  },
  {
    author: 'César Augusto Londoño', role: 'Periodista', avatar: '📡',
    frases: {
      brillante: [(n: string, r: string) => `${r} para ${n}. Actuación de las que no se ven todos los domingos en nuestro fútbol.`],
      bueno: [(n: string) => `${n} cumplió con lo que se le pidió. Ni más ni menos.`],
      normal: [(n: string) => `El tema con ${n} es la continuidad. El talento nunca estuvo en discusión.`],
      malo: [(n: string) => `Muy flojo ${n}. Y cuando un jugador de sus condiciones juega así, la pregunta es qué está pasando afuera de la cancha.`],
    },
  },
  {
    author: 'Faustino Asprilla', role: 'Ex jugador', avatar: '⚡',
    frases: {
      brillante: [(n: string) => `¡Eso es fútbol, mijo! ${n} jugó como se juega: sin miedo. Así me gusta.`],
      bueno: [(n: string) => `Bien ${n}, pero le falta atrevimiento. Cuando se suelte, van a ver otra cosa.`],
      normal: [(n: string) => `A ${n} hay que dejarlo jugar tranquilo. Encima le exigen como si tuviera treinta años.`],
      malo: [(n: string) => `Uy no, ${n} hoy no apareció. Pero tranquilo que esto es fútbol, la semana que viene se arregla.`],
    },
  },
  {
    author: 'Fernando Palomo', role: 'Narrador', avatar: '🌎',
    frases: {
      brillante: [(n: string, _r: string, g: number) => `${n} firmó una noche enorme${g > 0 ? ` con ${g} en el marcador` : ''}. De esas que cruzan fronteras.`],
      bueno: [(n: string) => `Sólido ${n}. En un continente que mira, eso cuenta.`],
      normal: [(n: string) => `${n} empieza a aparecer en conversaciones que hace un año no lo incluían.`],
      malo: [(n: string) => `Noche difícil para ${n}. El fútbol da revanchas rápido.`],
    },
  },
  {
    author: 'Gastón Recondo', role: 'Periodista', avatar: '🎧',
    frases: {
      brillante: [(n: string, r: string) => `${r} de ${n}. Y ojo, que esto no es de un día: viene sosteniéndolo.`],
      bueno: [(n: string) => `${n} está para más, pero está. Eso ya es bastante.`],
      normal: [(n: string) => `Con ${n} pasa algo curioso: rinde mejor cuando el equipo la pasa mal.`],
      malo: [(n: string) => `${n} no estuvo. Y el equipo lo pagó.`],
    },
  },
  {
    author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
    frases: {
      brillante: [(n: string, _r: string, g: number) => `${n} ${g > 0 ? `METIÓ ${g} Y` : ''} SE CARGÓ EL EQUIPO AL HOMBRO. NO SE DISCUTE MÁS 🔥🔥🔥`],
      bueno: [(n: string) => `${n} cumplió. Ahora que lo sostenga, que acá se olvidan rápido.`],
      normal: [(n: string) => `¿${n} titular indiscutido? Los comentarios están divididos y eso ya dice algo.`],
      malo: [(n: string) => `${n} otra vez desaparecido. Así no, hermano. ASÍ NO 😤`],
    },
  },
  {
    author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
    frases: {
      brillante: [(n: string) => `Hoy salimos del estadio hablando de una sola cosa: ${n}. Qué manera de jugar.`],
      bueno: [(n: string) => `${n} correcto. Pero venimos de tres partidos correctos y necesitamos uno brillante.`],
      normal: [(n: string) => `Debate en la tribuna: ¿${n} es el jugador que necesitamos o el que nos conformó?`],
      malo: [(n: string) => `Con todo respeto: ${n} no puede jugar así con esta camiseta. Se exige mucho más.`],
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

/**
 * La carrera por el Balón de Oro, contada en el feed.
 *
 * El ranking mundial ya se mueve cada fecha (ver worldRanking.ts), pero un ranking que cambia y del
 * que nadie habla es una tabla más. Lo que hace que el premio se sienta como una carrera es que la
 * prensa lo discuta MIENTRAS pasa: quién subió, quién se cayó, quién es favorito.
 *
 * El texto depende del puesto del jugador, y ahí está la gracia: fuera del top 20 la prensa ni te
 * nombra -- habla del favorito y de la pelea de arriba, como en la vida real. Recién cuando entrás
 * al top 10 empiezan a mencionarte, y en el podio se vuelve el tema central.
 */
export function postsDelBalonDeOro(
  nombreJugador: string,
  puesto: number | null,
  lider: string,
  clubLider: string,
  segundo: string,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  // Mismo barajado estable que el resto del archivo: el feed no puede cambiar solo con mirarlo dos
  // veces, pero sí tiene que ser distinto la semana siguiente.
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 7) * 51.29 + i * 17.3) * 43758.5453;
    return x - Math.floor(x);
  };

  const generales = [
    { author: 'Balón de Oro', role: 'Cuenta oficial', avatar: '🏅',
      content: `Actualización de la carrera: ${lider} (${clubLider}) sigue al frente, con ${segundo} pisándole los talones. Faltan fechas y esto se define en la recta final.` },
    { author: 'Marcos Beltrán', role: 'Periodista internacional', avatar: '🎙️',
      content: `Si la votación fuera hoy, ${lider} se lo lleva. Pero el premio lo definen las noches grandes: Champions y Mundial pesan más que veinte goles en una liga menor.` },
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `La pelea por el Balón de Oro está en tres puntos entre ${lider} y ${segundo}. Un partido cambia el orden.` },
  ];

  const conJugador = puesto === null || puesto > 20 ? [] : puesto <= 3 ? [
    { author: 'Balón de Oro', role: 'Cuenta oficial', avatar: '🏅',
      content: `${nombreJugador} está ${puesto}º en la carrera por el Balón de Oro. Ya no es una sorpresa: es un candidato.` },
    { author: 'Marcos Beltrán', role: 'Periodista internacional', avatar: '🎙️',
      content: `Lo digo sin vueltas: si ${nombreJugador} sostiene este nivel hasta fin de año, se lo tienen que dar. ${puesto}º y subiendo.` },
    { author: 'La Tribuna', role: 'Hinchada', avatar: '📣',
      content: `¡${puesto}º DEL MUNDO! Que se preparen los europeos, que este año el premio se viene para acá 🔥` },
  ] : puesto <= 10 ? [
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${nombreJugador} escaló al ${puesto}º puesto del ranking mundial. A este ritmo entra en la conversación del Balón de Oro.` },
    { author: 'Marcos Beltrán', role: 'Periodista internacional', avatar: '🎙️',
      content: `${nombreJugador} ${puesto}º. Todavía lejos de ${lider}, pero ya nadie puede decir que no está entre los mejores del mundo.` },
  ] : [
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${nombreJugador} aparece ${puesto}º en el ranking mundial. El top 10 está a tiro si sostiene el semestre.` },
  ];

  return [...conJugador, ...generales]
    .map((p, i) => ({ p, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .map(x => x.p)
    .slice(0, 2);
}

/**
 * Reacciones a lo que respondiste en la rueda de prensa.
 *
 * Antes la conferencia era un trámite silencioso: elegías una respuesta, se movían prestigio y
 * afición, y no pasaba nada más. Los números cambiaban pero el mundo no se enteraba.
 *
 * Esto la convierte en un hecho público. La respuesta se publica como si fuera un recorte de la
 * conferencia, y abajo aparecen los comentarios: te bancan, te exigen, o te destrozan. Es la parte
 * del juego donde una decisión de una línea se siente como algo que dijiste de verdad.
 *
 * El tono lo decide el saldo de la respuesta -- lo mismo que ya movía prestigio y afición --, así
 * que no hay que inventar una segunda regla: si la respuesta fue valiente y gustó, los comentarios
 * lo reflejan; si fue tibia o desafortunada, también.
 */
export function comentariosDeRuedaDePrensa(
  nombre: string,
  saldo: number,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 3) * 71.7 + i * 23.9) * 43758.5453;
    return x - Math.floor(x);
  };

  const buenos = [
    { author: 'Eduardo Luis', role: 'Narrador', avatar: '🎙️',
      content: `Así se habla. ${nombre} dijo lo que muchos piensan y pocos se animan a decir frente a un micrófono.` },
    { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎤',
      content: `Me gustó la respuesta de ${nombre}. Clara, sin escaparle a la pregunta. Eso también es jugar bien.` },
    { author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
      content: `¡ESE ES NUESTRO JUGADOR! ${nombre} habla como capitán aunque no tenga la cinta 💪` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Lo de ${nombre} en conferencia estuvo a la altura. La hinchada quiere jugadores que den la cara.` },
    { author: 'Juan Pablo Varsky', role: 'Periodista', avatar: '🖋️',
      content: `Buena respuesta de ${nombre}. Sin frases hechas, que en este ambiente ya es una rareza.` },
  ];

  const tibios = [
    { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
      content: `Respuesta de manual la de ${nombre}. No dijo nada. Pero bueno, tampoco se metió en problemas.` },
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${nombre} eligió el camino seguro en conferencia. Correcto, aunque no mueve la aguja.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `¿Y eso qué fue? ${nombre} habló tres minutos para no decir nada. En la cancha te queremos ver.` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Palabras lindas de ${nombre}, ahora hay que respaldarlas el domingo. Acá se cobra rápido.` },
  ];

  const malos = [
    { author: 'David Faitelson', role: 'Comentarista', avatar: '🎯',
      content: `Desafortunado ${nombre}. Cuando no se sabe qué decir, lo mejor es no decir nada. Esto le va a rebotar.` },
    { author: 'Josep Pedrerol', role: 'Presentador', avatar: '🎤',
      content: `¿Ustedes escucharon lo de ${nombre}? Porque yo sí, y no me gustó nada. Nada.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `${nombre} hablando de más otra vez. Primero rendí, después opiná. ASÍ DE SIMPLE 🤬` },
    { author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
      content: `Muy mal ${nombre}. Con esta camiseta se responde en la cancha, no en una sala de prensa.` },
    { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
      content: `Lo de ${nombre} fue un error. Y los errores fuera de la cancha se pagan igual que los de adentro.` },
  ];

  // El umbral es +-3 y no 0: una respuesta que mueve un punto para arriba o para abajo no merece ni
  // una ovacion ni una condena. La mayoria de las respuestas del juego caen en esa franja tibia, que
  // es justamente donde el feed tiene que sonar exigente y no complaciente.
  const grupo = saldo >= 3 ? buenos : saldo <= -3 ? malos : tibios;
  return grupo
    .map((c, i) => ({ c, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 3)
    .map(x => x.c);
}

/**
 * Lo que dice la prensa cuando te ELIMINAN de una copa.
 *
 * Hasta ahora el feed sólo miraba tu calificación individual: podías jugar un 7 y quedar afuera de
 * la Superliga, y la prensa te felicitaba por el buen partido mientras el club se quedaba sin
 * torneo. Reportado: "quedé eliminado y me alaban mucho, tengo que sentir la presión de haber
 * perdido".
 *
 * Y es cierto que así funciona el fútbol: cuando el equipo queda afuera, la nota individual no
 * salva a nadie. Estos posts pisan al resto porque son la noticia del día.
 */
export function postsDeEliminacion(
  nombre: string,
  competicion: string,
  club: string,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 11) * 33.71 + i * 19.3) * 43758.5453;
    return x - Math.floor(x);
  };

  const voces = [
    { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
      content: `Afuera de la ${competicion}. Y que nadie venga a hablar de rendimientos individuales: el equipo fracasó y punto.` },
    { author: 'David Faitelson', role: 'Comentarista', avatar: '🎯',
      content: `${club} eliminado. A ${nombre} le van a preguntar por esto en cada rueda de prensa hasta que gane algo.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `ELIMINADOS OTRA VEZ 🤬 ${nombre}, la camiseta pesa. Si no podés con eso, andate.` },
    { author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
      content: `Se acabó la ${competicion} para ${club}. Un año más sin nada. La paciencia se terminó.` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Duele. ${club} afuera y con la sensación de que faltó algo. A ${nombre} le queda demostrar que puede cargar con esto.` },
    { author: 'Marcos Beltrán', role: 'Periodista internacional', avatar: '🎙️',
      content: `Quedar eliminado no arruina una carrera, pero la marca. ${nombre} tiene que responder ya, en el próximo partido.` },
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${club} queda fuera de la ${competicion}. Es la clase de golpe que se mide en las tres fechas siguientes, no hoy.` },
  ];

  return voces
    .map((v, i) => ({ v, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 3)
    .map(x => x.v);
}

/**
 * Lo que PODÉS publicar vos después de un partido.
 *
 * Hasta ahora el feed era de una sola vía: te hablaba y no había forma de contestar. Esto lo cierra.
 *
 * Son opciones escritas y no un campo de texto libre, y es a propósito: un texto libre no se puede
 * evaluar -- no hay forma de saber si lo que escribiste fue humilde, soberbio o provocador -- así que
 * no podría tener consecuencias, y una publicación sin consecuencias es un adorno.
 *
 * NINGUNA ES GRATIS, que es lo que hace que la decisión valga: picantear da hinchada y enfría al
 * técnico; hacerte cargo da respeto y baja el ánimo; callarte no cuesta nada y tampoco suma.
 */
export interface OpcionDePublicacion {
  id: string;
  texto: string;
  /** Lo que mueve: hinchada, prestigio, relación con el DT y ánimo. */
  fans: number;
  prestigio: number;
  dt: number;
  animo: number;
}

export function publicacionesDisponibles(gano: boolean, rival: string): OpcionDePublicacion[] {
  if (gano) {
    return [
      { id: 'hinchada', texto: `Esto es de ustedes. Se siente distinto cuando la gente empuja así. 🔴⚪`,
        fans: 8, prestigio: 1, dt: 1, animo: 3 },
      { id: 'humilde', texto: `Tres puntos y a seguir. Queda mucho y no ganamos nada todavía.`,
        fans: 2, prestigio: 4, dt: 4, animo: 1 },
      { id: 'rival', texto: `Partido durísimo. Respeto para ${rival}, que lo hizo muy difícil.`,
        fans: 1, prestigio: 6, dt: 3, animo: 1 },
      { id: 'picante', texto: `Hablaban mucho durante la semana. En la cancha se vio otra cosa. 😏`,
        fans: 12, prestigio: -2, dt: -5, animo: 4 },
    ];
  }
  return [
    { id: 'cargo', texto: `Me hago cargo. Hoy no estuve a la altura y lo sé.`,
      fans: 5, prestigio: 5, dt: 5, animo: -4 },
    { id: 'equipo', texto: `Nos faltó a todos. Esto se corrige entre todos, no señalando a uno.`,
      fans: 2, prestigio: 2, dt: 3, animo: 0 },
    { id: 'excusa', texto: `Hay cosas que no dependen de nosotros. Prefiero no hablar del arbitraje.`,
      fans: -4, prestigio: -6, dt: -3, animo: 2 },
    { id: 'silencio', texto: `Sin declaraciones. A trabajar.`,
      fans: 0, prestigio: 0, dt: 1, animo: 0 },
  ];
}

/**
 * Cómo le responde el feed a lo que publicaste.
 *
 * Mismo mecanismo que la rueda de prensa: el tono sale del SALDO de la opción elegida, así que no hay
 * una segunda regla que pueda contradecir a la primera.
 */
export function respuestasAMiPublicacion(
  nombre: string,
  saldo: number,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 13) * 41.3 + i * 27.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const buenas = [
    { author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
      content: `Por esto lo queremos a ${nombre}. Habla de frente y le pone el pecho a todo 💪` },
    { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
      content: `Buen mensaje el de ${nombre}. Cuesta encontrar jugadores que digan algo así después de un partido.` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `${nombre} entendió de qué se trata esto. La hinchada no olvida a los que dan la cara.` },
  ];

  const polemicas = [
    { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
      content: `A ${nombre} le encanta el micrófono. Ojalá le guste igual la marca en el segundo tiempo.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `${nombre} calentando la previa 🔥 Ahora banca lo que dijiste el domingo, eh.` },
    { author: 'David Faitelson', role: 'Comentarista', avatar: '🎯',
      content: `Innecesario lo de ${nombre}. Le acaba de dar al rival justo lo que le hacía falta.` },
  ];

  const tibias = [
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${nombre} publicó y no dijo nada. Cero riesgo, cero rédito.` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Palabras justas de ${nombre}. Ahora que hable la cancha.` },
  ];

  const grupo = saldo >= 6 ? buenas : saldo <= -4 ? polemicas : tibias;
  return grupo
    .map((c, i) => ({ c, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 2)
    .map(x => x.c);
}

/**
 * La prensa anuncia el refuerzo que llega para TU puesto.
 *
 * Sin esto el fichaje seria un numero invisible que te manda al banco sin explicacion. El jugador
 * tiene que entender POR QUE de golpe le cuesta ser titular -- si no, se lee como un bug.
 */
export function postsDeRefuerzo(
  nombre: string,
  refuerzo: string,
  posicion: string,
  club: string,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 17) * 61.9 + i * 29.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const voces = [
    { author: 'Martín Arévalo', role: 'Periodista', avatar: '📰',
      content: `Confirmado: ${refuerzo} llega a ${club} para jugar de ${posicion}. Le va a pelear el puesto a ${nombre}.` },
    { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
      content: `${club} refuerza justo la posición de ${nombre}. La competencia interna sube y los minutos ya no están garantizados.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `Bienvenido ${refuerzo} 👏 A ver si ahora ${nombre} se pone las pilas, que venía cómodo.` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Llega ${refuerzo}. Nadie tiene el puesto asegurado en este club, y está bien que sea así.` },
    { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
      content: `Ojo con esto: ${refuerzo} no viene a ser suplente. ${nombre} va a tener que ganarse el lugar cada fin de semana.` },
  ];
  return voces
    .map((v, i) => ({ v, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 2)
    .map(x => x.v);
}

/**
 * LA REHABILITACION: la prensa mientras estas afuera, y cuando volves roto.
 *
 * Una lesion sin voz es una pantalla gris con un numero que baja. Lo que la vuelve un tramo de la
 * carrera es que AFUERA sigan hablando: el club te espera, el DT no dice cuando volves, y si forzas
 * la vuelta hay quien lo aplaude y quien te trata de irresponsable. Las dos cosas a la vez, que es
 * lo que de verdad pasa.
 *
 * `forzando` cambia el tono entero, no una frase: no es lo mismo estar de baja que estar jugando
 * roto. Si fuera el mismo bloque con una linea distinta se notaria que es el mismo texto reciclado.
 */
export function postsDeLesion(
  nombre: string,
  club: string,
  semanasRestantes: number,
  forzando: boolean,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 31) * 53.7 + i * 37.3) * 43758.5453;
    return x - Math.floor(x);
  };
  const voces = forzando
    ? [
        { author: 'Martín Arévalo', role: 'Periodista', avatar: '📰',
          content: `${nombre} se pone la camiseta de ${club} sin estar al 100%. Valiente, sí. Prudente, no.` },
        { author: 'Dr. Fútbol', role: 'Médico deportivo', avatar: '🩺',
          content: `Lo digo con todo respeto: volver con ${semanasRestantes} semana(s) de recuperación pendientes es como jugar a la ruleta rusa con tu propia carrera.` },
        { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
          content: `ESO ES HUEVOS 🔥 ${nombre} sale a la cancha roto porque el club lo necesita. ¡ASÍ SE QUIERE LA CAMISETA!` },
        { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
          content: `Me van a odiar por esto: que ${nombre} juegue lesionado no es heroísmo, es mala gestión. Si se rompe de nuevo, ¿quién responde?` },
        { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
          content: `${nombre} apura los tiempos. Se le va a notar en el ritmo, y hay que ser justos cuando eso pase.` },
        { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
          content: `Adentro del vestuario esto se ve de una sola forma: el tipo se está jugando el físico por el equipo.` },
      ]
    : [
        { author: 'Data Fútbol', role: 'Análisis', avatar: '📊',
          content: `${club} pierde a ${nombre} por ${semanasRestantes} semana(s). No es un detalle: el rendimiento del equipo cambia sin él.` },
        { author: 'Martín Arévalo', role: 'Periodista', avatar: '📰',
          content: `Parte médico de ${club}: ${nombre} sigue en recuperación. No hay fecha confirmada de regreso.` },
        { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
          content: `Otra vez la enfermería 😩 Justo ahora que lo necesitábamos. Recuperate rápido ${nombre}.` },
        { author: 'Dr. Fútbol', role: 'Médico deportivo', avatar: '🩺',
          content: `Consejo gratis para ${nombre}: la recuperación no se negocia. El que vuelve antes, vuelve dos veces.` },
        { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
          content: `Se extraña a ${nombre}. No por lo que hace con la pelota: por lo que ordena sin ella.` },
        { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
          content: `La pregunta que nadie en ${club} quiere contestar: ¿van a esperar a ${nombre} o van a apurarlo?` },
      ];
  return voces
    .map((v, i) => ({ v, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 2)
    .map(x => x.v);
}

/**
 * La previa del CLÁSICO.
 *
 * Un clásico que no se anticipa no es un clásico: la mitad de lo que lo hace especial es la semana
 * previa. Si el partido pesa más pero nadie lo dice, el jugador sólo ve un número raro al final.
 */
export function postsDePreviaDeClasico(
  club: string,
  rival: string,
  semana: number,
): { author: string; role: string; avatar: string; content: string }[] {
  const mezcla = (i: number) => {
    const x = Math.sin((semana + 23) * 47.3 + i * 31.1) * 43758.5453;
    return x - Math.floor(x);
  };
  const voces = [
    { author: 'Liga Oficial', role: 'Organismo Rector', avatar: '🏆',
      content: `🔥 CLÁSICO. ${club} vs ${rival}. El partido que para la ciudad.` },
    { author: 'Carlos Antonio Vélez', role: 'Comentarista', avatar: '📻',
      content: `Se juega el clásico y hay que decirlo: acá no importa cómo se llegue. Importa cómo se sale.` },
    { author: 'PasiónPorElFutbol', role: 'Cuenta de aficionados', avatar: '🔥',
      content: `SEMANA DE CLÁSICO 🔥🔥 No se duerme, no se come, no se piensa en otra cosa. ¡VAMOS ${club.toUpperCase()}!` },
    { author: 'El Vestuario', role: 'Cuenta de aficionados', avatar: '👕',
      content: `Un año entero se aguanta si se gana el clásico. Y un año entero se sufre si se pierde.` },
    { author: 'Morena Beltrán', role: 'Periodista', avatar: '🎙️',
      content: `Los clásicos no los gana el que mejor juega: los gana el que menos se equivoca. Atención a eso frente a ${rival}.` },
    { author: 'hinchafurioso_22', role: 'Aficionado', avatar: '😤',
      content: `Contra ${rival} se deja todo. TODO. El que no lo entienda que se quede en el banco 🤬` },
  ];
  return voces
    .map((v, i) => ({ v, orden: mezcla(i) }))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 3)
    .map(x => x.v);
}
