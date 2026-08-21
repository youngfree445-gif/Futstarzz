/**
 * LA CEREMONIA DEL FICHAJE: portada del diario, entrevista obligatoria, hemeroteca.
 *
 *   npm run validar:fichaje
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA, Y POR QUE ESO
 * ---------------------------------------------------------------------------------------------
 *
 * Estas dos pantallas se ven UNA VEZ POR TRASPASO. Osea que un error acá no aparece jugando hasta
 * que alguien acepta una oferta, y ahí tapa la pantalla entera -- son overlays a pantalla completa
 * sin botón de cerrar, porque la entrevista es obligatoria a propósito. Si revientan, la partida
 * queda trabada con el pase ya hecho.
 *
 * Se comprueban tres cosas distintas:
 *
 *   1. QUE SE DIBUJEN, con club con colores y sin colores, con club anterior y sin club anterior.
 *      Los cuatro casos existen de verdad: `themeColor` lo tiene una minoría de los 697 clubes, y
 *      la primera firma de una carrera no tiene club anterior.
 *
 *   2. QUE NO DIGAN "undefined". Es el error clásico de armar un titular con datos que a veces no
 *      están, y en una portada se lee en catorce puntas de tamaño.
 *
 *   3. QUE LA CONEXION CON LA HEMEROTECA PUEDA MORDER. Las respuestas de la entrevista se guardan
 *      con `guardarDeclaracion`, que TIRA las declaraciones flojas (SALDO_PARA_QUEDAR_GUARDADA).
 *      Si ninguna de las nueve respuestas llegara a ese saldo, el archivo no guardaría nunca nada
 *      y la conexión sería decoración. Este caso es el único que no se puede ver mirando la
 *      pantalla.
 *
 * SSR NO CORRE EFECTOS ni clics, así que de la entrevista se dibuja la primera pregunta. Las otras
 * dos son el mismo componente con otro índice; lo que no se puede ver acá -- que al terminar te
 * deje en la pestaña del club -- vive en un `useEffect` del Dashboard y se prueba jugando.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import { PortadaDeFichaje } from '../src/components/PortadaDeFichaje';
import { EntrevistaDeFichaje } from '../src/components/EntrevistaDeFichaje';
import { preguntasDeLaPresentacion, saldoDe } from '../src/entrevistaDeFichaje';
import { guardarDeclaracion, SALDO_PARA_QUEDAR_GUARDADA } from '../src/hemeroteca';
import { ULTIMATE_CLUBS_DATABASE } from '../src/data';
import { crearPerfilInicial } from '../src/components/SetupScreen';

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const nada = () => {};
let fallas = 0;

const caso = (etiqueta, fn) => {
  try {
    fn();
    console.log(`OK    ${etiqueta}`);
  } catch (e) {
    fallas++;
    console.log(`FALLA ${etiqueta} -- ${e.message}`);
  }
};

const clubPorNombre = nombre => {
  const c = ULTIMATE_CLUBS_DATABASE.find(x => x.name === nombre);
  if (!c) throw new Error(`no existe el club ${nombre}`);
  return c;
};

const junior = clubPorNombre('Junior de Barranquilla');
const barcelona = clubPorNombre('FC Barcelona');

// Un club SIN colores de camiseta: la portada tiene que caer al dorado del juego y no a "undefined"
// metido dentro de un degradado, que es un fondo transparente y un titular ilegible.
const sinColores = { ...junior, themeColor: undefined };

const perfil = crearPerfilInicial({
  name: 'Camilo Restrepo', position: 'Mediocampista', age: 25, nationality: 'Colombiana',
  dorsal: 30, heightCm: 191, selectedClubId: junior.id, currentClub: junior,
  defaultAttributes: { ritmo: 55, regate: 60, tiro: 63, defensa: 45, pase: 65, fisico: 50 },
  superstition: 'botin_derecho', injuriesEnabled: true,
  difficultyMode: 'normal', startedAsVeteran: false, starModeEnabled: false,
});

/** Dibuja y devuelve el HTML, exigiendo que diga lo que tiene que decir y nada roto. */
const dibujar = (elemento, esperados) => {
  const html = renderToString(elemento);
  if (html.length < 400) throw new Error(`dibujo casi vacio (${html.length} caracteres)`);
  for (const roto of ['undefined', 'NaN', '[object Object]']) {
    if (html.includes(roto)) throw new Error(`dice "${roto}"`);
  }
  for (const e of esperados) {
    if (!html.includes(e)) throw new Error(`falta "${e}"`);
  }
  return html;
};

