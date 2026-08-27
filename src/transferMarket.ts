// Mercado de fichajes: generación de ofertas, extraída de Dashboard.tsx (era un closure interno
// del componente, recalculado en cada render) para poder reusarla desde App.tsx en el ciclo
// semanal y desde el agente (Agent.type modifica los parámetros de esta misma función).
import { Club, PlayerProfile, TransferOffer, Agent } from './types';
import { clubStrength } from './leagueEngine';
import { fechaDelPaso, hasDatedSchedule } from './dateSchedule';
import { teLlamaLaCasa, motivoDelLlamado, temporadasEnLaCasa } from './clubQueTeFormo';

// Corregido: antes "possible" dependía solo del Prestigio (que arranca en 50 y ya deja fichable
// casi cualquier club de reputación <=4 desde la semana 1). Ahora se mide un "Rendimiento" real
// que mezcla prestigio + aporte en cancha (goles+asistencias por partido) + títulos, y además
// exige una cantidad mínima de partidos jugados que crece con el salto de categoría -- así un
// club grande de verdad se siente ganado con el tiempo, no regalado de arranque.
/**
 * El "Rendimiento" con el que te mide el mercado: nivel + prestigio + aporte en cancha + títulos.
 *
 * Los ATRIBUTOS pesan tanto como el prestigio a propósito. Sin ellos, la única forma de que un
 * gigante te mirara era acumular temporadas, y un jugador que explota en su primer año -- números
 * altos y una ficha que ya es de otra categoría -- quedaba invisible para el mercado grande. Ahora
 * un primerísimo año puede alcanzar, que es como funciona el fútbol de verdad.
 *
 * También corrige un sesgo por posición: con la fórmula vieja el aporte por partido (goles +
 * asistencias) mandaba, así que un central o un arquero tenían techo bajo por definición. La ficha
 * los mide por lo que sí hacen.
 *
 * Vive acá y se exporta porque lo necesitan tres lugares (las ofertas, los rumores de prensa y el
 * radar de interés). Estaba copiado a mano en Dashboard.tsx y la copia ya se había desincronizado
 * -- ignoraba el ajuste del agente -- así que los rumores usaban un umbral distinto al de las
 * ofertas que después aparecían.
 */
export function rendimientoDe(profile: PlayerProfile): number {
  const matchesPlayed = profile.careerStats.partidosHistoricos;
  const contributionPerMatch = matchesPlayed > 0
    ? (profile.careerStats.golesHistoricos + profile.careerStats.asistenciasHistoricos) / matchesPlayed
    : 0;
  const atributos = Object.values(profile.attributes);
  const nivel = atributos.length > 0 ? atributos.reduce((a, b) => a + b, 0) / atributos.length : 0;

  return Math.min(100,
    nivel * 0.35
    + profile.prestige * 0.35
    // Con tope: un delantero con 2 goles por partido ya demostró todo lo que se puede demostrar por
    // esta vía, y sin tope el aporte solo se comía la escala entera.
    + Math.min(contributionPerMatch, 1.2) * 25
    + profile.careerStats.campeonatos * 5);
}

/**
 * Lo que ese club te exige para ficharte, ya con el efecto de tu agente aplicado.
 *
 * El umbral es la FUERZA del club (reputación + valor de plantel), la misma que usa la simulación
 * de partidos. Antes salía de `reputation` sola, que va de 1 a 5, y como Junior y el Real Madrid
 * son los dos reputación 5, el gigante europeo no pedía nada más que un club colombiano: con 30
 * partidos y números modestos ya eran alcanzables los 691 clubes del juego.
 *
 * currentClub ya no entra en la cuenta: la fuerza es absoluta, así que un club grande pide lo mismo
 * vengas de donde vengas. Se mantiene el parámetro porque el llamador lo tiene a mano y sirve para
 * no romper las firmas.
 */
