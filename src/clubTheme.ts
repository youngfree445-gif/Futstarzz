import { Club } from './types';

// Theming dinámico por club: si el club del jugador tiene un color real de camiseta curado
// (Club.themeColor, ver data.ts), repintamos TODA la app reescribiendo en runtime las variables
// CSS que Tailwind v4 ya usa internamente para gold-*/burgundy-* (definidas en index.css bajo
// @theme como --color-gold-50..950 / --color-burgundy-50..950). Como esas variables viven en
// :root y las clases Tailwind las referencian con var(...) en el CSS compilado, sobreescribirlas
// repinta cualquier bg-gold-400/text-burgundy-500/border-gold-600/etc. de toda la app sin tocar
// un solo componente .tsx. Si el club no tiene themeColor curado (la mayoría, ver Fase 5 en
// data.ts), no tocamos nada y queda el dorado/borgoña original.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('');
}

// Mezcla el color base hacia blanco (t>0) o hacia negro (t<0), t en [-1, 1].
function mix(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  if (t >= 0) {
    return rgbToHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t);
  }
  return rgbToHex(r * (1 + t), g * (1 + t), b * (1 + t));
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Muchos clubes reales usan negro o blanco puro como color de camiseta (Juventus, Milan, Boca...),
// que con la curva normal de la escala daría un tono-400 casi invisible sobre el fondo oscuro de
// la app (texto/botones ilegibles). Si el color base es demasiado extremo, lo acercamos a un gris
// medio antes de generar la escala -- conserva el "espíritu" del color (sigue siendo blanco/negro
// visualmente en los tonos claros/oscuros de la escala) pero garantiza que el tono-400 (el más
// usado para texto sobre fondo oscuro) tenga luminosidad suficiente para leerse.
function ensureReadableBase(hex: string): string {
  const lum = relativeLuminance(hex);
  if (lum < 0.12) return mix(hex, 0.35); // muy oscuro (negro, azules marinos) -> aclarar
  if (lum > 0.92) return mix(hex, -0.35); // muy claro (blanco puro) -> oscurecer
  return hex;
}

// Genera una escala de 11 tonos (50..950) a partir de un color base, con la misma curva de
// luminosidad relativa que usa la paleta gold/burgundy original del juego -- así el contraste
// contra el fondo oscuro (slate-950) se mantiene legible sea cual sea el color real del club.
function buildScale(rawHex: string): Record<string, string> {
  const baseHex = ensureReadableBase(rawHex);
  return {
    '50': mix(baseHex, 0.88),
    '100': mix(baseHex, 0.76),
    '200': mix(baseHex, 0.56),
    '300': mix(baseHex, 0.32),
    '400': mix(baseHex, 0.08),
    '500': baseHex,
    '600': mix(baseHex, -0.14),
    '700': mix(baseHex, -0.32),
    '800': mix(baseHex, -0.5),
    '900': mix(baseHex, -0.66),
    '950': mix(baseHex, -0.78),
  };
}

const DEFAULT_GOLD = '#a8842e';
const DEFAULT_BURGUNDY = '#9f1239';

let styleTag: HTMLStyleElement | null = null;

// Aplica (o restaura) el theme de color del club actual. Se llama desde App.tsx cada vez que
// cambia playerProfile.currentClubId -- ver useEffect en App.tsx.
export function applyClubTheme(club: Club | undefined): void {
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'club-theme-override';
    document.head.appendChild(styleTag);
  }

  const primary = club?.themeColor?.primary ?? DEFAULT_GOLD;
  const secondary = club?.themeColor?.secondary ?? DEFAULT_BURGUNDY;
  const goldScale = buildScale(primary);
  const burgundyScale = buildScale(secondary);

  const vars = [
    ...Object.entries(goldScale).map(([tone, hex]) => `--color-gold-${tone}: ${hex};`),
    ...Object.entries(burgundyScale).map(([tone, hex]) => `--color-burgundy-${tone}: ${hex};`),
  ].join('\n  ');

  styleTag.textContent = `:root {\n  ${vars}\n}`;
}