// --- LA PORTADA -------------------------------------------------------------------------------

const portada = (club, anterior) => React.createElement(PortadaDeFichaje, {
  perfil, club, anterior, salario: 42000, prima: 350000, dorsal: 23, onContinuar: nada,
});

caso('portada: club con colores y club anterior', () =>
  dibujar(portada(barcelona, junior), [
    `data-portada-de-fichaje="${barcelona.name}"`,
    barcelona.name, junior.name, perfil.name, '#23',
  ]));

caso('portada: primera firma, sin club anterior', () =>
  dibujar(portada(barcelona, null), [`data-portada-de-fichaje="${barcelona.name}"`, barcelona.name]));

caso('portada: club sin colores de camiseta', () =>
  dibujar(portada(sinColores, barcelona), [`data-portada-de-fichaje="${sinColores.name}"`]));

// Y que el degradado sea DEL CLUB. Sin esto la portada se dibuja igual de bien con el mismo fondo
// para los 697, que es exactamente lo que el pedido no quería.
caso('portada: el fondo sale de los colores del club', () => {
  const conColor = ULTIMATE_CLUBS_DATABASE.find(c => c.themeColor?.primary);
  if (!conColor) throw new Error('ningun club tiene themeColor: el caso no puede probar nada');
  const html = renderToString(portada(conColor, junior));
  if (!html.includes(conColor.themeColor.primary)) {
    throw new Error(`la portada de ${conColor.name} no usa su color ${conColor.themeColor.primary}`);
  }
});

// --- LA ENTREVISTA ----------------------------------------------------------------------------

const entrevista = (club, anterior) => React.createElement(EntrevistaDeFichaje, {
  perfil, club, anterior, onTerminar: nada,
});

caso('entrevista: primera pregunta, con club anterior', () => {
  const html = dibujar(entrevista(barcelona, junior), [
    `data-entrevista-de-fichaje="${barcelona.name}"`,
    'data-pregunta="por_que_te_fuiste"',
  ]);
  // La pregunta nombra al club que dejás: si no, es una pregunta genérica y da igual de dónde venís.
  if (!html.includes(junior.name)) throw new Error('la primera pregunta no nombra al club anterior');
});

caso('entrevista: sin club anterior no queda un hueco', () => {
  const html = dibujar(entrevista(barcelona, null), ['data-pregunta="por_que_te_fuiste"']);
  // El texto de respaldo es "tu club anterior", y NO puede aparecer si no hay club anterior: la
  // pregunta de esa rama es otra.
  if (html.includes('tu club anterior')) {
    throw new Error('sin club anterior sigue hablando de "tu club anterior"');
  }
});

caso('entrevista: se ven las tres opciones de la primera pregunta', () => {
  const html = renderToString(entrevista(barcelona, junior));
  const [primera] = preguntasDeLaPresentacion(barcelona, junior);
  const faltan = primera.opciones.filter(o => !html.includes(o.texto.slice(0, 25)));
  if (faltan.length) throw new Error(`no se dibujaron ${faltan.length} de las 3 respuestas`);
});

// --- LAS REGLAS ---------------------------------------------------------------------------------

caso('reglas: tres preguntas con tres respuestas cada una', () => {
  const preguntas = preguntasDeLaPresentacion(barcelona, junior);
  if (preguntas.length !== 3) throw new Error(`son ${preguntas.length} preguntas y tienen que ser 3`);
  for (const p of preguntas) {
    if (p.opciones.length !== 3) throw new Error(`"${p.clave}" tiene ${p.opciones.length} respuestas`);
  }
  const claves = new Set(preguntas.map(p => p.clave));
  if (claves.size !== 3) throw new Error('hay dos preguntas con la misma clave');
});

caso('reglas: no hay dos respuestas iguales', () => {
  const textos = preguntasDeLaPresentacion(barcelona, junior).flatMap(p => p.opciones.map(o => o.texto));
  const unicos = new Set(textos);
  if (unicos.size !== textos.length) throw new Error(`${textos.length - unicos.size} respuestas repetidas`);
});

