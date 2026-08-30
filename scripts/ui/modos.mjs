// UNA CARRERA COMPLETA POR MODO DE JUEGO, todas desde el Junior.
//
//   node scripts/ui/modos.mjs
//
// Cinco modalidades mas una carrera normal de referencia, de los 18 al retiro. Sirve para contestar
// una sola pregunta: cada modo, ¿hace lo que promete? El resultado del jugador se compara contra la
// carrera normal, que corre con exactamente las mismas condiciones.
import { spawn } from 'child_process';
const CASOS = ['', 'veterano', 'estrella', 'hardcore', 'lesiones', 'realista'];
await Promise.all(CASOS.map(modo => new Promise(listo => {
  const slug = modo || 'normal';
  const h = spawn(process.execPath, ['scripts/ui/correr.mjs', 'Junior de Barranquilla', 'Colombiana', '30'], {
    env: { ...process.env, MODO: modo, PROGRESO: `scripts/ui/modos/${slug}.log`, BITACORA: `scripts/ui/modos/${slug}.json`, MINUTOS_DE_BANCO: '45' },
    stdio: ['ignore', 'pipe', 'pipe'] });
  h.stdout.on('data', () => {}); h.stderr.on('data', () => {});
  h.on('close', () => { console.log('listo', slug); listo(); });
})));
console.log('LAS SEIS TERMINARON');
