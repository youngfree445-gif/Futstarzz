// POR QUE EL BOTON DICE "FINALIZAR TEMPORADA" EN UN DIA CON PARTIDO.
//
//   npx esbuild scripts/ui/analizar_cierre.ts --bundle --platform=node --format=cjs \
//     --outfile=node_modules/.cache/ac.cjs --log-level=error && node node_modules/.cache/ac.cjs
//
// El boton dice eso solo si temporadaRealTerminada es true, y esa es una Y de cinco terminos. Dos de
// ellos se pueden reproducir desde afuera con el calendario: que la liga este agotada y que NO
// queden fechas de seleccion. Si en ese mismo paso el calendario trae un partido de liga, la
// contradiccion esta dentro del propio modulo de calendario y no hay que buscar mas lejos.
import { readdirSync, readFileSync, existsSync } from 'fs';
import { calendarioDeLigaAgotado, quedanFechasDeSeleccion, fixturesAtStep, fechaDelPaso, temporadaDelPaso, hasDatedLeagueSchedule } from '../../src/dateSchedule';

const CARPETA = process.argv[2] ?? 'scripts/ui/verif';
let casos = 0;
for (const f of (existsSync(CARPETA) ? readdirSync(CARPETA) : []).filter(x => x.endsWith('.json') && !x.includes('parcial'))) {
  const b = JSON.parse(readFileSync(`${CARPETA}/${f}`, 'utf8'));
  for (const p of (b.bitacora ?? [])) {
    if (p.seJugo || !p.rival || !/Finalizar Temporada/i.test(p.boton ?? p.crudo ?? '')) continue;
    casos++;
    // El paso del banco y el currentWeek del juego son EL MISMO NUMERO -- medido, 1914 de 1914 --
    // asi que las bitacoras viejas, que no traen la columna, se pueden analizar igual con el paso.
    const club = p.miClub, semana = p.semana ?? p.paso;
    if (!club || semana == null) { console.log(`  ${f} f${p.paso}: sin reloj del juego anotado`); continue; }
    const s = fixturesAtStep(club, semana);
    const hayLiga = (s?.fixtures ?? []).some((x: any) => x.competition.kind === 'league');
    console.log(`\n${f.replace('.json', '')} f${p.paso} (currentWeek ${semana}) · ${club}`);
    console.log(`   la tarjeta anuncio: ${p.competicion} vs ${p.rival}`);
    console.log(`   el calendario en ese paso: ${fechaDelPaso(club, semana)} · temp ${temporadaDelPaso(club, semana)?.temporada}`);
    console.log(`      ${(s?.fixtures ?? []).map((x: any) => `${x.competition.kind}:${x.competition.name} vs ${x.opponentName}`).join(' || ') || '(sin partidos)'}`);
    console.log(`   hasDatedLeagueSchedule: ${hasDatedLeagueSchedule(club)}`);
    console.log(`   calendarioDeLigaAgotado: ${calendarioDeLigaAgotado(club, semana)}   <- tiene que ser true para que el boton diga eso`);
    console.log(`   quedanFechasDeSeleccion: ${quedanFechasDeSeleccion(club, semana)}   <- tiene que ser false`);
    if (hayLiga && calendarioDeLigaAgotado(club, semana)) {
      console.log('   *** CONTRADICCION: el calendario da un partido de LIGA y a la vez dice que la liga se agoto.');
    }
  }
}
console.log(`\n${casos} fecha(s) con partido anunciado y boton de cierre.`);