export function requisitosDe(club: Club, _currentClub: Club, agent: PlayerProfile['agent']): { reqPrestige: number; reqMatches: number } {
  const fuerza = clubStrength(club);
  return {
    reqPrestige: Math.round(Math.max(8, Math.min(95, fuerza + agentReqPrestigeAdjustment(agent)))),
    // Rodaje mínimo, también proporcional a la talla del club: un gigante no ficha a alguien que
    // todavía no jugó nada, pero 21 partidos entran en una sola temporada -- la puerta al primer
    // año excepcional queda abierta.
    reqMatches: Math.max(4, Math.round(fuerza / 4)),
  };
}

export function generateTransferOffers(
  profile: PlayerProfile,
  currentClub: Club,
  allClubs: Club[],
  currentWeek: number
): TransferOffer[] {
  const matchesPlayed = profile.careerStats.partidosHistoricos;
  const performanceScore = rendimientoDe(profile);

  // El agente modifica el mercado: uno profesional consigue mejores montos y ablanda un poco el
  // umbral de elegibilidad (contactos, mejor presentación de tu perfil); uno familiar/amigo hace
  // lo contrario -- negociación floja, alcance limitado. Sin agente, el mercado es neutro (como
  // era antes de esta feature).
  const agentSalaryMultiplier = agentMultiplier(profile.agent, 'salary');
  const agentBonusMultiplier = agentMultiplier(profile.agent, 'bonus');

  return allClubs
    .filter(c => c.id !== profile.currentClubId)
    // UN CLUB SIN CALENDARIO NO TE PUEDE FICHAR. Son 84 de los 697 -- casi toda la tercera de
    // Argentina, más algún europeo suelto como el Boavista -- y no tienen ni un partido: aceptar esa
    // oferta te dejaba en un club donde no ibas a jugar nunca. Lo encontró el simulador de carreras
    // la primera vez que se le enseñó a mirar el mercado, jugando con el Santos.
    .filter(c => hasDatedSchedule(c.name))
    .map(c => {
      const multiplier = (1 + (profile.prestige / 100)) * agentSalaryMultiplier;
      const customSalary = Math.round(c.initialSalary * multiplier);
      const signOnBonus = Math.round(
        (1500 * c.reputation * c.reputation
          + profile.careerStats.golesHistoricos * 750
          + profile.careerStats.campeonatos * 2000) * agentBonusMultiplier
      );
      const { reqPrestige, reqMatches } = requisitosDe(c, currentClub, profile.agent);

      // LA VUELTA A CASA se salta los dos requisitos. No es un descuido: es la regla. A los 33, con
      // el prestigio caído y sin mercado, el club que te formó sigue siendo el único que atiende el
      // teléfono -- y si esa oferta tuviera que cumplir un umbral, no aparecería justo cuando es lo
      // único que te queda, que es cuando significa algo.
      const esCasa = teLlamaLaCasa(profile, c.id);

      return {
        clubId: c.id,
        // Pagan lo que pueden, que es poco. Si el club que te formó pagara como un grande, la
        // decisión de volver no existiría.
        salaryOffer: esCasa ? Math.round(customSalary * 0.6) : customSalary,
        signOnBonus: esCasa ? Math.round(signOnBonus * 0.4) : signOnBonus,
        reqPrestige,
        reqMatches,
        possible: esCasa || (performanceScore >= reqPrestige && matchesPlayed >= reqMatches),
        generatedWeek: currentWeek,
        ...(esCasa ? {
          esVueltaACasa: true,
          motivo: motivoDelLlamado(c.name, temporadasEnLaCasa(profile), profile.age),
        } : {}),
      };
    });
}

export interface ProgresoHaciaClub {
  clubId: string;
  reqPrestige: number;
  reqMatches: number;
  faltaRendimiento: number;
  faltanPartidos: number;
  /** 0 a 1: qué tan cerca estás de cumplir AMBAS condiciones (manda la más atrasada). */
  progreso: number;
}

