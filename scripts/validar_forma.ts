/**
 * Comprueba el momento de forma.
 *
 *   npm run validar:forma
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA Y POR QUE
 * ---------------------------------------------------------------------------------------------
 *
 * La forma es facil de escribir mal de una manera que NO se nota jugando: que en realidad sea un
 * promedio disfrazado. La diferencia esta en el tiempo -- si volves de dos meses lesionado y seguis
 * "en racha" por partidos de antes de romperte, eso no es forma, es memoria.
 *
 * Por eso la mitad de los casos de aca son sobre huecos en el calendario y no sobre notas.
 *
 * Lo otro que se verifica es que el efecto sea CHICO y SIMETRICO, comparado contra los otros dos
 * descuentos que viven en la misma cadena de atributos (fatiga 6, jugar lesionado 9). Si la mala
 * racha pesara mas que jugar roto seria una espiral sin salida.
 */
import {
  anotarNota, evaluarForma, ajusteDeForma, rotuloDeForma,
  VENTANA_DE_FORMA, NOTA_BUENA, NOTA_MALA, PARTIDOS_PARA_RACHA, PASOS_QUE_CORTAN_LA_RACHA, AJUSTE_DE_FORMA,
} from '../src/forma';
import { PENALIDAD_ATRIBUTOS_LESIONADO } from '../src/lesion';

let fallas = 0;
const chequear = (nombre: string, ok: boolean, detalle = '') => {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${nombre}${detalle ? `   ${detalle}` : ''}`);
  if (!ok) fallas++;
};

/** Notas consecutivas, una por fecha, terminando en el paso `hasta`. */
const seguidas = (ratings: number[], hasta = 100) =>
  ratings.map((rating, i) => ({ rating, paso: hasta - (ratings.length - 1 - i) }));

// --- Los tres estados ----------------------------------------------------------------------

chequear('sin partidos jugados no hay forma',
  evaluarForma([], 10).estado === 'normal' && evaluarForma(undefined, 10).promedio === null);

chequear('tres buenas seguidas es racha',
  evaluarForma(seguidas([7.5, 8.0, 7.2]), 100).estado === 'en_racha');

chequear('tres malas seguidas es bajon',
  evaluarForma(seguidas([5.0, 4.5, 5.5]), 100).estado === 'en_baja');

chequear('dos buenas todavia no es racha',
  evaluarForma(seguidas([6.0, 7.5, 8.0]), 100).estado === 'normal');

chequear('una mala corta la racha buena',
  evaluarForma(seguidas([8.0, 8.0, 4.0]), 100).estado === 'normal');

chequear('notas del medio no son ni una cosa ni la otra',
  evaluarForma(seguidas([6.2, 6.5, 6.0, 6.4]), 100).estado === 'normal');

// El corte tiene que estar EN el umbral, no arriba: NOTA_BUENA es "a partir de", NOTA_MALA es
// "hasta". Un jugador con tres 7.0 clavados esta en racha.
chequear('el umbral bueno incluye el valor exacto',
  evaluarForma(seguidas([NOTA_BUENA, NOTA_BUENA, NOTA_BUENA]), 100).estado === 'en_racha', `${NOTA_BUENA}`);
chequear('el umbral malo incluye el valor exacto',
  evaluarForma(seguidas([NOTA_MALA, NOTA_MALA, NOTA_MALA]), 100).estado === 'en_baja', `${NOTA_MALA}`);

chequear('cuenta cuantos partidos lleva la racha',
  evaluarForma(seguidas([8, 8, 8, 8]), 100).seguidos === 4);

// --- Lo que separa FORMA de PROMEDIO --------------------------------------------------------

// Tres partidazos y despues dos meses afuera: al volver NO estas en racha.
const trasLesion = evaluarForma(seguidas([8.0, 8.5, 8.2], 40), 40 + PASOS_QUE_CORTAN_LA_RACHA + 1);
chequear('una lesion larga corta la racha',
  trasLesion.estado === 'normal' && trasLesion.seguidos === 0,
  `${PASOS_QUE_CORTAN_LA_RACHA + 1} fechas sin jugar`);

// Justo en el limite todavia cuenta: el corte tiene que ser una regla, no una sorpresa.
const alLimite = evaluarForma(seguidas([8.0, 8.5, 8.2], 40), 40 + PASOS_QUE_CORTAN_LA_RACHA);
chequear('en el limite exacto la racha sobrevive', alLimite.estado === 'en_racha');

// Un hueco largo EN EL MEDIO de la lista tampoco deja armar racha con partidos de los dos lados.
const conHueco = [
  { rating: 8.0, paso: 10 },
  { rating: 8.0, paso: 11 },
  { rating: 8.0, paso: 60 }, // volvio despues de un parate
];
chequear('un hueco en el medio no arma racha',
  evaluarForma(conHueco, 61).estado === 'normal',
  'dos partidazos, parate, un partidazo mas');

// El promedio, en cambio, sigue siendo el de la ventana aunque no haya racha: son cosas distintas.
chequear('el promedio se calcula igual sin racha',
  Math.abs((evaluarForma(conHueco, 61).promedio ?? 0) - 8.0) < 0.001);

// --- La ventana no crece --------------------------------------------------------------------

let notas = undefined as any;
for (let i = 1; i <= 40; i++) notas = anotarNota(notas, 7.5, i);
chequear('la lista nunca supera la ventana',
  notas.length === VENTANA_DE_FORMA,
  `${notas.length} notas despues de 40 partidos`);

chequear('guarda las mas nuevas, no las mas viejas',
  notas[notas.length - 1].paso === 40 && notas[0].paso === 40 - VENTANA_DE_FORMA + 1);

// --- El efecto ------------------------------------------------------------------------------

chequear('la racha suma y el bajon resta lo mismo',
  ajusteDeForma('en_racha') === AJUSTE_DE_FORMA && ajusteDeForma('en_baja') === -AJUSTE_DE_FORMA);

chequear('sin racha no hay ajuste', ajusteDeForma('normal') === 0);

// Comparado contra los otros dos eslabones de la misma cadena. Si la mala racha pesara mas que
// jugar roto, seria una espiral sin salida.
const PENALIDAD_FATIGA_EN_MATCHSIMULATOR = 6;
chequear('la forma pesa menos que la fatiga y que jugar roto',
  AJUSTE_DE_FORMA < PENALIDAD_FATIGA_EN_MATCHSIMULATOR && AJUSTE_DE_FORMA < PENALIDAD_ATRIBUTOS_LESIONADO,
  `forma=${AJUSTE_DE_FORMA}  fatiga=${PENALIDAD_FATIGA_EN_MATCHSIMULATOR}  lesion=${PENALIDAD_ATRIBUTOS_LESIONADO}`);

// --- El rotulo ------------------------------------------------------------------------------

chequear('el rotulo dice cuantos partidos lleva',
  rotuloDeForma(evaluarForma(seguidas([8, 8, 8]), 100)).includes('3'),
  rotuloDeForma(evaluarForma(seguidas([8, 8, 8]), 100)));

chequear('PARTIDOS_PARA_RACHA es coherente con la ventana',
  PARTIDOS_PARA_RACHA >= 2 && PARTIDOS_PARA_RACHA <= VENTANA_DE_FORMA,
  `${PARTIDOS_PARA_RACHA} de ${VENTANA_DE_FORMA}`);

console.log(fallas === 0
  ? `\nEl momento de forma cumple: es forma y no promedio (los parates la cortan), la ventana no crece y el efecto es chico y simetrico.`
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
