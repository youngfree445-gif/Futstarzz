import { pickMatchPhoto, type MatchOutcome } from '../matchPhoto';

// Imagen de tapa del periódico de post-partido, al estilo de las portadas de Score Hero: marcador
// grande sobre una escena que cambia según cómo te fue.
//
// Si hay fotos cargadas en src/assets/press/match/<categoría>/ usa una al azar. Si no, dibuja la
// escena con SVG -- así el periódico nunca queda con un hueco y no depende de fotos de terceros.

interface MatchPhotoProps {
  outcome: MatchOutcome;
  golesMiEquipo: number;
  golesRival: number;
  teamName: string;
  opponentName: string;
  /** Escudo del club, si lo tiene cargado. */
  badgeUrl?: string | null;
  /** Mantiene estable la foto elegida entre re-renders (ver pickMatchPhoto). */
  seed: number;
}

// Paleta por resultado: verde de festejo, ámbar tibio para el empate, rojo apagado en la derrota.
const PALETA: Record<MatchOutcome, { de: string; a: string; acento: string }> = {
  victoria: { de: '#064e3b', a: '#0f172a', acento: '#34d399' },
  empate: { de: '#422006', a: '#0f172a', acento: '#fbbf24' },
  derrota: { de: '#450a0a', a: '#0f172a', acento: '#f87171' },
};

export default function MatchPhoto({
  outcome, golesMiEquipo, golesRival, teamName, opponentName, badgeUrl, seed,
}: MatchPhotoProps) {
  const foto = pickMatchPhoto(outcome, seed);
  const { de, a, acento } = PALETA[outcome];

  return (
    <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {foto ? (
        // object-top: en una foto de fútbol lo que importa (el jugador, su cara, sus manos) está en
        // la mitad superior. Recortando desde arriba, una foto vertical no queda convertida en un
        // primer plano de césped.
        <img
          src={foto}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
        />
      ) : (
        <EscenaDibujada outcome={outcome} de={de} a={a} acento={acento} />
      )}

      {/* Degradado inferior: sostiene el marcador legible sobre cualquier foto. */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

      {/* Marcador, al frente */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex items-end justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {badgeUrl && (
            <img src={badgeUrl} alt="" className="w-20 h-20 md:w-24 md:h-24 object-contain shrink-0 drop-shadow" />
          )}
          <div className="min-w-0">
            <p className="text-3xs md:text-2xs uppercase tracking-widest text-slate-400 font-black truncate">
              {teamName}
            </p>
            <p className="text-3xs md:text-2xs uppercase tracking-widest text-slate-500 font-bold truncate">
              vs {opponentName}
            </p>
          </div>
        </div>

        <div
          className="font-mono font-black text-2xl md:text-4xl tracking-tighter shrink-0 tabular-nums drop-shadow-lg"
          style={{ color: acento }}
        >
          {golesMiEquipo}<span className="text-slate-500 mx-0.5 md:mx-1">-</span>{golesRival}
        </div>
      </div>
    </div>
  );
}

/**
 * Escena de respaldo dibujada con SVG. No pretende ser una foto: es una silueta sobre el campo, con
 * la postura cambiando según el resultado -- brazos arriba festejando, cabizbajo en la derrota.
 */
function EscenaDibujada({ outcome, de, a, acento }: { outcome: MatchOutcome; de: string; a: string; acento: string }) {
  return (
    <svg viewBox="0 0 320 140" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`fondo-${outcome}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={de} />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
        <radialGradient id={`foco-${outcome}`} cx="50%" cy="10%" r="70%">
          <stop offset="0%" stopColor={acento} stopOpacity="0.28" />
          <stop offset="100%" stopColor={acento} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="140" fill={`url(#fondo-${outcome})`} />
      <rect width="320" height="140" fill={`url(#foco-${outcome})`} />

      {/* Tribuna: puntos difusos que sugieren gente sin dibujar caras. */}
      {Array.from({ length: 90 }, (_, i) => (
        <circle
          key={i}
          cx={(i * 37) % 320}
          cy={8 + ((i * 53) % 34)}
          r={1.6}
          fill={acento}
          opacity={0.12 + ((i * 7) % 10) / 55}
        />
      ))}

      {/* Césped y línea del área */}
      <rect y="96" width="320" height="44" fill="#0b3d24" opacity="0.55" />
      <path d="M0 104 H320" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1.5" />
      <ellipse cx="160" cy="140" rx="86" ry="26" fill="#ffffff" fillOpacity="0.04" />

      <Silueta outcome={outcome} acento={acento} />
    </svg>
  );
}

function Silueta({ outcome, acento }: { outcome: MatchOutcome; acento: string }) {
  const cuerpo = '#0f172a';
  if (outcome === 'victoria') {
    // Brazos en alto, torso erguido: festejo.
    return (
      <g transform="translate(160 66)">
        <circle cy="-30" r="9.5" fill={cuerpo} />
        <path d="M-9 -20 L9 -20 L12 14 L-12 14 Z" fill={cuerpo} />
        <path d="M-9 -17 L-26 -40" stroke={cuerpo} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M9 -17 L26 -40" stroke={cuerpo} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-6 14 L-9 44" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
        <path d="M6 14 L9 44" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
        <circle cy="-30" r="15" fill="none" stroke={acento} strokeWidth="1.2" opacity="0.45" />
      </g>
    );
  }
  if (outcome === 'derrota') {
    // Encorvado, manos en las rodillas.
    return (
      <g transform="translate(160 70)">
        <circle cx="2" cy="-18" r="9.5" fill={cuerpo} />
        <path d="M-8 -10 L10 -12 L14 16 L-10 16 Z" fill={cuerpo} />
        <path d="M-7 -6 L-14 18" stroke={cuerpo} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M10 -6 L17 18" stroke={cuerpo} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-5 16 L-8 42" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
        <path d="M8 16 L11 42" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
      </g>
    );
  }
  // Empate: de pie, manos en la cintura.
  return (
    <g transform="translate(160 66)">
      <circle cy="-28" r="9.5" fill={cuerpo} />
      <path d="M-9 -18 L9 -18 L12 14 L-12 14 Z" fill={cuerpo} />
      <path d="M-9 -14 L-19 2 L-11 6" stroke={cuerpo} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M9 -14 L19 2 L11 6" stroke={cuerpo} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M-6 14 L-8 44" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
      <path d="M6 14 L8 44" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}
