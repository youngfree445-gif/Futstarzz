// IDIOMA Y ADAPTACIÓN: los primeros meses en un país cuya lengua no hablás.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Pedido: "ir a otro país con un idioma que no hablás baja el rendimiento los primeros meses."
//
// Hasta acá cambiar de club era instantáneo: firmabas en Turquía un jueves y el domingo jugabas
// exactamente igual que en tu barrio. El pase movía plata, prestigio y calendario, y nada más.
//
// ---------------------------------------------------------------------------------------------
// ES PROBABILÍSTICA, POR PEDIDO EXPLÍCITO
// ---------------------------------------------------------------------------------------------
//
// El usuario lo puso como condición sobre las tres últimas de la lista: "que no pasen sí o sí sino
// que haya un porcentaje pequeño de probabilidad que pase".
//
// Así que ir a un país de otro idioma NO garantiza nada. A veces te cuesta y son unos meses duros;
// a veces encajás rápido, que también pasa en la vida real -- y ese "a veces no pasa nada" es lo
// que hace que la primera vez que sí pasa se sienta como algo tuyo y no como una regla del juego.
//
// El dado entra por parámetro, como todas las reglas con azar de esta casa: es lo único que hace
// medible un "cada cuánto pasa". Ya se pagó caro no hacerlo -- ver el ritual, que resultó
// dispararse seis o siete veces por temporada sin que nadie pudiera comprobarlo.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL CASTIGO SE VA SOLO
// ---------------------------------------------------------------------------------------------
//
// Adaptarse no es una decisión: es tiempo. El ajuste arranca fuerte y se va apagando fecha a fecha
// hasta desaparecer, así que el jugador ve el número achicarse y entiende que va saliendo. Un
// castigo plano que se corta de golpe se leería como un bug.
//
// Y el tope es 7, entre la fatiga (6) y jugar lesionado (9), porque es de esa familia: cosas que le
// pasan al cuerpo o a la cabeza y que el partido no puede ignorar. Ver la cadena de ajustes en
// MatchSimulator.

/**
 * Qué se habla en cada liga de la base.
 *
 * Las dos bolsas sin país propio -- 'Internacional' y 'Resto del Mundo' -- quedan afuera a propósito:
 * no se puede nombrar el idioma de una liga que no es de ningún lado.
 *
 * La clave es el valor de `Club.league`, que es EL MISMO que usa `PlayerProfile.nationality`: por
 * eso se pueden cruzar sin una segunda tabla de países. Un país que falte acá se trata como idioma
 * desconocido y no dispara nada, que es la respuesta prudente.
 */
export const IDIOMA_POR_PAIS: Record<string, string> = {
  Colombiana: 'español', Argentina: 'español', Española: 'español', Mexicana: 'español',
  Chilena: 'español', Ecuatoriana: 'español', Uruguaya: 'español', Paraguaya: 'español',
  Boliviana: 'español', Peruana: 'español', Venezolana: 'español',
  Brasileña: 'portugués', Portuguesa: 'portugués',
  Inglesa: 'inglés', Escocesa: 'inglés', Estadounidense: 'inglés',
  Francesa: 'francés',
  Alemana: 'alemán', Austríaca: 'alemán', Suiza: 'alemán',
  Italiana: 'italiano',
  Holandesa: 'neerlandés', Belga: 'neerlandés',
  Turca: 'turco', Sueca: 'sueco', Danesa: 'danés', Noruega: 'noruego',
  Griega: 'griego', Chipriota: 'griego',
  Croata: 'croata', Serbia: 'serbio', Checa: 'checo', Rumana: 'rumano',
  Búlgara: 'búlgaro', Húngara: 'húngaro', Israelí: 'hebreo',
  Kazaja: 'kazajo', Azerí: 'azerí',
};

/** Cuántas veces de cada diez cuesta adaptarse, yendo a un idioma que no hablás. */
export const CHANCE_DE_QUE_CUESTE = 0.35;
/** Cuántas fechas dura, de arranque. Se va apagando en ese plazo. */
export const FECHAS_DE_ADAPTACION = 10;
/** El peor momento del ajuste, en puntos de atributo. Entre la fatiga (6) y jugar lesionado (9). */
export const AJUSTE_MAXIMO_DE_ADAPTACION = 7;

/**
 * ¿Se habla lo mismo en los dos lados?
 *
 * Un país que no está en la tabla devuelve `true`: sin dato, no se inventa una dificultad.
 */
export function mismoIdioma(nacionalidad: string, ligaDestino: string): boolean {
  const mio = IDIOMA_POR_PAIS[nacionalidad];
  const suyo = IDIOMA_POR_PAIS[ligaDestino];
  if (!mio || !suyo) return true;
  return mio === suyo;
}

/**
 * ¿Le cuesta adaptarse a este pase?
 *
 * Si se habla el mismo idioma, nunca. Si no, depende del dado -- que es el pedido del usuario: que
 * no pase sí o sí.
 */
export function cuestaAdaptarse(dado: number, nacionalidad: string, ligaDestino: string): boolean {
  if (mismoIdioma(nacionalidad, ligaDestino)) return false;
  return dado < CHANCE_DE_QUE_CUESTE;
}

/**
 * Cuánto pesa la adaptación en esta fecha, en puntos de atributo.
 *
 * Arranca en el máximo y baja hasta 0 a medida que se acerca el final del plazo. Devuelve un número
 * NEGATIVO, para poder sumarlo igual que el ajuste de forma.
 */
export function ajustePorAdaptacion(fechaActual: number, hastaLaFecha: number): number {
  const faltan = hastaLaFecha - fechaActual;
  if (faltan <= 0) return 0;
  const proporcion = Math.min(1, faltan / FECHAS_DE_ADAPTACION);
  return -Math.round(AJUSTE_MAXIMO_DE_ADAPTACION * proporcion);
}

/** Lo que se le dice al jugador al llegar. */
export function avisoDeAdaptacion(idiomaDelPais: string): string {
  return `🗣️ En el vestuario se habla ${idiomaDelPais} y vos no. Los primeros partidos te van a costar hasta que te acomodes.`;
}

/** Y lo que se le dice cuando ya se adaptó. */
export const AVISO_DE_YA_ME_ADAPTE =
  '🗣️ Ya te entendés con todos adentro de la cancha. La adaptación quedó atrás.';

/** El idioma del país, para poder nombrarlo. Vacío si no está en la tabla. */
export function idiomaDe(liga: string): string {
  return IDIOMA_POR_PAIS[liga] ?? '';
}