/**
 * Radar de interés: los clubes que todavía no podés fichar, ordenados por cuánto te falta.
 *
 * Existe porque el mercado sólo mostraba las 3 mejores ofertas ya disponibles, así que un club
 * grande aparecía de la nada el día que lo alcanzabas: no había forma de saber cuánto faltaba, ni
 * si faltaba rendimiento o partidos. La carrera larga se sostiene con esa zanahoria a la vista.
 *
 * Usa exactamente el mismo criterio que las ofertas reales -- no una estimación aparte -- así que
 * si dice "te faltan 8", a los 8 la oferta aparece.
 */
export function radarDeInteres(
  profile: PlayerProfile,
  currentClub: Club,
  allClubs: Club[],
  cantidad = 4,
): ProgresoHaciaClub[] {
  const rendimiento = rendimientoDe(profile);
  const partidos = profile.careerStats.partidosHistoricos;

  // Sin filtro por reputación: ahora el umbral es la fuerza absoluta del club, así que los que
  // quedan fuera de alcance son justamente los grandes. Un club chico nunca aparece acá porque su
  // fuerza es baja y ya lo cumplís.
  const fueraDeAlcance = allClubs
    .filter(c => c.id !== profile.currentClubId)
    // El mismo filtro que las ofertas: si el club no tiene calendario, no tiene sentido ponerlo como
    // meta. El radar es una zanahoria, y una zanahoria a un club donde nunca vas a jugar es peor que
    // ninguna.
    .filter(c => hasDatedSchedule(c.name))
    .map(c => {
      const { reqPrestige, reqMatches } = requisitosDe(c, currentClub, profile.agent);
      const faltaRendimiento = Math.max(0, Math.ceil(reqPrestige - rendimiento));
      const faltanPartidos = Math.max(0, reqMatches - partidos);
      return {
        club: c,
        clubId: c.id,
        reqPrestige,
        reqMatches,
        faltaRendimiento,
        faltanPartidos,
        // Manda la condición más atrasada: de nada sirve tener el rendimiento si te faltan 30
        // partidos, y mostrar el promedio de las dos daría una sensación de cercanía falsa.
        progreso: Math.min(
          reqPrestige > 0 ? rendimiento / reqPrestige : 1,
          reqMatches > 0 ? partidos / reqMatches : 1,
        ),
      };
    })
    // Sólo los que todavía NO podés fichar: los alcanzados ya están en la lista de ofertas.
    .filter(p => p.faltaRendimiento > 0 || p.faltanPartidos > 0);

  if (fueraDeAlcance.length === 0) return [];

  // Una ESCALERA, no los cuatro clubes más cercanos.
  //
  // Ordenar por cercanía a secas devolvía cuatro nombres intercambiables a los que les faltaba 1
  // punto: informacion inútil, y encima escondía el club con el que el jugador sueña. Se agrupa por
  // peldaño (el requisito exacto), se toma el club más reconocible de cada peldaño -- el de plantel
  // más caro -- y se reparten los peldaños de punta a punta. Así el primero es el próximo paso real
  // y el último es el techo al que apuntás.
  const porPeldano = new Map<number, typeof fueraDeAlcance[number]>();
  for (const p of fueraDeAlcance) {
    const actual = porPeldano.get(p.reqPrestige);
    if (!actual || p.club.marketValue > actual.club.marketValue) porPeldano.set(p.reqPrestige, p);
  }

  const peldanos = [...porPeldano.values()].sort((a, b) => a.reqPrestige - b.reqPrestige);
  const elegidos = peldanos.length <= cantidad
    ? peldanos
    : Array.from({ length: cantidad }, (_, i) =>
        peldanos[Math.round((i * (peldanos.length - 1)) / (cantidad - 1))]);

  return elegidos.map(({ club: _club, ...resto }) => resto);
}

