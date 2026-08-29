// TRES CARRERAS CORTAS, para medir un arreglo sin esperar dos horas.
//
//   node scripts/ui/verificar.mjs
//
// Hermana chica de carreras_completas.mjs: mismas reglas (arranca a los 25, dos traspasos, una
// nacionalidad distinta por carrera) pero tres clubes y trece temporadas, que es media hora en vez
// de dos. Sirve para contestar "¿el numero bajo?" despues de tocar el motor. Deja todo en
// scripts/ui/verif/, que no va al repositorio.
//
// OJO CON LEER UN CERO COMO VICTORIA: los desacuerdos entre la tarjeta y la cancha dependen de que
// un ascenso o descenso caiga justo sobre tus fechas, y eso cambia de carrera en carrera. Una
// corrida dio 36 y la siguiente, con el mismo codigo, dio 0.
import { spawn } from 'child_process';
const EUROPA = ['Sevilla FC','Torino','Real Betis','Atalanta','Villarreal CF','Sassuolo','Everton','Fulham'].join('/');
const GRANDE = ['Tottenham Hotspur','Atlético de Madrid','Milan','Chelsea','Juventus','Inter'].join('/');
const CASOS = [['Boca Juniors','Argentina','Inglaterra'], ['Borussia Dortmund','Alemana','México'], ['FC Porto','Portuguesa','Colombia']];
await Promise.all(CASOS.map(([club, liga, nac]) => new Promise(listo => {
  const slug = club.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const h = spawn(process.execPath, ['scripts/ui/correr.mjs', club, liga, '13'], {
    env: { ...process.env, PROGRESO: `scripts/ui/verif/${slug}.log`, BITACORA: `scripts/ui/verif/${slug}.json`,
      MINUTOS_DE_BANCO: '30', EDAD: '25', NACIONALIDAD: nac, FICHAR: `${EUROPA}, ${GRANDE}` },
    stdio: ['ignore', 'pipe', 'pipe'] });
  h.stdout.on('data', () => {}); h.stderr.on('data', () => {});
  h.on('close', () => { console.log('listo', club); listo(); });
})));
console.log('LAS TRES TERMINARON');
