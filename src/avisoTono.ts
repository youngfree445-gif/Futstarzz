// De qué habla un aviso, deducido del emoji con el que fue escrito.
//
// EL PROBLEMA QUE RESUELVE. Los 172 avisos del juego arrancaban con un emoji -- "⚠ Sanción",
// "🏆 CAMPEÓN", "📉 Tu valor de mercado cayó" -- y el toast los mostraba como texto plano con el
// emoji adentro. Es el patrón que más delata una interfaz generada: emoji como marcador, repetido
// en todos lados, haciendo el trabajo que le corresponde a un ícono y a un color.
//
// Pero el emoji SÍ llevaba información: ⚠ no es lo mismo que 🏆. Borrarlo a secas hubiera dejado
// 172 avisos idénticos y grises.
//
// Así que se traduce: el emoji entra, y salen un TONO y un TÍTULO que el toast dibuja con un ícono
// de verdad y un color. Se hace en un solo lugar y no en los 172 llamados -- que además es la única
// forma de no olvidarse ninguno.

export type TonoDeAviso = 'titulo' | 'exito' | 'alerta' | 'malo' | 'prensa' | 'medico' | 'mercado' | 'agenda' | 'info';

export interface AvisoInterpretado {
  tono: TonoDeAviso;
  /** El rótulo de la barra del toast. "Fut Starzz" era el mismo para todo. */
  titulo: string;
  /** El mensaje sin emojis. */
  texto: string;
}

// Cada emoji al tono que representa. El orden no importa: se busca el primero que aparezca.
const POR_EMOJI: [RegExp, TonoDeAviso, string][] = [
  [/[🏆🥇👑]/u, 'titulo', 'Título'],
  [/[✅✨🎉💪⭐🌟🔥]/u, 'exito', 'Buenas noticias'],
  [/[⚠️😬🟡⏳]/u, 'alerta', 'Atención'],
  [/[🚫❌📉🔴💔😞]/u, 'malo', 'Mala noticia'],
  [/[📰🎤🗞️📢]/u, 'prensa', 'Prensa'],
  [/[🩹🏥🤕💊]/u, 'medico', 'Parte médico'],
  [/[💰💵💸🔁🔄🤝]/u, 'mercado', 'Mercado'],
  [/[📅🗓️⏰]/u, 'agenda', 'Calendario'],
  [/[📋📊📈🌎⚽🏠🔍🐐]/u, 'info', 'Fut Starzz'],
];

// Todo lo que se considera emoji para limpiar el texto. Incluye los selectores de variación, que
// quedan sueltos y se ven como un cuadrado vacío si se borra sólo el símbolo.
const TODOS_LOS_EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

export function interpretarAviso(mensaje: string): AvisoInterpretado {
  let tono: TonoDeAviso = 'info';
  let titulo = 'Fut Starzz';
  for (const [re, t, nombre] of POR_EMOJI) {
    if (re.test(mensaje)) { tono = t; titulo = nombre; break; }
  }
  // Se limpia el texto y de paso los espacios dobles que deja el emoji al salir.
  const texto = mensaje.replace(TODOS_LOS_EMOJI, '').replace(/[ \t]{2,}/g, ' ').replace(/^\s+/gm, '').trim();
  return { tono, titulo, texto };
}
