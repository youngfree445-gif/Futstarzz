// Mercado de fichajes: generación de ofertas, extraída de Dashboard.tsx (era un closure interno
// del componente, recalculado en cada render) para poder reusarla desde App.tsx en el ciclo
// semanal y desde el agente (Agent.type modifica los parámetros de esta misma función).
import { Club, PlayerProfile, TransferOffer, Agent } from './types';
import { clubStrength } from './leagueEngine';

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
    .map(c => {
      const multiplier = (1 + (profile.prestige / 100)) * agentSalaryMultiplier;
      const customSalary = Math.round(c.initialSalary * multiplier);
      const signOnBonus = Math.round(
        (1500 * c.reputation * c.reputation
          + profile.careerStats.golesHistoricos * 750
          + profile.careerStats.campeonatos * 2000) * agentBonusMultiplier
      );
      const { reqPrestige, reqMatches } = requisitosDe(c, currentClub, profile.agent);

      return {
        clubId: c.id,
        salaryOffer: customSalary,
        signOnBonus,
        reqPrestige,
        reqMatches,
        possible: performanceScore >= reqPrestige && matchesPlayed >= reqMatches,
        generatedWeek: currentWeek,
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
export function refreshTransferOffersIfNeeded(
  profile: PlayerProfile,
  currentClub: Club,
  allClubs: Club[]
): Pick<PlayerProfile, 'pendingTransferOffers' | 'transferOffersGeneratedWeek'> {
  if (profile.transferOffersGeneratedWeek === profile.currentWeek && profile.pendingTransferOffers) {
    return { pendingTransferOffers: profile.pendingTransferOffers, transferOffersGeneratedWeek: profile.transferOffersGeneratedWeek };
  }
  const offers = generateTransferOffers(profile, currentClub, allClubs, profile.currentWeek)
    .sort((a, b) => (b.possible === a.possible ? b.reqPrestige - a.reqPrestige : b.possible ? 1 : -1))
    .slice(0, 3);
  return { pendingTransferOffers: offers, transferOffersGeneratedWeek: profile.currentWeek };
}
