// Documental/biopic al retirarte (Fase 8, la última a propósito): función pura que arma un texto
// narrativo con los hitos reales de la carrera guardada, leyendo todo lo que ya existe en el
// perfil -- cuanto más de las otras fases ya estén implementadas, más rico el material disponible
// sin costo adicional (lesiones, cabeza a cabeza, Balón de Oro, etc.).
import { PlayerProfile } from './types';

export function generateBiopicNarrative(profile: PlayerProfile): string[] {
  const paragraphs: string[] = [];
  const stats = profile.careerStats;

  paragraphs.push(
    `${profile.name} colgó los botines a los ${profile.age} años, después de ${stats.partidosHistoricos} partidos, ` +
    `${stats.golesHistoricos} goles y ${stats.asistenciasHistoricos} asistencias repartidas en una carrera que empezó ` +
    `${profile.seasonHistory[0] ? `en ${profile.seasonHistory[0].clubName}` : 'desde abajo'}.`
  );

  const titulos = profile.seasonHistory.filter(s => s.titulo);
  if (titulos.length > 0) {
    const clubes = [...new Set(titulos.map(t => t.clubName))];
    paragraphs.push(
      `Ganó ${titulos.length} título${titulos.length > 1 ? 's' : ''} a lo largo de su carrera, vistiendo la camiseta de ` +
      `${clubes.join(', ')}. ${stats.campeonatos > titulos.length ? 'Algunos llegaron incluso antes de que la prensa empezara a prestarle atención.' : ''}`
    );
  }

  const botasDeOro = profile.seasonHistory.filter(s => s.wasLeagueTopScorer).length;
  if (botasDeOro > 0) {
    paragraphs.push(`Fue máximo goleador de su liga en ${botasDeOro} ocasión${botasDeOro > 1 ? 'es' : ''}, una marca que pocos en su generación pudieron igualar.`);
  }

  const ballonesDeOroGanados = (profile.ballonDorHistory ?? []).filter(b => b.rank === 1).length;
  if (ballonesDeOroGanados > 0) {
    paragraphs.push(`Se llevó el Balón de Oro ${ballonesDeOroGanados} vez${ballonesDeOroGanados > 1 ? 'es' : ''}, consagrándose entre los mejores del mundo en su momento.`);
  } else {
    const mejorPuesto = (profile.ballonDorHistory ?? []).reduce((best, b) => (b.rank && (!best || b.rank < best) ? b.rank : best), null as number | null);
    if (mejorPuesto && mejorPuesto <= 5) {
      paragraphs.push(`Nunca ganó el Balón de Oro, pero llegó a terminar ${mejorPuesto}° en la votación -- a un paso de la gloria máxima.`);
    }
  }

  if (profile.injuriesEnabled && (profile.injuryHistory ?? []).length > 0) {
    const totalSemanasAfuera = (profile.injuryHistory ?? []).reduce((sum, i) => sum + i.weeksOut, 0);
    paragraphs.push(
      `El cuerpo no siempre acompañó: sufrió ${(profile.injuryHistory ?? []).length} lesión${(profile.injuryHistory ?? []).length > 1 ? 'es' : ''} ` +
      `a lo largo de su carrera, que lo dejaron afuera de las canchas ${totalSemanasAfuera} semanas en total. Volvió cada vez.`
    );
  }

  const rivalidades = Object.values(profile.headToHeadRecords ?? {})
    .sort((a, b) => (b.wins + b.draws + b.losses) - (a.wins + a.draws + a.losses))[0];
  if (rivalidades && (rivalidades.wins + rivalidades.draws + rivalidades.losses) >= 5) {
    const total = rivalidades.wins + rivalidades.draws + rivalidades.losses;
    paragraphs.push(
      `Su rival más recurrente fue ${rivalidades.rivalName}, al que enfrentó ${total} veces ` +
      `(${rivalidades.wins} victorias, ${rivalidades.draws} empates, ${rivalidades.losses} derrotas).`
    );
  }

  if (profile.girlfriend?.marriedAt !== undefined) {
    const hijos = profile.girlfriend.children ?? [];
    paragraphs.push(
      `Fuera de la cancha, se casó con ${profile.girlfriend.name}` +
      (hijos.length > 0 ? ` y formaron una familia junto a ${hijos.map(c => c.name).join(', ')}.` : '.')
    );
  }

  paragraphs.push('Hoy el fútbol lo recuerda como uno más de los que le dieron todo, partido a partido, hasta el último minuto.');

  return paragraphs;
}
