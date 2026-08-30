// QUE HIZO CADA MODO DE JUEGO, comparado contra una carrera normal en las mismas condiciones.
import { readdirSync, readFileSync } from 'fs';
const CARPETA = 'scripts/ui/modos';
const filas: any[] = [];
for (const f of readdirSync(CARPETA).filter(x => x.endsWith('.json') && !x.includes('parcial'))) {
  const b = JSON.parse(readFileSync(`${CARPETA}/${f}`, 'utf8'));
  const g = b.guardada ?? {}, st = g.careerStats ?? {}, hist = g.seasonHistory ?? [];
  const bit = b.bitacora ?? [];
  const ruta: string[] = []; for (const t of hist) if (ruta[ruta.length - 1] !== t.clubName) ruta.push(t.clubName);
  filas.push({
    modo: f.replace('.json', ''),
    retirado: !!b.retirado, temporadas: hist.length, edad: g.age,
    pj: st.partidosHistoricos ?? 0, goles: st.golesHistoricos ?? 0, asist: st.asistenciasHistoricos ?? 0,
    prestigio: g.prestige, media: g.attributes ? Math.round(Object.values(g.attributes as Record<string, number>).reduce((a, b) => a + b, 0) / Object.keys(g.attributes).length) : null,
    lesiones: (g.injuryHistory ?? []).length,
    banca: bit.filter((p: any) => /ARRANC[AÁ]S EN EL BANCO/i.test(p.diceElResumen ?? '')).length,
    clubes: ruta.length, ruta: ruta.slice(0, 4).join(' → '),
    titulos: (g.careerStats ?? {}).campeonatos ?? 0,
    problemas: (b.problemas ?? []).length,
    flags: `vet=${!!g.startedAsVeteran} est=${!!g.starModeEnabled} hard=${!!g.hardcoreEnabled} les=${!!g.injuriesEnabled} dif=${g.difficultyMode}`,
  });
}
const orden = ['normal', 'veterano', 'estrella', 'hardcore', 'lesiones', 'realista'];
filas.sort((a, b) => orden.indexOf(a.modo) - orden.indexOf(b.modo));
console.log('\n' + '#'.repeat(100));
console.log('### UNA CARRERA POR MODO DE JUEGO, todas desde el Junior de Barranquilla');
console.log('#'.repeat(100));
for (const r of filas) {
  console.log(`\n  ${r.modo.toUpperCase()}`);
  console.log(`    ${r.flags}`);
  console.log(`    ${r.temporadas} temporadas · cierra a los ${r.edad}${r.retirado ? ' (RETIRADO)' : ''} · ${r.clubes} club(es): ${r.ruta}`);
  console.log(`    ${r.pj} partidos · ${r.goles} goles · ${r.asist} asistencias · media ${r.media} · prestigio ${r.prestigio}`);
  console.log(`    ${r.titulos} titulos · lesiones sufridas: ${r.lesiones} · fechas que arrancó en el banco: ${r.banca}`);
}
console.log('\n' + '#'.repeat(100));
console.log('### COMPARADO CONTRA LA CARRERA NORMAL');
console.log('#'.repeat(100));
const base = filas.find(r => r.modo === 'normal');
if (base) for (const r of filas.filter(x => x.modo !== 'normal')) {
  const d = (a: number, b: number) => { const v = a - b; return (v >= 0 ? '+' : '') + v; };
  console.log(`  ${r.modo.padEnd(10)} goles ${d(r.goles, base.goles).padStart(6)} · media ${d(r.media, base.media).padStart(4)} · lesiones ${d(r.lesiones, base.lesiones).padStart(4)} · banco ${d(r.banca, base.banca).padStart(5)} · partidos ${d(r.pj, base.pj).padStart(5)}`);
}
