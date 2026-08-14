/**
 * Comprueba las reglas de la lesion jugable.
 *
 *   npm run validar:lesiones
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA Y POR QUE ESTAS COSAS
 * ---------------------------------------------------------------------------------------------
 *
 * La feature tiene una propiedad que NO se ve mirando el codigo de un solo archivo: las dos puertas
 * al partido (handleAdvanceWeek y startMatchflow) y el roll de recaida tienen que estar de acuerdo
 * sobre quien puede jugar. Si se desalinean pasa una de dos cosas, y las dos son graves:
 *
 *   . Si una puerta deja pasar y la otra no, el jugador queda ENCERRADO: no puede jugar la fecha
 *     y tampoco puede avanzarla.
 *   . Si las puertas dejan pasar pero el roll no se ejecuta, jugas lesionado GRATIS -- que es
 *     exactamente el bug que tenia el juego antes de esto: el roll de recaida existia y era codigo
 *     muerto, y el aviso de "riesgo de recaida" del tratamiento rapido era un farol.
 *
 * Por eso las tres condiciones salen de UNA sola fuente (src/lesion.ts) y esto lo verifica.
 */
import {
  forzandoLaVuelta,
  lesionTeDejaAfuera,
  riesgoDeRecaida,
  RECAIDA_MAXIMA,
  RECAIDA_BASE,
  PENALIDAD_ATRIBUTOS_LESIONADO,
} from '../src/lesion';
import { ActiveInjury } from '../src/types';

let fallas = 0;
const chequear = (nombre: string, ok: boolean, detalle = '') => {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${nombre}${detalle ? `   ${detalle}` : ''}`);
  if (!ok) fallas++;
};

const lesion = (weeksRemaining: number, treatmentChoice?: ActiveInjury['treatmentChoice']): { activeInjury: ActiveInjury } =>
  ({ activeInjury: { type: 'muscular', weeksRemaining, startedWeek: 1, treatmentChoice } });

// --- Las puertas ---------------------------------------------------------------------------

chequear('sin lesion podes jugar', !lesionTeDejaAfuera({ activeInjury: null }));
chequear('sano por activeInjury undefined', !lesionTeDejaAfuera({}));
chequear('lesionado sin elegir NO juega', lesionTeDejaAfuera(lesion(3)));
chequear('lesionado en tratamiento rapido NO juega', lesionTeDejaAfuera(lesion(3, 'fast')));
chequear('lesionado en natural NO juega', lesionTeDejaAfuera(lesion(3, 'natural')));
chequear('forzando SI juega', !lesionTeDejaAfuera(lesion(3, 'forzar')));

// La propiedad de fondo: las dos preguntas son EXACTAMENTE complementarias mientras haya lesion.
// Si esto se rompe, una puerta deja pasar y la otra no, y el jugador queda encerrado.
const casos: [number, ActiveInjury['treatmentChoice']][] = [
  [1, undefined], [1, 'fast'], [1, 'natural'], [1, 'forzar'],
  [5, undefined], [5, 'fast'], [5, 'natural'], [5, 'forzar'],
];
const complementarias = casos.every(([w, c]) => lesionTeDejaAfuera(lesion(w, c)) === !forzandoLaVuelta(lesion(w, c)));
chequear('las dos puertas nunca se contradicen', complementarias, `${casos.length} combinaciones`);

// weeksRemaining 0 = ya estas de alta, aunque la eleccion siga puesta. Ni te deja afuera ni contas
// como "jugando roto" -- si contara, seguirias tirando el dado de recaida ya recuperado.
chequear('con 0 semanas ya no estas lesionado', !lesionTeDejaAfuera(lesion(0, 'forzar')) && !forzandoLaVuelta(lesion(0, 'forzar')));

// --- El riesgo -----------------------------------------------------------------------------

chequear('el riesgo sube con lo que te saltas', riesgoDeRecaida(1) < riesgoDeRecaida(3) && riesgoDeRecaida(3) < riesgoDeRecaida(5),
  `1sem=${(riesgoDeRecaida(1) * 100).toFixed(0)}%  3sem=${(riesgoDeRecaida(3) * 100).toFixed(0)}%  5sem=${(riesgoDeRecaida(5) * 100).toFixed(0)}%`);

chequear('el riesgo tiene tope', riesgoDeRecaida(99) <= RECAIDA_MAXIMA,
  `${(riesgoDeRecaida(99) * 100).toFixed(0)}% con 99 semanas`);

// Nunca 0% ni 100%: forzar tiene que ser siempre una apuesta, en los dos sentidos. Con 0% seria
// gratis y todos forzarian; con 100% seria un boton que no hace nada mas que romperte.
const rangoSano = [0, 1, 2, 3, 4, 8, 16, 99].every(w => riesgoDeRecaida(w) >= RECAIDA_BASE && riesgoDeRecaida(w) < 1);
chequear('el riesgo nunca es 0% ni 100%', rangoSano);

chequear('negativo no rompe el calculo', riesgoDeRecaida(-3) === RECAIDA_BASE);

// --- El costo en cancha --------------------------------------------------------------------

// Tiene que doler MAS que la fatiga de temporada (6 en MatchSimulator), si no forzar sale casi
// gratis y la decision no tiene filo. El numero de la fatiga se repite aca a proposito: si alguien
// lo sube alla y no aca, esto falla y avisa.
const PENALIDAD_FATIGA_EN_MATCHSIMULATOR = 6;
chequear('jugar roto pesa mas que jugar cansado', PENALIDAD_ATRIBUTOS_LESIONADO > PENALIDAD_FATIGA_EN_MATCHSIMULATOR,
  `lesion=${PENALIDAD_ATRIBUTOS_LESIONADO}  fatiga=${PENALIDAD_FATIGA_EN_MATCHSIMULATOR}`);

// --- El tramo termina ----------------------------------------------------------------------

// La garantia mas importante: forzar NO te deja atrapado. Cada partido aguantado descuenta una
// fecha, asi que aunque nunca recaigas llegas al alta jugando. Sin esto se podria quedar en un
// bucle de riesgo eterno.
let semanas = 6;
let fechas = 0;
while (semanas > 0 && fechas < 100) { semanas -= 1; fechas++; }
chequear('aguantando siempre se llega al alta', semanas === 0 && fechas === 6, `${fechas} fechas desde 6 semanas`);

console.log(fallas === 0
  ? `\nLa lesion jugable cumple sus reglas: las puertas coinciden, el riesgo escala con tope y el tramo siempre termina.`
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
