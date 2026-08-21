// EL PARTIDO QUE SE JUEGA SOLO, SIN PANTALLA.
//
// ---------------------------------------------------------------------------------------------
// QUÉ CAMBIA RESPECTO DE LO QUE HABÍA
// ---------------------------------------------------------------------------------------------
//
// El botón "Simular partido" ya existía, pero no simulaba nada: te metía igual en la pantalla del
// partido, con la velocidad al máximo y contestando las decisiones por vos. Seguías mirando los
// noventa minutos, sólo que rápido y sin tocar nada -- que es lo peor de las dos opciones.
//
// Pedido textual: "que lo simule literal, no que te meta al partido, así como cuando te sancionan".
// O sea: el resultado aparece y listo.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA QUE NO SE PUEDE ROMPER
// ---------------------------------------------------------------------------------------------
//
// UN PARTIDO SIMULADO Y UNO JUGADO TIENEN QUE SALIR DEL MISMO MOTOR. Si el botón usara una cuenta
// aparte -- "tirá un promedio y devolvé algo razonable" -- habría dos juegos: el que jugás y el que
// simulás, con estadísticas que no se parecen. Y el jugador elegiría el que le conviene.
//
// Por eso acá NO hay ninguna regla nueva. Se juegan los cuatro momentos con el pool real de
// decisiones del puesto, la misma `chanceDeAcertar` que usa la pantalla, la misma escala de
// prestigio y el mismo `simulateMatch` para el marcador. Lo único que no ocurre es el render.
//
// Y devuelve EXACTAMENTE la forma que espera `onFinishMatch`, así que todo lo que viene después --
// las tarjetas, las lesiones, el apodo, el cabeza a cabeza, la temporada -- corre igual y no hay
// que duplicar nada de eso.
//
// ---------------------------------------------------------------------------------------------
// CÓMO ELIGE
// ---------------------------------------------------------------------------------------------
//
// Elige la opción que MEJOR LE CALZA A TU FICHA: la de mayor chance según tus atributos, con la
// situación del partido pesando igual que cuando jugás vos (ver pesoDeLaSituacion). No elige la que
// más paga ni la más segura: elige la que un jugador con tus números tiene más posibilidades de
// terminar bien, que es lo que haría cualquiera que se conoce.

import { chanceDeAcertar, MOMENTOS_POR_PARTIDO, prestigioDeLaJugada, CUANTO_VALE_UN_PUNTO } from './decisionDelPartido';
import { factorDeMarcaPersonal } from './dificultad';
import { pesoDeLlevarla } from './laCamiseta';
import type { PlayerProfile, PlayerStats } from './types';

/** Los minutos en que se decide algo. Los mismos que reparte getDecisionMinutes en la pantalla. */
export const MINUTOS_DE_DECISION = [16, 38, 61, 83];

/** Un partido resuelto, con la misma forma que espera onFinishMatch. */
export interface ResultadoSimulado {
  goles: number;
  asistencias: number;
  resultado: 'W' | 'D' | 'L';
  golesRival: number;
  golesMiEquipo: number;
  puntosExperiencia: number;
  salaryEarned: number;
  rating: number;
  log: string[];
  cardReceived: 'none' | 'yellow' | 'red';
  prestigeChange: number;
  fansChange: number;
  jugadasAcertadas?: Partial<Record<keyof PlayerStats, number>>;
}

/** Lo mínimo que hace falta de una jugada del catálogo para poder resolverla sin pantalla. */
export interface OpcionDelCatalogo {
  requiredAttr: keyof PlayerStats;
  minVal: number;
  successChance: number;
  effectOnSuccess: { goals?: number; assists?: number; prestige?: number; fans?: number };
  effectOnFail: { prestige?: number; fans?: number };
  /** Si esta jugada sale mal, puede costarte tarjeta. Sin esto, simular esquivaría las sanciones. */
  cardRiskOnFail?: 'yellow' | 'red';
}
export interface JugadaDelCatalogo {
  prompt: string;
  kickMode?: 'penalty' | 'freekick';
  choices: OpcionDelCatalogo[];
}

export interface DatosDelPartido {
  perfil: PlayerProfile;
  /** El marcador del partido, ya resuelto por simulateMatch. */
  golesMiEquipo: number;
  golesRival: number;
  /** Las bolsas de decisiones de tu puesto. */
  bolsaTemprana: JugadaDelCatalogo[];
  bolsaTardia: JugadaDelCatalogo[];
  /** true si arrancás; el suplente juega menos y decide menos. */
  esTitular: boolean;
  /** El sueldo del partido. */
  salaryEarned: number;
  /** Los dados. Se reciben para que el banco de pruebas pueda correr esto mil veces. */
  dado?: () => number;
}

/** Los mismos números que reparte el minijuego de puntería cuando lo jugás vos. */
const PENAL_ENTRA = 0.72;
const TIRO_LIBRE_ENTRA = 0.34;

/**
 * Juega el partido y devuelve el resultado.
 *
 * No toca el perfil ni el estado: quien llama le pasa el resultado a handleFinishMatch, igual que
 * si vinieras de la pantalla.
 */