function agentMultiplier(agent: Agent | null | undefined, axis: 'salary' | 'bonus'): number {
  if (!agent) return 1;
  if (agent.type === 'profesional') {
    // Un agente de más reputación negocia mejor: 1.05 a 1.25 según su nivel (1-5).
    const boost = 1 + agent.reputation * 0.04;
    return axis === 'salary' ? boost : boost;
  }
  // Familiar/amigo: sin experiencia real en negociación, ofertas más flojas.
  return 0.85;
}

function agentReqPrestigeAdjustment(agent: Agent | null | undefined): number {
  if (!agent) return 0;
  if (agent.type === 'profesional') return -agent.reputation; // hasta -5, más alcance
  return 6; // familiar/amigo: menos contactos, cuesta más llegar a clubes grandes
}

// Se llama una vez por semana (no en cada render) desde el punto donde ya se avanza currentWeek,
// para que las ofertas de la ventana se mantengan estables mientras el jugador las compara -- ver
// pendingTransferOffers/transferOffersGeneratedWeek en PlayerProfile.
/**
 * CADA CUANTAS FECHAS CAMBIA LA MESA DE OFERTAS.
 *
 * Antes se recalculaba TODAS las fechas, lo cual sonaba a variedad y era lo contrario: como
 * `generateTransferOffers` no tiene ni una pizca de azar -- ordena por requisito y se queda con los
 * tres mejores -- recalcular daba siempre EXACTAMENTE los mismos tres clubes, fecha tras fecha,
 * hasta que tu prestigio saltara un escalón. Reportado jugando: "los traspasos siempre son las
 * mismas opciones".
 *
 * Ahora la mesa se arma una vez cada seis fechas y se queda quieta hasta la siguiente. Que tarde en
 * cambiar es parte de lo que la hace valer: una oferta que se renueva cada fecha no es una oferta,
 * es un catálogo.
 */
export const FECHAS_ENTRE_OFERTAS = 6;

/**
 * CUANTO TENES QUE QUEDARTE despues de un traspaso antes de poder moverte otra vez.
 *
 * Sin esto se podia fichar por un club y aceptar otra oferta dos fechas despues, sin haber jugado
 * casi nada ahi: el traspaso dejaba de ser una decision de carrera y pasaba a ser un boton. Y las
 * mecanicas que dependen de quedarse -- la zona de confort, el mentor, el bonus por presencias --
 * no llegaban a existir nunca.
 *
 * Seis meses REALES, contados de la fecha en que firmaste. No en pasos: un club colombiano juega 65
 * fechas en un año y uno europeo 34 en media temporada, asi que el mismo numero de pasos seria un
 * plazo distinto en cada liga.
 *
 * No aplica al club donde EMPEZASTE la carrera: ahi no firmaste nada, y bloquear la primera salida
 * seria encerrarte donde te toco.
 */
export const MESES_MINIMOS_EN_EL_CLUB = 6;

/** Meses cumplidos entre dos fechas ISO. */
function mesesEntre(desde: string, hasta: string): number {
  const a = new Date(desde), b = new Date(hasta);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return Infinity;
  const meses = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  return b.getDate() >= a.getDate() ? meses : meses - 1;
}

/**
 * ¿Ya podes volver a moverte, o todavia le debes tiempo al club que te ficho?
 *
 * Devuelve los meses que faltan (0 si ya podes irte), para que la pantalla pueda decirlo en vez de
 * mostrar una pestaña vacia sin explicacion.
 */
export function mesesQueFaltanEnElClub(profile: PlayerProfile, currentClub: Club): number {
  if (!profile.fichadoElDia) return 0;
  const hoy = fechaDelPaso(currentClub.name, profile.currentWeek);
  if (!hoy) return 0;
  return Math.max(0, MESES_MINIMOS_EN_EL_CLUB - mesesEntre(profile.fichadoElDia, hoy));
}