// Cada pregunta tiene que tener un DILEMA: si las tres respuestas dan lo mismo, no estás eligiendo.
caso('reglas: cada pregunta obliga a elegir algo', () => {
  for (const p of preguntasDeLaPresentacion(barcelona, junior)) {
    const fans = new Set(p.opciones.map(o => o.fans));
    const prestigio = new Set(p.opciones.map(o => o.prestigio));
    if (fans.size === 1 && prestigio.size === 1) {
      throw new Error(`"${p.clave}": las tres respuestas dan exactamente lo mismo`);
    }
    // Y el dilema de verdad: la que más hinchada da NO puede ser también la que más prestigio da,
    // o la respuesta correcta sería siempre la misma y las otras dos serían adorno.
    const masFans = [...p.opciones].sort((a, b) => b.fans - a.fans)[0];
    const masPrestigio = [...p.opciones].sort((a, b) => b.prestigio - a.prestigio)[0];
    if (masFans === masPrestigio) throw new Error(`"${p.clave}": una respuesta gana en las dos cosas`);
  }
});

// EL CASO QUE NO SE VE EN PANTALLA: que lo que digas pueda quedar en el archivo.
caso('hemeroteca: al menos una respuesta por pregunta se guarda', () => {
  for (const p of preguntasDeLaPresentacion(barcelona, junior)) {
    const guardable = p.opciones.filter(o => saldoDe(o) >= SALDO_PARA_QUEDAR_GUARDADA);
    if (!guardable.length) {
      throw new Error(`"${p.clave}": ninguna respuesta llega al saldo ${SALDO_PARA_QUEDAR_GUARDADA}`);
    }
  }
});

caso('hemeroteca: la promesa fuerte entra al archivo de verdad', () => {
  const preguntas = preguntasDeLaPresentacion(barcelona, junior);
  const laMasFuerte = preguntas.flatMap(p => p.opciones).sort((a, b) => saldoDe(b) - saldoDe(a))[0];
  const archivo = guardarDeclaracion([], {
    texto: laMasFuerte.texto, saldo: saldoDe(laMasFuerte),
    semana: 40, clubId: barcelona.id, clubName: barcelona.name,
  });
  if (archivo.length !== 1) throw new Error('la declaración más fuerte no quedó guardada');
  if (archivo[0].texto !== laMasFuerte.texto) throw new Error('se guardó otra cosa');
});

// Y la contracara: una respuesta tibia NO tiene que quedar guardada, o el archivo sería un registro
// de todo lo que dijiste y no una memoria de lo que prometiste.
caso('hemeroteca: una respuesta tibia no queda guardada', () => {
  const tibias = preguntasDeLaPresentacion(barcelona, junior)
    .flatMap(p => p.opciones).filter(o => saldoDe(o) < SALDO_PARA_QUEDAR_GUARDADA);
  if (!tibias.length) throw new Error('todas las respuestas se guardan: el filtro no filtra nada');
  const archivo = guardarDeclaracion([], {
    texto: tibias[0].texto, saldo: saldoDe(tibias[0]),
    semana: 40, clubId: barcelona.id, clubName: barcelona.name,
  });
  if (archivo.length !== 0) throw new Error('una respuesta tibia quedó en el archivo');
});

// --- LOS 697 CLUBES ------------------------------------------------------------------------------
//
// La portada se arma con datos del club, y hay clubes sin escudo, sin colores y con nombres largos.
// Se dibujan todos: es barato y es el único momento del juego en el que un club cualquiera aparece
// a pantalla completa.
caso(`portada: los ${ULTIMATE_CLUBS_DATABASE.length} clubes se dibujan`, () => {
  const rotos = [];
  for (const club of ULTIMATE_CLUBS_DATABASE) {
    try {
      const html = renderToString(portada(club, junior));
      if (html.includes('undefined') || html.includes('NaN')) rotos.push(club.name);
    } catch (e) {
      rotos.push(`${club.name} (${e.message})`);
    }
  }
  if (rotos.length) throw new Error(`${rotos.length} portadas rotas: ${rotos.slice(0, 5).join(', ')}`);
});

console.log(fallas === 0
  ? '\nLa ceremonia del fichaje se dibuja y lo que decís puede quedar en el archivo.'
  : `\n${fallas} FALLAS -- la ceremonia del fichaje no está bien`);
process.exit(fallas === 0 ? 0 : 1);
