// EL INFORME DE LAS DIECINUEVE CARRERAS, JUNTAS.
//
//   npx vite-node scripts/ui/informe_carreras.ts
//
// Lee las bitacoras que dejo carreras_completas.mjs y contesta tres preguntas de un vistazo: por
// donde paso cada jugador, que gano -- sobre todo si gano algo INTERNACIONAL -- y que no cerro.
//
// LOS TITULOS SALEN DE getPalmares, la funcion del propio juego, y no de contar a mano lo que
// aparecio en pantalla: asi la vitrina del informe es la misma que ve el jugador.
import { readdirSync, readFileSync } from 'fs';
import { getPalmares } from '../../src/palmares';
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../../src/data';
import { getLeagueDisplay } from '../../src/leagueDisplay';
import { isApeturaClausuraLeague } from '../../src/leagueEngine';

const CARPETA = 'scripts/ui/carreras';
const nombreDeLiga = (l: string, d?: number) => getLeagueDisplay(l, d).name;

interface Fila {
  club: string; nac: string; edad: number; retirado: boolean; temporadas: number;
  ruta: string[]; fichajes: number; pj: number; goles: number;
  ligas: string[]; copas: string[]; inter: string[]; problemas: string[];
}
const filas: Fila[] = [];

for (const f of readdirSync(CARPETA).filter(x => x.endsWith('.json') && !x.includes('parcial'))) {
  const b = JSON.parse(readFileSync(`${CARPETA}/${f}`, 'utf8'));
  const g = b.guardada ?? {};
  const hist = g.seasonHistory ?? [];
  const st = g.careerStats ?? {};

  // POR DONDE PASO: los clubes en orden, sin repetir el de al lado.
  const ruta: string[] = [];
  for (const t of hist) if (ruta[ruta.length - 1] !== t.clubName) ruta.push(t.clubName);

  let trofeos: any[] = [];
  try {
    trofeos = getPalmares(g, CLUBS as any, nombreDeLiga, isApeturaClausuraLeague);
  } catch (e: any) {
    trofeos = [];
    (b.problemas ??= []).push('getPalmares tiro: ' + e.message);
  }
  const conNombre = (t: any) => `${t.nombre}${t.detalle ? ' (' + t.detalle + ')' : ''}`;

  filas.push({
    club: hist[0]?.clubName ?? f.replace('.json', ''),
    nac: g.nationality ?? '?',
    // EL RETIRO LO DICE EL BANCO, no el guardado: la partida termina en la pantalla de retiro y lo
    // ultimo que quedo escrito en disco es la fecha anterior, con el jugador todavia en actividad.
    edad: g.age, retirado: !!b.retirado, temporadas: hist.length, ruta,
    fichajes: (b.avisos ?? []).filter((a: string) => /^FICHAJE:/.test(a)).length,
    pj: st.partidosHistoricos ?? 0, goles: st.golesHistoricos ?? 0,
    ligas: trofeos.filter(t => t.tipo === 'liga').map(conNombre),
    copas: trofeos.filter(t => t.tipo === 'copa').map(conNombre),
    inter: trofeos.filter(t => t.tipo === 'continental' || t.tipo === 'mundial').map(conNombre),
    problemas: b.problemas ?? [],
  });
}

console.log('\n' + '#'.repeat(94));
console.log(`### ${filas.length} CARRERAS COMPLETAS, DE LOS 25 AL RETIRO`);
console.log('#'.repeat(94));
for (const r of [...filas].sort((a, b) => b.inter.length - a.inter.length)) {
  console.log(`\n  ${r.club}  ·  pasaporte de ${r.nac}`);
  console.log(`    ${r.temporadas} temporadas · ${r.pj} partidos · ${r.goles} goles · cierra a los ${r.edad}${r.retirado ? '  (RETIRADO)' : ''}`);
  console.log(`    recorrido: ${r.ruta.join('  →  ') || '(sin historial)'}    [${r.fichajes} traspaso(s)]`);
  if (r.inter.length) console.log(`    ★ INTERNACIONAL: ${r.inter.join(' · ')}`);
  if (r.ligas.length) console.log(`    ligas: ${r.ligas.join(' · ')}`);
  if (r.copas.length) console.log(`    copas: ${r.copas.join(' · ')}`);
  for (const p of r.problemas) console.log(`    ✗ ${p}`);
}

const n = (f: (r: Fila) => boolean) => filas.filter(f).length;
console.log('\n' + '#'.repeat(94));
console.log('### RESUMEN');
console.log('#'.repeat(94));
console.log(`  llegaron al retiro:        ${n(r => r.retirado)} de ${filas.length}`);
console.log(`  con los 2 traspasos:       ${n(r => r.fichajes >= 2)} de ${filas.length}`);
console.log(`  ganaron algo internacional: ${n(r => r.inter.length > 0)} de ${filas.length}`);
for (const r of filas.filter(r => r.inter.length)) console.log(`     ★ ${r.club}: ${r.inter.join(' · ')}`);
const conErr = filas.filter(r => r.problemas.length);
console.log(`\n  carreras con algo que no cierra: ${conErr.length} de ${filas.length}`);
for (const r of conErr) for (const p of r.problemas) console.log(`     ✗ ${r.club}: ${p}`);
if (!conErr.length) console.log('     (ninguna)');