/**
 * QUIÉN ENTRA A LA MESA DE TRES.
 *
 * No los tres de requisito más alto -- eso es lo que los hacía siempre iguales. Se sortea entre los
 * clubes que te pueden fichar, con el requisito pesando: los grandes aparecen más seguido, pero
 * cualquiera que te alcance puede tocar la puerta.
 *
 * El sorteo va SEMBRADO con el período, no con Math.random: así la mesa es la misma cada vez que
 * abrís la pestaña dentro del mismo período -- si se re-sorteara en cada render, las ofertas
 * bailarían mientras las mirás -- y cambia sola cuando el período avanza.
 */
function elegirLaMesa(candidatas: TransferOffer[], semilla: number, cuantas: number): TransferOffer[] {
  const barajado = candidatas
    .map((o, i) => {
      const x = Math.sin((semilla + 1) * 37.7 + i * 13.1) * 43758.5453;
      const azar = x - Math.floor(x);
      // El requisito pesa, pero NO MANDA. Con 0.6 y 40 si mandaba: el requisito llega a 57 y el azar
      // solo a 40, asi que un club modesto casi nunca le ganaba a uno grande y la mesa la copaban
      // siempre los mismos. Reportado jugando: "salen mucho esas mismas ofertas, no hay variedad".
      //
      // Medido sobre 548 clubes y 60 periodos (180 ofertas):
      //
      //   req*0.6  + azar*40   ->  47 clubes distintos, el top-5 se lleva el 30%, requisito medio 78
      //   req*0.45 + azar*55   ->  72 clubes distintos, el top-5 se lleva el 18%, requisito medio 75
      //
      // La variedad sube un 53% y el nivel de los clubes que te llaman casi no baja (78 -> 75): los
      // grandes siguen apareciendo mas seguido, que es lo que esta regla quiere, pero dejan de ser
      // los unicos. El club mas repetido pasa de 15 apariciones a 8.
      return { o, orden: o.reqPrestige * 0.45 + azar * 55 };
    })
    .sort((a, b) => b.orden - a.orden);
  return barajado.slice(0, cuantas).map(x => x.o);
}

export function refreshTransferOffersIfNeeded(
  profile: PlayerProfile,
  currentClub: Club,
  allClubs: Club[]
): Pick<PlayerProfile, 'pendingTransferOffers' | 'transferOffersGeneratedWeek'> {
  const periodo = Math.floor(profile.currentWeek / FECHAS_ENTRE_OFERTAS);
  const periodoGuardado = Math.floor((profile.transferOffersGeneratedWeek ?? -999) / FECHAS_ENTRE_OFERTAS);
  if (periodo === periodoGuardado && profile.pendingTransferOffers) {
    return { pendingTransferOffers: profile.pendingTransferOffers, transferOffersGeneratedWeek: profile.transferOffersGeneratedWeek };
  }

  // LA PERMANENCIA MANDA sobre todo lo demas: recien fichado, no hay mesa que mirar.
  if (mesesQueFaltanEnElClub(profile, currentClub) > 0) {
    return { pendingTransferOffers: [], transferOffersGeneratedWeek: profile.currentWeek };
  }

  const todas = generateTransferOffers(profile, currentClub, allClubs, profile.currentWeek);

  // LA VUELTA A CASA NO SE SORTEA. Es la única oferta que no depende de lo que valés, así que
  // tampoco puede depender de la suerte: si el club que te formó te llama, está en la mesa.
  const casa = todas.filter(o => o.esVueltaACasa);
  const resto = todas.filter(o => !o.esVueltaACasa && o.possible);
  // Y si no hay ninguna alcanzable todavía, se muestran las más cercanas para que la pestaña no
  // quede vacía -- es lo que hacía antes y está bien.
  const fuente = resto.length ? resto : todas.filter(o => !o.esVueltaACasa);

  const offers = [...casa, ...elegirLaMesa(fuente, periodo, Math.max(1, 3 - casa.length))];
  return { pendingTransferOffers: offers, transferOffersGeneratedWeek: profile.currentWeek };
}