export function simularPartidoCompleto(d: DatosDelPartido): ResultadoSimulado {
  const dado = d.dado ?? Math.random;
  const attrs = d.perfil.attributes;
  const nivel = Object.values(attrs).reduce((a, b) => a + b, 0) / 6;
  const marca = factorDeMarcaPersonal(nivel, d.perfil.prestige, pesoDeLlevarla(d.perfil.dorsal));

  // El suplente entra alrededor del minuto 60: le tocan las decisiones tardías nada más.
  const momentos = d.esTitular ? MOMENTOS_POR_PARTIDO : Math.max(1, Math.round(MOMENTOS_POR_PARTIDO * 0.35));

  let prestigio = 0, fans = 0, golesMios = 0, asistencias = 0, aciertos = 0;
  let tarjeta: 'none' | 'yellow' | 'red' = 'none';
  const jugadas: Partial<Record<keyof PlayerStats, number>> = {};
  const log: string[] = [];

  for (let m = 0; m < momentos; m++) {
    const minuto = MINUTOS_DE_DECISION[d.esTitular ? m : MINUTOS_DE_DECISION.length - momentos + m] ?? 61;
    const bolsa = minuto < 45 ? d.bolsaTemprana : d.bolsaTardia;
    if (!bolsa.length) continue;
    const jugada = bolsa[Math.floor(dado() * bolsa.length)];

    // El penal y el tiro libre no tienen las tres opciones: van por el minijuego de puntería y
    // reparten con su propia tabla. Un `choices: []` en el catálogo es esto, no un catálogo roto.
    if (jugada.kickMode) {
      const esPenal = jugada.kickMode === 'penalty';
      const entra = dado() < (esPenal ? PENAL_ENTRA : TIRO_LIBRE_ENTRA);
      prestigio += (entra ? (esPenal ? 5 : 10) : (esPenal ? -8 : -2)) * CUANTO_VALE_UN_PUNTO;
      fans += entra ? (esPenal ? 12 : 28) : (esPenal ? -6 : -1);
      if (entra) { golesMios++; aciertos++; }
      log.push(`${minuto}' ${entra ? `⚽ ¡GOL! ${esPenal ? 'De penal.' : 'De tiro libre.'}` : `❌ ${esPenal ? 'Penal errado.' : 'El tiro libre se fue afuera.'}`}`);
      continue;
    }

    // LA OPCIÓN QUE MEJOR LE CALZA A TU FICHA. No la que más paga: la que tenés más chances de
    // terminar bien. Es lo que haría un jugador que se conoce.
    const conChance = jugada.choices.map(o => ({
      o,
      chance: chanceDeAcertar({
        atributo: attrs[o.requiredAttr], minVal: o.minVal, successChance: o.successChance,
        presion: marca, marcaFactor: marca, starMode: d.perfil.starModeEnabled, ruido: 0,
      }),
    }));
    const elegida = conChance.reduce((mejor, x) => (x.chance > mejor.chance ? x : mejor)).o;

    const chance = chanceDeAcertar({
      atributo: attrs[elegida.requiredAttr], minVal: elegida.minVal, successChance: elegida.successChance,
      presion: marca, marcaFactor: marca, starMode: d.perfil.starModeEnabled, ruido: dado() - 0.5,
    });
    const acerto = dado() < chance;
    if (acerto) {
      aciertos++;
      jugadas[elegida.requiredAttr] = (jugadas[elegida.requiredAttr] ?? 0) + 1;
      golesMios += elegida.effectOnSuccess.goals ?? 0;
      asistencias += elegida.effectOnSuccess.assists ?? 0;
    }
    prestigio += prestigioDeLaJugada(
      (acerto ? elegida.effectOnSuccess.prestige : elegida.effectOnFail.prestige) ?? 0,
      { successChance: elegida.successChance, minuto, golesMios: d.golesMiEquipo, golesRival: d.golesRival, exito: acerto },
    );
    fans += (acerto ? elegida.effectOnSuccess.fans : elegida.effectOnFail.fans) ?? 0;
    // LA TARJETA SE ARRIESGA IGUAL QUE JUGANDO, y esto no es un detalle: si simular no pudiera
    // costarte una amarilla, simular sería estrictamente más seguro que jugar y la respuesta
    // correcta pasaría a ser simularlo todo. Misma regla que la pantalla -- segunda amarilla en el
    // mismo partido es roja.
    if (!acerto && elegida.cardRiskOnFail && tarjeta !== 'red') {
      if (elegida.cardRiskOnFail === 'red' || tarjeta === 'yellow') {
        tarjeta = 'red';
        log.push(`${minuto}' 🟥 Expulsado.`);
      } else {
        tarjeta = 'yellow';
        log.push(`${minuto}' 🟨 Amarilla.`);
      }
    }

    log.push(`${minuto}' ${acerto ? '✅' : '❌'} ${jugada.prompt.slice(0, 70)}…`);
  }

  // La nota: el piso más lo que hiciste. La misma forma que la de la pantalla.
  const rating = Math.max(3.0, Math.min(10,
    6.0 + aciertos * 0.45 + golesMios * 0.9 + asistencias * 0.5
    + (d.golesMiEquipo > d.golesRival ? 0.4 : d.golesMiEquipo < d.golesRival ? -0.3 : 0)));

  const resultado: 'W' | 'D' | 'L' = d.golesMiEquipo > d.golesRival ? 'W'
    : d.golesMiEquipo < d.golesRival ? 'L' : 'D';

  return {
    goles: Math.min(golesMios, d.golesMiEquipo),  // no podés hacer más goles que tu equipo
    asistencias,
    resultado,
    golesRival: d.golesRival,
    golesMiEquipo: d.golesMiEquipo,
    // La misma cuenta que la pantalla: no puede haber dos formas de ganar experiencia.
    puntosExperiencia: Math.round(rating * 15) + (Math.min(golesMios, d.golesMiEquipo) * 40) + (asistencias * 25),
    salaryEarned: d.salaryEarned,
    rating: Number(rating.toFixed(1)),
    log,
    cardReceived: tarjeta,
    prestigeChange: Math.round(prestigio),
    fansChange: Math.round(fans),
    jugadasAcertadas: jugadas,
  };
}
