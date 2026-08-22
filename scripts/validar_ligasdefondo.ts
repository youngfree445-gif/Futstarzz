/**
 * LAS LIGAS QUE CORREN SIN VOS.
 *
 *   npm run validar:ligasdefondo
 *
 * En Copas y Tablas se puede elegir cualquier liga, y todas las que no fueran la tuya salian con los
 * veinte equipos en cero. Ahora se juegan de fondo, y esto comprueba las dos cosas de las que
 * depende que eso sirva:
 *
 *   1. QUE SEA DETERMINISTA. Si la tabla cambiara entre dos miradas, el jugador veria a su rival
 *      subir y bajar cuatro puestos sin que pase nada, y con razon no le creeria a ninguna.
 *   2. QUE EL FAVORITO GANE MAS SEGUIDO QUE EL RESTO. Una tabla que sale a cara o cruz es peor que
 *      no tenerla: el Sunderland campeon de la Premier se lee como un juego roto.
 */
import { clubesDeLiga } from '../src/clubesJugables';
import { tablaDeFondo, marcadorDeFondo } from '../src/ligasDeFondo';
import { clubStrength } from '../src/leagueEngine';

let fallas = 0;
const caso = (etiqueta: string, fn: () => void) => {
  try { fn(); console.log(`OK    ${etiqueta}`); }
  catch (e) { fallas++; console.log(`FALLA ${etiqueta} -- ${(e as Error).message}`); }
};

const LIGAS = ['Inglesa-1', 'Alemana-1', 'Española-1', 'Italiana-1', 'Colombiana-1'];
const CIERRE: Record<number, string> = { 1: '2026-06-30', 2: '2027-06-30', 3: '2028-06-30', 4: '2029-06-30', 5: '2030-06-30', 6: '2031-06-30' };

caso('las otras ligas dejan de estar en cero', () => {
  const conJuego = LIGAS.filter(k => {
    const t = tablaDeFondo(clubesDeLiga(k), CIERRE[1], 1);
    return t && t.reduce((n, x) => n + x.pj, 0) > 0;
  });
  if (conJuego.length !== LIGAS.length) {
    throw new Error(`solo ${conJuego.length} de ${LIGAS.length} ligas tienen partidos jugados`);
  }
});

caso('la misma liga da SIEMPRE la misma tabla', () => {
  for (const k of LIGAS) {
    const a = JSON.stringify(tablaDeFondo(clubesDeLiga(k), CIERRE[1], 1));
    const b = JSON.stringify(tablaDeFondo(clubesDeLiga(k), CIERRE[1], 1));
    if (a !== b) throw new Error(`${k} cambio entre dos llamadas`);
  }
  // Y el marcador de un partido tambien: es de donde sale todo lo de arriba.
  const [uno, dos] = clubesDeLiga('Alemana-1');
  const x = marcadorDeFondo(uno, dos, '2025-09-13');
  const y = marcadorDeFondo(uno, dos, '2025-09-13');
  if (x.local !== y.local || x.visita !== y.visita) throw new Error('el marcador de un partido cambia entre llamadas');
});

caso('la tabla avanza con el calendario, no se queda quieta', () => {
  const clubes = clubesDeLiga('Alemana-1');
  const jugados = (fecha: string) => tablaDeFondo(clubes, fecha, 1)!.reduce((n, x) => n + x.pj, 0);
  const sep = jugados('2025-09-01'), dic = jugados('2025-12-01'), fin = jugados('2026-05-20');
  if (!(sep < dic && dic < fin)) throw new Error(`no avanza: ${sep} en septiembre, ${dic} en diciembre, ${fin} al final`);
});

caso('un club no juega mas partidos de los que tiene el calendario', () => {
  for (const k of LIGAS) {
    const t = tablaDeFondo(clubesDeLiga(k), CIERRE[1], 1)!;
    const max = Math.max(...t.map(x => x.pj));
    // Nadie puede jugar mas de 2 veces contra cada rival, ida y vuelta.
    if (max > (t.length - 1) * 2) throw new Error(`${k}: un club jugo ${max} partidos con ${t.length} equipos`);
    // Y los puntos tienen que cerrar con los partidos.
    for (const x of t) {
      if (x.g + x.e + x.p !== x.pj) throw new Error(`${k}: ${x.name} tiene ${x.pj} PJ y ${x.g + x.e + x.p} resultados`);
      if (x.puntos !== x.g * 3 + x.e) throw new Error(`${k}: ${x.name} tiene ${x.puntos} pts y le corresponden ${x.g * 3 + x.e}`);
    }
  }
});

// EL CASO QUE ENCONTRO EL BUG DE LA ESCALA.
//
// Con el percentil, diecisiete clubes de la Premier caian en cuatro puntos de fuerza y la tabla
// salia a cara o cruz: 0,45 de correlacion y el favorito campeon 0 de 6 veces, con Sunderland y
// Brentford campeones. Ver fuerzaParaElMercado.
caso('el mas fuerte de cada liga termina arriba mas seguido que abajo', () => {
  const flojas: string[] = [];
  for (const k of LIGAS) {
    const clubes = clubesDeLiga(k);
    const porFuerza = [...clubes].sort((a, b) => clubStrength(b) - clubStrength(a));
    const rhos: number[] = [];
    for (let t = 1; t <= 6; t++) {
      const tab = tablaDeFondo(clubes, CIERRE[t], t);
      if (!tab || tab.reduce((n, x) => n + x.pj, 0) === 0) continue;
      let suma = 0;
      const n = tab.length;
      for (let i = 0; i < n; i++) {
        const c = clubes.find(x => x.name === tab[i].name);
        if (!c) continue;
        suma += (i - porFuerza.findIndex(x => x.id === c.id)) ** 2;
      }
      rhos.push(1 - (6 * suma) / (n * (n * n - 1)));
    }
    const media = rhos.reduce((a, b) => a + b, 0) / rhos.length;
    console.log(`      ${k.padEnd(14)} correlacion fuerza/puesto ${media.toFixed(2)} sobre ${rhos.length} temporadas`);
    if (media < 0.55) flojas.push(`${k} (${media.toFixed(2)})`);
  }
  if (flojas.length) throw new Error(`la tabla sale casi a cara o cruz en: ${flojas.join(', ')}`);
});

console.log(fallas === 0
  ? '\nLas otras ligas se juegan solas, dan siempre lo mismo y el favorito pesa.'
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
