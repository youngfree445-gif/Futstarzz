// Mercado de fichajes: generación de ofertas, extraída de Dashboard.tsx (era un closure interno
// del componente, recalculado en cada render) para poder reusarla desde App.tsx en el ciclo
// semanal y desde el agente (Agent.type modifica los parámetros de esta misma función).
import { Club, PlayerProfile, TransferOffer, Agent } from './types';

// Corregido: antes "possible" dependía solo del Prestigio (que arranca en 50 y ya deja fichable
// casi cualquier club de reputación <=4 desde la semana 1). Ahora se mide un "Rendimiento" real
// que mezcla prestigio + aporte en cancha (goles+asistencias por partido) + títulos, y además
// exige una cantidad mínima de partidos jugados que crece con el salto de categoría -- así un
// club grande de verdad se siente ganado con el tiempo, no regalado de arranque.
export function generateTransferOffers(
  profile: PlayerProfile,
  currentClub: Club,
  allClubs: Club[],
  currentWeek: number
): TransferOffer[] {
  const matchesPlayed = profile.careerStats.partidosHistoricos;
  const contributionPerMatch = matchesPlayed > 0
    ? (profile.careerStats.golesHistoricos + profile.careerStats.asistenciasHistoricos) / matchesPlayed
    : 0;
  const performanceScore = Math.min(100, profile.prestige * 0.55 + contributionPerMatch * 70 + profile.careerStats.campeonatos * 6);

  // El agente modifica el mercado: uno profesional consigue mejores montos y ablanda un poco el
  // umbral de elegibilidad (contactos, mejor presentación de tu perfil); uno familiar/amigo hace
  // lo contrario -- negociación floja, alcance limitado. Sin agente, el mercado es neutro (como
  // era antes de esta feature).
  const agentSalaryMultiplier = agentMultiplier(profile.agent, 'salary');
  const agentBonusMultiplier = agentMultiplier(profile.agent, 'bonus');
  const agentReqAdjustment = agentReqPrestigeAdjustment(profile.agent);

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
      const reputationGap = c.reputation - currentClub.reputation;
      const reqPrestige = Math.round(Math.max(0, Math.min(95, c.reputation * 12 + Math.max(0, reputationGap) * 15) + agentReqAdjustment));
      const reqMatches = 4 + Math.max(0, reputationGap) * 5 + (c.reputation - 1) * 2;

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
