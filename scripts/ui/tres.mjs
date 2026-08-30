// TRES CARRERAS COMPLETAS: una europea, una colombiana y una argentina.
// Mismas reglas que carreras_completas.mjs (de los 25 al retiro, dos traspasos, pasaporte distinto
// al de su liga), pero solo estas tres.
import { spawn } from 'child_process';
const EUROPA = ['Ajax','PSV','SL Benfica','FC Porto','Sporting CP','Olympique de Marseille','Villarreal CF',
  'Real Betis','Atalanta','Napoli','Torino','Sassuolo','Sevilla FC','AS Roma','Lazio','Fiorentina','Bologna',
  'RB Leipzig','Bayer 04 Leverkusen','VfB Stuttgart','Eintracht Frankfurt','Aston Villa','Newcastle United',
  'West Ham United','Everton','Fulham'].join('/');
const GRANDE = ['Real Madrid','FC Barcelona','FC Bayern München','Manchester City','Liverpool',
  'Paris Saint-Germain','Inter','Arsenal','Manchester United','Chelsea','Juventus','Milan',
  'Atlético de Madrid','Tottenham Hotspur'].join('/');
const CASOS = [
  ['Real Madrid', 'Española', 'Alemania'],
  ['Junior de Barranquilla', 'Colombiana', 'Brasil'],
  ['Boca Juniors', 'Argentina', 'Inglaterra'],
];
await Promise.all(CASOS.map(([club, liga, nac]) => new Promise(listo => {
  const slug = club.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const h = spawn(process.execPath, ['scripts/ui/correr.mjs', club, liga, '20'], {
    env: { ...process.env, PROGRESO: `scripts/ui/carreras/${slug}.log`, BITACORA: `scripts/ui/carreras/${slug}.json`,
      MINUTOS_DE_BANCO: '42', EDAD: '25', NACIONALIDAD: nac, FICHAR: `${EUROPA}, ${GRANDE}` },
    stdio: ['ignore', 'pipe', 'pipe'] });
  h.stdout.on('data', () => {}); h.stderr.on('data', () => {});
  h.on('close', () => { console.log('listo', club); listo(); });
})));
console.log('LAS TRES TERMINARON');
