// Documental/biopic al retirarte (Fase 8, la última a propósito): función pura que arma un texto
// narrativo con los hitos reales de la carrera guardada, leyendo todo lo que ya existe en el
// perfil -- cuanto más de las otras fases ya estén implementadas, más rico el material disponible
// sin costo adicional (lesiones, cabeza a cabeza, Balón de Oro, etc.).
import { PlayerProfile } from './types';
import { apodoDe } from './apodo';
import { clubQueTeFormo } from './clubQueTeFormo';

export function generateBiopicNarrative(profile: PlayerProfile): string[] {
  const paragraphs: string[] = [];
  const stats = profile.careerStats;

  paragraphs.push(
    `${profile.name} colgó los botines a los ${profile.age} años, después de ${stats.partidosHistoricos} partidos, ` +
    `${stats.golesHistoricos} goles y ${stats.asistenciasHistoricos} asistencias repartidas en una carrera que empezó ` +
    `${profile.seasonHistory[0] ? `en ${profile.seasonHistory[0].clubName}` : 'desde abajo'}.`
  );

  // EL APODO, apenas terminada la presentación. Es la primera cosa que un documental te diría de un
  // jugador que no viste jugar, porque resume cómo jugaba en dos palabras. Se recalcula acá y no se
  // lee de un campo guardado: es el apodo con el que se retira, que puede no ser con el que empezó.
  const apodo = apodoDe({
    partidos: stats.partidosHistoricos,
    goles: stats.golesHistoricos,
    asistencias: stats.asistenciasHistoricos,
    amarillas: stats.tarjetasAmarillasHistoricas,
    rojas: stats.tarjetasRojasHistoricas,
    posicion: profile.position,
    jugadas: profile.jugadasPorAtributo,
  });
  if (apodo) {
    paragraphs.push(
      `La prensa lo bautizó "${apodo.apodo}", y el apodo no era un capricho: ${apodo.porque.charAt(0).toLowerCase()}${apodo.porque.slice(1)}`
    );
  }

  // VOLVER A CASA cierra el circulo, y el documental es el unico lugar donde el circulo se ve
  // entero: el primer club y el ultimo en la misma frase.
  const casa = clubQueTeFormo(profile);
  if (casa && profile.currentClubId === casa && profile.seasonHistory.length > 3) {
    const nombre = profile.seasonHistory[0].clubName;
    paragraphs.push(
      `Terminó donde empezó. Después de dar la vuelta al mundo, ${profile.name} volvió a ${nombre} ` +
      `para colgar los botines en la cancha donde aprendió a jugar.`
    );
  }

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

  // LA SECUELA, si la hubo. Es distinta de la lesión y merece su propio párrafo: la lesión es algo
  // que le pasó, la secuela es en quién lo convirtió. Un documental cuenta la segunda.
  const secuelas = profile.secuelasDeCarrera ?? [];
  if (secuelas.length > 0) {
    paragraphs.push(
      secuelas.length === 1
        ? `Hubo una que le cambió la forma de jugar. ${secuelas[0].relato} El jugador que volvió no era el mismo, y aprendió a que eso no fuera una mala noticia.`
        : `Su cuerpo lo obligó a reinventarse ${secuelas.length} veces. La última: ${secuelas[secuelas.length - 1].relato}`
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
